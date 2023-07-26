import { CommonGroceryStoreItemType } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { devtools, persist } from "zustand/middleware";
import { produce } from "immer";

// grocery store
interface CommonItemsState {
  catalog: CommonGroceryStoreItemType[];
  // itemsToAdd: []
}

type CommonItemsActions = {
  resetStore: () => void;
  setCatalogState: (fetchedData: []) => void;
};

const initialCommonItemsState: CommonItemsState = {
  catalog: [
    {
      category: "",
      id: 0,
      image: "",
      item_name: "",
      item_notes: "",
      select_id: null,
    },
  ],
};

const CommonItemsStore = immer<CommonItemsState & CommonItemsActions>(
  (set, get) => ({
    catalog: initialCommonItemsState.catalog,
    resetStore: () => {
      set(initialCommonItemsState);
    },
    setCatalogState: (fetchedData: []) => {
      set((state) => {
        state.catalog = fetchedData;
      });
    },
  })
);

export const useCommonItemsStore = create(
  devtools(persist(CommonItemsStore, { name: "Common Items store" }))
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Common Items store", useCommonItemsStore);
}
