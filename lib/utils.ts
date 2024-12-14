import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sanitizeText = (text: string) => {
  return text
    .replace(/\u0000/g, "") // Remove null characters
    .replace(/[\uD800-\uDFFF]/g, "") // Remove surrogate pairs
    .replace(/[\u0000-\u001F]/g, "") // Remove control characters
    .replace(/\\u0000/g, "") // Remove literal "\u0000" strings
    .replace(/\x00/g, "") // Remove null bytes
    .trim(); // Remove leading/trailing whitespace
};
