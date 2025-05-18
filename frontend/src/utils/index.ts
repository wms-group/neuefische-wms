import {ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

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

export const arraysEqual = (a: string[], b: string[]): boolean => {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => val === b[idx]);
}

/*
* Return Select Groups for react-select from Categories
*/
export {selectGroupsFromCategoryOutputDTOs} from "./CategoryUtils"