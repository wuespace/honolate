import { Extractions } from "./Extractions.ts";
import { TypeScriptSourceFile } from "./TypeScriptSourceFile.ts";

const dir = await Deno.readDir(".");
const filesToCheck = [];
for await (const d of dir) {
  if (d.isFile && (d.name.endsWith(".ts") || d.name.endsWith(".tsx"))) {
    filesToCheck.push(d);
  }
}

const extractions = new Extractions();

console.log("Files to check for CLI compatibility:");
for (const f of filesToCheck) {
  console.log(`- ${f.name}`);

  const file = new TypeScriptSourceFile(
    f.name,
    await Deno.readTextFile(f.name),
    extractions,
  );
  file.process(extractions);
}

const extractedStrings = extractions.getExtractions();
if (extractedStrings.length === 0) {
  console.log("No localization template strings found.");
} else {
  console.log("Extracted localization strings:");
  for (const extraction of extractedStrings) {
    console.log(`Key: ${extraction.localizationKey}`);
    for (const loc of extraction.files) {
      console.log(`  - ${loc.file}:${loc.line}`);
    }
  }
}
