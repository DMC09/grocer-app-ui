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
}

type GroceryStoreActions = {
  resetStore: () => void;
  setGroceryState: (fetchedData: GroceryStoreWithItemsType[]) => void;
  addNewGroceryStore: (newStore: GroceryStoreWithItemsType) => void;
  deleteGroceryStore: (storeId: number) => void;
  updateGroceryStore: (updatedStoreData: GroceryStoreWithItemsType) => void;
  insertGroceryItem: (item: GroceryStoreItemType) => void;
  deleteGroceryItem: (itemId: number) => void;
  updateGroceryItem: (updatedItemData: GroceryStoreItemType) => void;
};

const initialGroceryStoreState: GroceryStoreState = {
  data: [
    {
      created_at: "",
      id: 0,
      image: "",
      name: "",
      quantity: null,
      select_id: null,
      grocerystoreitems: [
        {
          created_at: null,
          id: 0,
          image: null,
          modified_at: null,
          name: null,
          notes: null,
          quantity: null,
          select_id: null,
          store_id: 0,
        },
      ],
    },
  ],
};

const GroceryStoreStore = immer<GroceryStoreState & GroceryStoreActions>(
  (set, get) => ({
    data: initialGroceryStoreState.data,
    resetStore: () => {
      set(initialGroceryStoreState);
    },
    setGroceryState: (fetchedData: GroceryStoreWithItemsType[]) => {
      set((state) => {
        state.data = fetchedData;
      });
    },
    addNewGroceryStore: (newStore: GroceryStoreWithItemsType) => {
      set(
        produce((draft) => {
          if (newStore) {
            console.log("Adding store");
            draft.data.push({ ...newStore, grocerystoreitems: [] });
          }
        }, initialGroceryStoreState)
      );
    },
    deleteGroceryStore: (storeId: number) => {
      set(
        produce((draft) => {
          if (storeId) {
            console.log("deleting store");
            console.log(draft.data);
            const storeIndex = draft.data.findIndex(
              (item: { id: number }) => item.id === storeId
            );
            draft.data.splice(storeIndex, 1);
          }
        }, initialGroceryStoreState)
      );
    },
    updateGroceryStore: (updatedStoreData: GroceryStoreWithItemsType) => {
      set(
        produce((draft) => {
          const storeIndex = draft.data.findIndex(
            (s) => s.id === updatedStoreData?.id
          );

          const updatedStore = {
            ...updatedStoreData,
            grocerystoreitems: draft.data[storeIndex].grocerystoreitems,
          };

          draft.data[storeIndex] = updatedStore;
        }, initialGroceryStoreState)
      );
    },
    insertGroceryItem: (item: GroceryStoreItemType) => {
      set(
        produce((draft) => {
          const storeIndex = draft.data.findIndex(
            (s) => s.id === item.store_id
          );

          console.log(`adding new item to ${draft.data[storeIndex].name}`);

          draft.data[storeIndex].grocerystoreitems.push(item);
        }, initialGroceryStoreState)
      );
    },
    deleteGroceryItem: (itemId: number) => {
      set(
        produce((draft) => {
          const storeIndex = findGrocerystoreIndex(draft, itemId);
          const itemIndex = findGrocerystoreitemIndexInStore(
            draft,
            itemId,
            storeIndex
          );
          draft.data[storeIndex].grocerystoreitems.splice(itemIndex, 1);
          console.log(
            draft.data[storeIndex].grocerystoreitems,
            "items for the things?"
          );
          console.log(draft.data[storeIndex].name, "name for the items?");
        }, initialGroceryStoreState)
      );
    },
    updateGroceryItem: (updatedItemData: GroceryStoreItemType) => {
      set(
        produce((draft) => {
          const storeIndex = findGrocerystoreIndex(draft, updatedItemData.id);

          const itemIndex = findGrocerystoreitemIndexInStore(
            draft,
            updatedItemData.id,
            storeIndex
          );

          draft.data[storeIndex].grocerystoreitems[itemIndex] = updatedItemData;
        }, initialGroceryStoreState)
      );
    },
  })
);

export const useGroceryStoreStore = create(
  devtools(persist(GroceryStoreStore, { name: "Grocery Store store" }))
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Grocery Store store", useGroceryStoreStore);
}

export function findGrocerystoreIndex(
  state: GroceryStoreState,
  grocerystoreitemId: number
) {
  const grocerystoreIndex = state.data.findIndex((grocerystore) => {
    return grocerystore.grocerystoreitems.some((grocerystoreitem) => {
      return grocerystoreitem.id === grocerystoreitemId;
    });
  });

  return grocerystoreIndex === -1 ? -1 : 0;
}

export function findGrocerystoreitemIndexInStore(
  state: GroceryStoreState,
  grocerystoreitemId: number,
  storeIndex: number
) {
  const grocerystore = state.data[storeIndex];
  const grocerystoreitemIndex = grocerystore.grocerystoreitems.findIndex(
    (grocerystoreitem) => {
      return grocerystoreitem.id === grocerystoreitemId;
    }
  );

  return grocerystoreitemIndex === -1 ? -1 : grocerystoreitemIndex;
}
