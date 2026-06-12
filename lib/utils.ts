/**
 * Filters out falsy values and joins classnames into a single string.
 */
export function cn(...inputs: Array<string | false | undefined | null>): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Extracts the initials (up to 2 characters) from a name or phrase.
 */
export function initials(value: string): string {
  if (!value) return "";
  return value
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
