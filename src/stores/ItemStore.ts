import {
  GroceryStoreItemType,
  GroceryStoreType,
  GroceryStoreWithItemsType,
  ProfileType,
} from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { devtools, persist } from "zustand/middleware";
import { produce } from "immer";

// grocery store
interface ItemStoreState {
  data: GroceryStoreItemType[];
}

type ItemStoreActions = {
  resetStore: () => void;
  setStore: (data: GroceryStoreItemType[]) => void;
};

const initialState: ItemStoreState = {
  data: [
    {
      created_at: null,
      common_item_id: null,
      category_id: null,
      id: 0,
      image: null,
      modified_at: null,
      name: "",
      notes: null,
      quantity: 0,
      select_id: null,
      store_id: 0,
    },
  ],
};

const _ItemDataStore = immer<ItemStoreState & ItemStoreActions>((set, get) => ({
  data: initialState.data,
  resetStore: () => {
    set(initialState);
  },
  setStore: (data: GroceryStoreItemType[]) => {
    set((state) => {
      state.data = data;
    });
  },
}));

export const ItemDataStore = create(
  devtools(persist(_ItemDataStore, { name: "Item Data Cache" }))
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Item Data store", ItemDataStore);
}
