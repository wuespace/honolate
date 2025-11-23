import { argv } from 'node:process';
import { normalizePath } from '../common/normalizePath.ts';
import { InitHolateOptions } from '../hono/InitHolateOptions.ts';
import { Extractions } from './Extractions.ts';

export class JsonWriter<T extends string> {
	public readonly isReadOnly: boolean;

	constructor(
		public config: InitHolateOptions<T>,
		public extractions: Extractions,
		public readonly issues = new Set<string>(),
	) {
		this.isReadOnly = argv.map(s => s.toLowerCase()).includes('--read-only');
	}

	public get isDirty(): boolean {
		return this.issues.size > 0;
	}

	private processLang(lang: T): Record<string, string> {
		const statusQuo = this.getStatusQuo(lang);
		const result: Record<string, string> = { ...statusQuo };

		const missingKeys = this.getMissingKeys(statusQuo);
		for (const key of missingKeys) {
			result[key] = this.config.defaultLanguage === lang ? key : '';
			this.issues.add(`Missing key in ${lang}: ${key}`);
		}

		const superfluousKeys = this.getSuperfluousKeys(statusQuo);
		for (const key of superfluousKeys) {
			delete result[key];
			this.issues.add(`Superfluous key in ${lang}: ${key}`);
		}

		if (this.isReadOnly) {
			return statusQuo;
		}

		return result;
	}

	public writeAll(): void {
		if (this.isReadOnly) {
			return;
		}

		for (const lang of Object.keys(this.config.languages) as T[]) {
			const processed = this.processLang(lang);
			const path = normalizePath(this.config.languages[lang]);
			const content = JSON.stringify(processed, null, 2) + '\n';
			Deno.writeTextFileSync(path, content);
		}
	}

	private getMissingKeys(
		statusQuo: Record<string, string>
	): string[] {
		const missingKeys: string[] = [];
		for (const extraction of this.extractions.getExtractions()) {
			if (!(extraction.localizationKey in statusQuo)) {
				missingKeys.push(extraction.localizationKey);
			}
		}
		return missingKeys;
	}

	private getSuperfluousKeys(
		statusQuo: Record<string, string>
	): string[] {
		const superfluousKeys: string[] = [];
		for (const key of Object.keys(statusQuo)) {
			if (!this.extractions.getExtractions().map(e => e.localizationKey).includes(key)) {
				superfluousKeys.push(key);
			}
		}
		return superfluousKeys;
	}

	private getStatusQuo(lang: T): Record<string, string> {
		const path = normalizePath(this.config.languages[lang]);
		try {
			const content = Deno.readTextFileSync(path);
			return JSON.parse(content) as Record<string, string>;
		} catch {
			return {};
		}
	}
}