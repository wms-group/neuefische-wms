import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/*
 * Combines conditional class names from 'clsx' or 'classnames'
 * with 'tailwind-merge' to avoid TailwindCSS style conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*
* Return current Year
* */
export const FullYear = () => new Date().getFullYear();