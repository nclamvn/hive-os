import katex from "katex";

/** Fixed editorial TeX only. A single labelled focusable wrapper owns overflow. */
export function EvidenceStudioMath({tex,label}:{tex:string;label:string}) {
  let html:string|null=null;
  if(tex.length<=2000&&!/<\/?(?:script|iframe|img|div|span|svg|a)\b/i.test(tex)&&!/\\(?:href|url|includegraphics|html\w*|def|gdef|newcommand|require)\b/.test(tex))try {
    html=katex.renderToString(tex,{displayMode:false,output:"htmlAndMathml",trust:false,strict:"error",throwOnError:true,maxExpand:100,maxSize:10});
  }catch{/* Unsupported TeX stays escaped text, never executable HTML. */}
  return <div data-testid="studio-formula" tabIndex={0} role="region" aria-label={label} className="text-body text-ink border-line my-5 max-w-full overflow-x-auto rounded-sm border-l-2 py-3 pl-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:scroll-auto">
    {html?<span className="inline-block whitespace-nowrap" dangerouslySetInnerHTML={{__html:html}}/>:<code className="whitespace-pre-wrap break-words">{tex}</code>}
  </div>;
}
