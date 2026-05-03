export function mergeJSON(json1, json2) {
  return {
    ...json1,
    ...json2
  };
}