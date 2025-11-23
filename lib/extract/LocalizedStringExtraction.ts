export class LocalizedStringExtraction {
	localizationKey: string;
	files: Array<{ file: string; line: number }>;

	constructor(localizationKey: string) {
		this.localizationKey = localizationKey;
		this.files = [];
	}

	addLocation(file: string, line: number) {
		this.files.push({ file, line });
	}
}
