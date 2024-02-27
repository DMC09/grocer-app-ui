import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { devtools, persist } from "zustand/middleware";
import { produce } from "immer";
import { CategoryType } from "@/types";

interface CategoryState {
  categories: CategoryType[];
}

type CategoryActions = {
  resetStore: () => void;
  setStore: (fetchedData: CategoryType[]) => void;
};

const initialCategoryState: CategoryState = {
  categories: [],
};

const _CategoryDataStore = immer<CategoryState & CategoryActions>(
  (set, get) => ({
    categories: initialCategoryState.categories,

    resetStore: () => {
      set(initialCategoryState);
    },
    setStore: (fetchedData: CategoryType[]) => {
      set((state) => {
        state.categories = fetchedData;
      });
    },
  })
);

export const CategoryDataStore = create(
  devtools(
    persist(_CategoryDataStore, {
      name: "Category Cache",
      partialize: (state) => ({
        categories: state.categories,
      }),
    })
  )
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Category Data store", CategoryDataStore);
}
