import type { InitHonolateOptions } from "../hono/InitHonolateOptions.ts";
import { Extractions } from "./Extractions.ts";
import { JsonWriter } from "./JsonWriter.ts";
import { TypeScriptSourceFile } from "./TypeScriptSourceFile.ts";

/**
 * Runs the i18n extraction CLI with the given options.
 * @param options the {@link InitHonolateOptions} for the project
 * @param rootDir the root directory of the project. Usually `import.meta.dirname`.
 *
 * @example Running from the configuration options
 * import.meta.main && await runCLI(options, import.meta.dirname);
 */
export async function runCLI({
  pattern = "**/*.{ts,tsx}",
  languages,
  defaultLanguage,
}: InitHonolateOptions<string>, rootDir: string) {
  console.log("Running i18n extraction...");

  const tsFilePaths = await TypeScriptSourceFile.glob(pattern, rootDir);
  console.log(`Found ${tsFilePaths.length} TypeScript files:`);
  tsFilePaths.forEach((filePath) => console.log(` - ${filePath}`));
  const extractions = new Extractions();
  for (const filePath of tsFilePaths) {
    const content = await Deno.readTextFile(filePath);
    const tsSourceFile = new TypeScriptSourceFile(
      filePath,
      content,
      extractions,
    );
    tsSourceFile.process();
  }
  console.log(
    `Extracted ${extractions.getExtractions().length} localized strings.`,
  );
  for (const extraction of extractions.getExtractions()) {
    console.log(` - ${extraction.localizationKey}`);
    extraction.files.forEach((loc) => {
      console.log(`    at ${loc.file}:${loc.line}`);
    });
  }

  const jsonWriter = new JsonWriter({
    languages,
    defaultLanguage,
  }, extractions);

  jsonWriter.writeAll();

  if (jsonWriter.isDirty) {
    console.log("Issues were found during extraction:");
    jsonWriter.issues.forEach((issue) => console.log(` - ${issue}`));
    if (jsonWriter.isReadOnly) {
      console.log("Run without --read-only to fix these issues automatically.");
    } else {
      console.log("These issues have been fixed automatically.");
    }
    Deno.exit(1);
  }

  console.log(
    "i18n extraction completed successfully. No changes were necessary.",
  );
  Deno.exit(0);
}
