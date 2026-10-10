import path from "node:path";

const scopedQa = ["LOCAL_QA", "TIP079_QA", "TIP080_QA"].includes(process.env.HIVE_BUILD_PROFILE);
const config = {
  plugins: {
    // Turbopack treats new URL("./src", import.meta.url) as a module asset.
    // A directory is not such an asset; use the project's working-directory path.
    "@tailwindcss/postcss": scopedQa ? { base: path.resolve(process.cwd(), "src") } : {},
  },
};

export default config;
