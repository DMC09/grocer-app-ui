import { GroceryStoreWithItemsType, ProfileType } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { devtools, persist } from "zustand/middleware";

interface ProfileState {
  data: ProfileType;
}

type ProfileActions = {
  editLastname: (name: string) => void;
  resetStore: () => void;
  setProfileState: (fetchedData: ProfileType) => void;
};

const initialProfileState: ProfileState = {
  data: {
    avatar_url: null,
    created_at: "",
    email: "",
    expanded_dashboard: false,
    expanded_groceryitem: false,
    first_name: null,
    id: "",
    last_name: null,
    phone: null,
    select_id: null,
    updated_at: "",
  },
};

const profileStore = immer<ProfileState & ProfileActions>((set, get) => ({
  data: initialProfileState.data,
  resetStore: () => {
    set(initialProfileState);
  },
  setProfileState: (fetchedData: ProfileType) => {
    set((state) => {
      state.data = fetchedData;
    });
  },
  editLastname: (lastName: string) =>
    set((state) => {
      state.data.last_name = lastName;
    }),
}));

export const useProfileStore = create(
  devtools(persist(profileStore, { name: "Profile store" }))
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Profile store", useProfileStore);
}

interface GroceryStoreState {
  data: GroceryStoreWithItemsType;
}

type GroceryStoreActions = {
  resetStore: () => void;
  setGroceryState: (fetchedData: GroceryStoreWithItemsType) => void;
};

const initialGroceryStoreState: GroceryStoreState = {
  data: {
    created_at: "",
    id: 0,
    image: "",
    name: "",
    quantity: null,
    select_id: null,
    grocerystoreitems: [],
  },
};

const GroceryStoreStore = immer<GroceryStoreState & GroceryStoreActions>(
  (set, get) => ({
    data: initialGroceryStoreState.data,
    resetStore: () => {
      set(initialGroceryStoreState);
    },
    setGroceryState: (fetchedData: GroceryStoreWithItemsType) => {
      set((state) => {
        state.data = fetchedData;
      });
    },
  })
);
