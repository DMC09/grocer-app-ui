import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { devtools, persist } from "zustand/middleware";
import { produce } from "immer";
import { CommonItemToAdd, CommonItemType } from "@/types";

// grocery store
interface CommonItemsState {
  catalog: CommonItemType[];
  itemsToSubmit: CommonItemToAdd[];
}

type CommonItemsActions = {
  resetStore: () => void;
  setCatalogState: (fetchedData: []) => void;
  addToCatalog: (item: CommonItemType) => void;
  removeFromCatalog: (id: number) => void;
  updateToCatalog: (updatedItem: CommonItemType) => void;
  addItemToSubmit: (itemToAdd: CommonItemToAdd) => void;
  removeItemToSubmit: (uniqueItemId: number) => void;
  clearItemsToSubmit: () => void;
  updateItemToSubmit: (index: number, quantity: number) => void;
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
  itemsToSubmit: [],
};

const _CommonItemsDataStore = immer<CommonItemsState & CommonItemsActions>(
  (set, get) => ({
    catalog: initialCommonItemsState.catalog,
    itemsToSubmit: initialCommonItemsState.itemsToSubmit,
    resetStore: () => {
      set(initialCommonItemsState);
    },
    setCatalogState: (fetchedData: []) => {
      set((state) => {
        state.catalog = fetchedData;
      });
    },
    addToCatalog: (item: CommonItemType) => {
      set(
        produce((draft) => {
          if (item) {
            draft.catalog.push(item);
          }
        }, initialCommonItemsState)
      );
    },
    removeFromCatalog: (id: number) => {
      set(
        produce((draft) => {
          if (id) {
            console.log("removing from common items catalog");
            console.log(draft?.catalog);
            const itemIndex = draft.catalog.findIndex((item) => item.id === id);
            draft.catalog.splice(itemIndex, 1);
          }
        }, initialCommonItemsState)
      );
    },
    updateToCatalog: (updatedItem: CommonItemType) => {
      set(
        produce((draft) => {
          const itemIndex = draft.catalog.findIndex(
            (item) => item.id === updatedItem.id
          );

          draft.catalog[itemIndex] = updatedItem;
        }, initialCommonItemsState)
      );
    },
    addItemToSubmit: (itemToAdd: CommonItemToAdd) => {
      set(
        produce((draft) => {
          console.log(itemToAdd, "Trying to Add this item?");
          draft.itemsToSubmit.push(itemToAdd);
        }, initialCommonItemsState)
      );
      {
      }
    },
    removeItemToSubmit: (uniqueItemId: number) => {
      set(
        produce((draft) => {
          const index = draft.itemsToSubmit.findIndex(
            (item) => item.uniqueItemId === uniqueItemId
          );
          console.log(index, "removed this intex??");
          draft.itemsToSubmit.splice(index, 1);
        }, initialCommonItemsState)
      );
    },
    clearItemsToSubmit: () => {
      set((state) => {
        state.itemsToSubmit = initialCommonItemsState.itemsToSubmit;
      });
    },
    updateItemToSubmit: (uniqueItemId: number, newQuantity: number) => {
      set(
        produce((draft: CommonItemsState) => {
          const index = draft.itemsToSubmit.findIndex(
            (item) => item.uniqueItemId === uniqueItemId
          );
          draft.itemsToSubmit[index].quantity = newQuantity;
        }, initialCommonItemsState)
      );
    },
  })
);

export const CommonItemsDataStore = create(
  devtools(
    persist(_CommonItemsDataStore, {
      name: "Common Items Cache",
      partialize: (state) => ({
        catalog: state.catalog,
      }),
    })
  )
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Common Items Data store", CommonItemsDataStore);
}
