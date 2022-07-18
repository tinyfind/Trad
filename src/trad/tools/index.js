export function warning(text) {
  throw text;
}

export function getType(data) {
  return Object.prototype.toString
    .call(data)
    .replaceAll(/[\[|\]]|/g, "")
    .split(" ")[1]
    .toLowerCase();
}
