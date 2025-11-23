import { LocalizedStringExtraction } from "./LocalizedStringExtraction.ts";

export class Extractions {
  private extractions = new Map<string, LocalizedStringExtraction>();

  addExtraction(localizationKey: string, file: string, line: number) {
    let extraction = this.extractions.get(localizationKey);
    if (!extraction) {
      extraction = new LocalizedStringExtraction(localizationKey);
      this.extractions.set(localizationKey, extraction);
    }
    extraction.addLocation(file, line);
  }

  getExtractions(): LocalizedStringExtraction[] {
    return Array.from(this.extractions.values());
  }
}
