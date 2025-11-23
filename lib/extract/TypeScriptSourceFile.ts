import * as ts from 'typescript';
import { Extractions } from './Extractions.ts';
import { expandGlob } from '@std/fs';

/**
 * Represents a TypeScript source file and provides utilities for parsing and extracting
 * internationalization (i18n) template strings.
 *
 * This class wraps a TypeScript source file and processes it to identify tagged template
 * expressions (using `t` or `lt` tags) for translation purposes. It extracts these strings
 * along with their file location information.
 *
 * @example
 * ```typescript
 * const sourceFile = new TypeScriptSourceFile(
 *   'app.ts',
 *   'const msg = t`Hello World`;',
 *   extractions
 * );
 * sourceFile.process();
 * ```
 */
export class TypeScriptSourceFile {
	constructor(
		public fileName: string,
		public content: string,
		public extractions: Extractions,
	) { }

	/**
	 * Creates and returns a TypeScript SourceFile object from the current file's content.
	 *
	 * This method parses the file content using the TypeScript compiler API and creates
	 * a SourceFile AST representation with the latest ECMAScript target version.
	 *
	 * @returns {ts.SourceFile} A TypeScript SourceFile object representing the parsed content
	 * of the current file with parent references enabled.
	 */
	getSourceFile(): ts.SourceFile {
		return ts.createSourceFile(
			this.fileName,
			this.content,
			ts.ScriptTarget.Latest,
			true,
		);
	}

	/**
	 * Traverses and processes the current TypeScript source file, accumulating
	 * extraction results as it walks the AST.
	 *
	 * The traversal starts at the root node returned by `getSourceFile()` and is
	 * delegated to `processNode`.
	 *
	 * If no custom extraction collection is supplied, the instance's
	 * predefined `extractions` is used.
	 *
	 * @param extractions - Collection (e.g., array or map) that will be populated
	 * with extracted information during processing; defaults to the instance's
	 * `extractions`.
	 */
	process(extractions = this.extractions) {
		this.processNode(this.getSourceFile(), extractions);
	}

	private processNode(node: ts.Node, extractions = this.extractions) {
		if (TypeScriptSourceFile.isTemplateString(node)) {
			this.processTemplateString(node, this.getSourceFile(), extractions);
		}
		ts.forEachChild(node, (child) => this.processNode(child, extractions));
	}

	private static isTemplateString(
		node: ts.Node,
	): node is ts.TaggedTemplateExpression {
		return ts.isTaggedTemplateExpression(node) &&
			ts.isIdentifier(node.tag) &&
			(node.tag.text === 't' || node.tag.text === 'lt');
	}

	private processTemplateString(
		node: ts.TaggedTemplateExpression,
		sourceFile: ts.SourceFile,
		extractions: Extractions,
	) {
		let templateString: string;
		const tpl = node.template;
		if (ts.isNoSubstitutionTemplateLiteral(tpl)) {
			templateString = tpl.text;
		} else if (ts.isTemplateExpression(tpl)) {
			let parts = tpl.head.text;
			tpl.templateSpans.forEach((_, index) => {
				const span = tpl.templateSpans[index];
				parts += '{' + index + '}' + span.literal.text;
			});
			templateString = parts;
		} else {
			templateString = '';
		}
		const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
		extractions.addExtraction(templateString, this.fileName, line + 1);
	}

	static async glob(pattern: string, root: string): Promise<string[]> {
		const filePaths: string[] = [];
		for await (const file of expandGlob(pattern, { root })) {
			if (file.isFile) {
				filePaths.push(file.path);
			}
		}
		return filePaths;
	}
}
