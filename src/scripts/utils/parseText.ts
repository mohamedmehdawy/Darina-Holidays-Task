/**
 * this function convert text to target type
 * @param text - the text should be convert
 * @param target - the target of convert
 * @return dom of tagrget 
 */
export function parserText(text: string, target: DOMParserSupportedType) {
    const parser = new DOMParser();
    const result = parser.parseFromString(text, target);
    return result;
}