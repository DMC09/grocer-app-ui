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
interface GroceryStoreState {
  data: GroceryStoreWithItemsType[];
  groceryStores: GroceryStoreType[];
}

type GroceryStoreActions = {
  resetStore: () => void;
  setStore: (fetchedData: GroceryStoreWithItemsType[]) => void;
};

const initialGroceryStoreState: GroceryStoreState = {
  data: [
    {
      created_at: "",
      id: 0,
      image: "",
      name: "",
      quantity: 0,
      select_id: "",
      grocerystoreitems: [
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
    },
  ],
  groceryStores: [
    {
      created_at: null,
      id: 0,
      image: "",
      name: "",
      quantity: 0,
      select_id: null,
    },
  ],
};

const _GroceryDataStore = immer<GroceryStoreState & GroceryStoreActions>(
  (set, get) => ({
    data: initialGroceryStoreState.data,
    groceryStores: initialGroceryStoreState.groceryStores,
    resetStore: () => {
      set(initialGroceryStoreState);
    },
    setStore: (fetchedData: GroceryStoreWithItemsType[]) => {
      set((state) => {
        state.data = fetchedData;
      });
    },
  })
);

export const GroceryDataStore = create(
  devtools(persist(_GroceryDataStore, { name: "Grocery Data Cache" }))
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Grocery Data store", GroceryDataStore);
}

export function findGroceryStoreIndex(
  data: GroceryStoreWithItemsType[],
  grocerystoreitemId: number
) {
  console.log(data, "grocery store with items passed in");
  console.log(grocerystoreitemId, "storeitemid");

  const grocerystoreIndex = data.findIndex((grocerystore) => {
    return grocerystore?.grocerystoreitems.some((grocerystoreitem) => {
      return grocerystoreitem?.id === grocerystoreitemId;
    });
  });

  return grocerystoreIndex === -1 ? -1 : 0;
}

export function getGroceryStoreItemIndex(
  data: GroceryStoreWithItemsType[],
  grocerystoreitemId: number,
  storeIndex: number
) {
  console.log(data, "grocery store with items passed in");
  console.log(grocerystoreitemId, "storeitemid");
  console.log(storeIndex, "item id");

  const grocerystore = data[storeIndex];
  const grocerystoreitemIndex = grocerystore?.grocerystoreitems?.findIndex(
    (grocerystoreitem) => {
      return grocerystoreitem.id === grocerystoreitemId;
    }
  );

  return grocerystoreitemIndex === -1 ? -1 : grocerystoreitemIndex;
}
