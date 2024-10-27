export function isNameValid(name: string) {
  return name.length > 5 && name.endsWith("!") && name.includes(" ");
}
