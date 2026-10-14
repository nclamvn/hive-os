import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  AlignmentType,
  Document,
  Footer,
  HeadingLevel,
  Packer,
  PageNumber,
  Paragraph,
  TextRun,
} from "docx";
import PDFDocument from "pdfkit";

import type {
  AuthoringCitation,
  AuthoringContent,
  AuthoringDocumentType,
} from "./contracts";
import { AuthoringError } from "./errors";
import { assessAuthoringQuality } from "./quality";

function assertPublishable(content: AuthoringContent, type: AuthoringDocumentType) {
  const quality = assessAuthoringQuality(type, content);
  if (quality.blockerCount > 0) {
    throw new AuthoringError(
      "AUTHORING_QUALITY_BLOCKED",
      "Resolve all blocking quality findings before export",
    );
  }
}

function citationText(citation: AuthoringCitation) {
  return [
    `[@${citation.key}]`,
    citation.authors,
    citation.year ? `(${citation.year}).` : "",
    citation.title,
    citation.publisher,
    citation.canonicalUri,
    citation.locator,
  ]
    .filter(Boolean)
    .join(" ");
}

function bodyParagraphs(body: string, latex: boolean) {
  return body
    .split(/\n{2,}/)
    .map((value) => value.trim())
    .filter(Boolean)
    .map(
      (value) =>
        new Paragraph({
          alignment: latex ? AlignmentType.LEFT : AlignmentType.JUSTIFIED,
          spacing: { after: 160, line: 320 },
          children: [
            new TextRun({
              text: value,
              font: latex ? "Courier New" : "Calibri",
              size: 22,
            }),
          ],
        }),
    );
}

export async function renderAuthoringDocx(
  content: AuthoringContent,
  type: AuthoringDocumentType,
) {
  assertPublishable(content, type);
  const children: Paragraph[] = [
    new Paragraph({
      text: content.title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 240 },
    }),
  ];
  if (content.abstract.trim()) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: content.abstract, italics: true })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 240, line: 300 },
      }),
    );
  }
  for (const section of content.sections) {
    children.push(
      new Paragraph({
        text: section.heading,
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: false,
      }),
      ...bodyParagraphs(section.body, section.kind === "LATEX"),
    );
  }
  if (content.citations.length) {
    children.push(
      new Paragraph({ text: "Tài liệu tham khảo / References", heading: HeadingLevel.HEADING_1 }),
      ...content.citations.map(
        (citation) =>
          new Paragraph({
            text: citationText(citation),
            spacing: { after: 120, line: 290 },
          }),
      ),
    );
  }
  if (content.researchImports.length) {
    children.push(
      new Paragraph({
        text: "Nguồn gốc nghiên cứu / Research provenance",
        heading: HeadingLevel.HEADING_1,
      }),
      ...content.researchImports.map(
        (researchImport) =>
          new Paragraph({
            spacing: { after: 120, line: 290 },
            children: [
              new TextRun({ text: `Research run: ${researchImport.runId}`, bold: true }),
              new TextRun({ text: `\nApproved SHA-256: ${researchImport.approvedDigest}`, font: "Courier New" }),
              new TextRun({ text: `\n${researchImport.sourceIds.length} sources · ${researchImport.findingIds.length} findings` }),
            ],
          }),
      ),
    );
  }
  if (content.computationalArtifacts.length) {
    children.push(
      new Paragraph({
        text: "Phụ lục tính toán / Computational appendix",
        heading: HeadingLevel.HEADING_1,
      }),
      ...content.computationalArtifacts.map(
        (artifact) =>
          new Paragraph({
            spacing: { after: 120, line: 290 },
            children: [
              new TextRun({ text: `${artifact.label} (${artifact.type})`, bold: true }),
              new TextRun({ text: `\n${artifact.storageReference}` }),
              new TextRun({ text: `\nSHA-256: ${artifact.contentHash}`, font: "Courier New" }),
              ...(artifact.verifierNote
                ? [new TextRun({ text: `\n${artifact.verifierNote}` })]
                : []),
            ],
          }),
      ),
    );
  }

  const document = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22, color: "111827" },
          paragraph: { spacing: { after: 160, line: 320 } },
        },
      },
      paragraphStyles: [
        {
          id: "Title",
          name: "Title",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { font: "Calibri", size: 44, bold: true, color: "111827" },
          paragraph: { spacing: { before: 0, after: 240 } },
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { font: "Calibri", size: 32, bold: true, color: "1F4D78" },
          paragraph: {
            spacing: { before: 360, after: 200 },
            keepNext: true,
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: "HIVE OS | " }),
                  new TextRun({ children: [PageNumber.CURRENT] }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });
  return Packer.toBuffer(document);
}

function pdfFonts() {
  // Next can rewrite require.resolve to a virtual (rsc) module path. Read the
  // traced runtime assets directly instead; standalone server.js sets cwd to
  // its own project root, where outputFileTracingIncludes copies these fonts.
  const fontDirectory = resolve(process.cwd(), "node_modules/notosans-fontface/fonts");
  return {
    regularPath: resolve(fontDirectory, "NotoSans-Regular.ttf"),
    regular: readFileSync(
      resolve(fontDirectory, "NotoSans-Regular.ttf"),
    ),
    bold: readFileSync(
      resolve(fontDirectory, "NotoSans-Bold.ttf"),
    ),
  };
}

export async function renderAuthoringPdf(
  content: AuthoringContent,
  type: AuthoringDocumentType,
): Promise<Buffer> {
  assertPublishable(content, type);
  const fonts = pdfFonts();
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const pdf = new PDFDocument({
      // Avoid PDFKit's default Helvetica AFM filesystem lookup under bundling.
      font: fonts.regularPath,
      size: "A4",
      margins: { top: 72, right: 72, bottom: 72, left: 72 },
      bufferPages: true,
      info: { Title: content.title, Producer: "HIVE OS Governed Authoring" },
    });
    pdf.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    pdf.on("error", reject);
    pdf.on("end", () => resolve(Buffer.concat(chunks)));
    pdf.registerFont("Body", fonts.regular);
    pdf.registerFont("Bold", fonts.bold);

    pdf.font("Bold").fontSize(21).fillColor("#111827").text(content.title, {
      lineGap: 4,
    });
    pdf.moveDown(0.8);
    if (content.abstract.trim()) {
      pdf.font("Body").fontSize(10.5).fillColor("#4B5563").text(content.abstract, {
        align: "justify",
        lineGap: 3,
      });
      pdf.moveDown(1.2);
    }
    for (const section of content.sections) {
      pdf.font("Bold").fontSize(15).fillColor("#1F4D78").text(section.heading, {
        lineGap: 3,
      });
      pdf.moveDown(0.45);
      pdf
        .font("Body")
        .fontSize(section.kind === "LATEX" ? 9.5 : 10.5)
        .fillColor("#111827")
        .text(section.body.trim() || " ", {
          align: section.kind === "LATEX" ? "left" : "justify",
          lineGap: 3.5,
        });
      pdf.moveDown(1.05);
    }
    if (content.citations.length) {
      pdf.font("Bold").fontSize(15).fillColor("#1F4D78").text("Tài liệu tham khảo / References");
      pdf.moveDown(0.5);
      for (const citation of content.citations) {
        pdf.font("Body").fontSize(9.5).fillColor("#111827").text(citationText(citation), {
          lineGap: 2.5,
        });
        pdf.moveDown(0.45);
      }
    }
    if (content.researchImports.length) {
      pdf.moveDown(0.7);
      pdf.font("Bold").fontSize(15).fillColor("#1F4D78").text("Nguồn gốc nghiên cứu / Research provenance");
      pdf.moveDown(0.5);
      for (const researchImport of content.researchImports) {
        pdf.font("Bold").fontSize(9.5).fillColor("#111827").text(`Research run: ${researchImport.runId}`);
        pdf.font("Body").fontSize(8).fillColor("#4B5563").text(`Approved SHA-256: ${researchImport.approvedDigest}`);
        pdf.font("Body").fontSize(9).fillColor("#111827").text(`${researchImport.sourceIds.length} sources · ${researchImport.findingIds.length} findings`);
        pdf.moveDown(0.45);
      }
    }
    if (content.computationalArtifacts.length) {
      pdf.moveDown(0.7);
      pdf.font("Bold").fontSize(15).fillColor("#1F4D78").text("Phụ lục tính toán / Computational appendix");
      pdf.moveDown(0.5);
      for (const artifact of content.computationalArtifacts) {
        pdf.font("Bold").fontSize(10).fillColor("#111827").text(`${artifact.label} (${artifact.type})`);
        pdf.font("Body").fontSize(9).text(artifact.storageReference);
        pdf.font("Body").fontSize(8).fillColor("#4B5563").text(`SHA-256: ${artifact.contentHash}`);
        if (artifact.verifierNote) pdf.text(artifact.verifierNote);
        pdf.moveDown(0.6);
      }
    }

    const range = pdf.bufferedPageRange();
    for (let index = range.start; index < range.start + range.count; index += 1) {
      pdf.switchToPage(index);
      pdf
        .font("Body")
        .fontSize(8)
        .fillColor("#6B7280")
        .text(
          `HIVE OS | ${index + 1}`,
          72,
          30,
          {
          width: pdf.page.width - 144,
          align: "right",
          lineBreak: false,
          },
        );
    }
    pdf.end();
  });
}
