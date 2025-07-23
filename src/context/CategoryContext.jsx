import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getLastCategory, setLastCategory } from "../utils/localStorage";

const CategoryContext = createContext();

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [activeCategory, setActiveCategoryState] = useState("a-z games");

  // Load the last selected category from localStorage on component mount
  useEffect(() => {
    const lastCategory = getLastCategory();
    setActiveCategoryState(lastCategory);
  }, []);

  // Memoize the category change handler
  const handleCategoryChange = useCallback((category) => {
    setLastCategory(category);
    setActiveCategoryState(category);
  }, []);

  const value = {
    activeCategory,
    onCategoryChange: handleCategoryChange,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}; 