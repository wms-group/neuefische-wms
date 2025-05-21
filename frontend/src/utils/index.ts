import {ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {GridLayoutProps} from "@/types";

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
export {selectGroupsFromCategoryOutputDTOs, selectNestedGroupsFromCategoryOutputDTOs} from "./CategoryUtils"

/*
* Return Select Groups for react-select from Products sorted into Categories
*/
export {selectProductsInCategoriesFromCategoryOutputDTOs} from "./product-utils"

/*
* Helper function to create grid-cols/layout base on cols
* */
export const buildGridCols= (gridCols?: GridLayoutProps["gridCols"]) => {
  if(!gridCols) return "grid-cols-1";
  return Object.entries(gridCols).map(([breakpoint, cols]) => (
      breakpoint === "base"
          ? `grid-cols-${cols}`
          : `${breakpoint}:grid-cols-${cols}`
  )).join(" ");
}
