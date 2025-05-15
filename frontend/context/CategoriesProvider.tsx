import CategoriesContext from "./CategoriesContext";
import useCategories from "../src/hooks/useCategories";

export const CategoriesProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <CategoriesContext.Provider value={useCategories()}>
      {children}
    </CategoriesContext.Provider>
  );
};