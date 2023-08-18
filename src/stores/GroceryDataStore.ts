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
  insertGroceryItems: (items: GroceryStoreItemType[]) => void;
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
      quantity: 0,
      select_id: null,
      grocerystoreitems: [
        {
          created_at: null,
          cid: null,
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
};

const _GroceryDataStore = immer<GroceryStoreState & GroceryStoreActions>(
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
            draft.data.push({ ...newStore, grocerystoreitems: [] });

            console.log(
              `%cState: - Adding ${newStore.name} store`,
              "color: white; background-color: #44693D;",
              JSON.stringify(newStore, null, 1)
            );
          }
        }, initialGroceryStoreState)
      );
    },
    deleteGroceryStore: (storeId: number) => {
      set(
        produce((draft) => {
          if (storeId) {
            const storeIndex = draft.data.findIndex(
              (item: { id: number }) => item.id === storeId
            );
            console.log(
              `%cState: - Deleting ${draft.data[storeIndex].name} store`,
              "color: white; background-color: #D23335;",
              JSON.stringify(draft.data[storeIndex], null, 1)
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

          console.log(
            `%cState: - Update ${draft.data[storeIndex].name} store`,
            "color: white; background-color: #FF5733;",
            JSON.stringify(updatedStore, null, 1)
          );
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
          draft.data[storeIndex].grocerystoreitems.push(item);

          console.log(
            `%cState: - Grocery Store Item ${item?.name} added to store: ${draft?.data[storeIndex]?.name}`,
            "color: white; background-color: #44693D;",
            JSON.stringify(item, null, 1)
          );
        }, initialGroceryStoreState)
      );
    },
    insertGroceryItems: (items: GroceryStoreItemType[]) => {
      set(
        produce((draft) => {
          const storeIndex = draft.data.findIndex(
            (s) => s.id === items[0]?.store_id
          );

          items.forEach((item) =>
            draft.data[storeIndex].grocerystoreitems.push(item)
          );

          console.log(
            `%cState: - Grocery Store Items added to store: ${draft?.data[storeIndex]?.name}`,
            "color: white; background-color: #44693D;",
            JSON.stringify(items, null, 1)
          );
        }, initialGroceryStoreState)
      );
    },
    deleteGroceryItem: (itemId: number) => {
      set(
        produce((draft) => {
          const storeIndex = findGroceryStoreIndex(draft.data, itemId);
          const itemIndex = getGroceryStoreItemIndex(
            draft.data,
            itemId,
            storeIndex
          );

          const itemToBeDelete =
            draft?.data[storeIndex]?.grocerystoreitems[itemIndex];

          console.log(itemToBeDelete, "item to delete");

          console.log(
            `%cState: - Grocery Store Item ${itemToBeDelete?.name} deleted from store: ${draft?.data[storeIndex]?.name}`,
            "color: white; background-color: #D23335;",
            JSON.stringify(itemToBeDelete, null, 1)
          );

          draft.data[storeIndex].grocerystoreitems.splice(itemIndex, 1);
          console.log(draft.data[storeIndex].grocerystoreitems,'item after the splice~!')

        }, initialGroceryStoreState)
      );
    },
    updateGroceryItem: (updatedItemData: GroceryStoreItemType) => {
      set(
        produce((draft) => {
          const storeIndex = findGroceryStoreIndex(
            draft.data,
            updatedItemData.id
          );

          const itemIndex = getGroceryStoreItemIndex(
            draft.data,
            updatedItemData.id,
            storeIndex
          );

          console.log(storeIndex, "store index");
          console.log(itemIndex, "item index");
          const currentItem =
            draft?.data[storeIndex]?.grocerystoreitems?.[itemIndex];

          console.log(updatedItemData, "Updated item from the payload");
          console.log(currentItem, "current item using indices");

          console.log(
            `%cState: - Grocery Store Item ${currentItem?.name} updated ing store: ${draft?.data[storeIndex]?.name}`,
            "color: white; background-color: #FF5733;",
            updatedItemData
          );

          draft.data[storeIndex].grocerystoreitems[itemIndex] = updatedItemData;
        }, initialGroceryStoreState)
      );
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
