import CategoriesContext from "./CategoriesContext.ts";
import useCategories from "../hooks/useCategories.ts";

export const CategoriesProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <CategoriesContext.Provider value={useCategories()}>
      {children}
    </CategoriesContext.Provider>
  );
};