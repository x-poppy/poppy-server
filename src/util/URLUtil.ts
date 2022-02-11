export function covertQueryStringToMap(queryString: string): Record<string, string> {
  if (!queryString) return {};
  return decodeURIComponent(queryString)
    .split(";")
    .map(item => item.trim())
    .filter(Boolean).reduce<Record<string, string>>((results, item) => {
      const itemParts = item.split(':');
      const itemPart0 = itemParts[0].trim();
      const itemPart1 = itemParts[1].trim();
      results[itemPart0] = itemPart1;
      return results;
    }, {})
}

export default {
  covertQueryStringToMap
};
