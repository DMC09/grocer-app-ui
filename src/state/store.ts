import { ProfileType } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { devtools, persist } from "zustand/middleware";

interface ProfileState {
  data: ProfileType;
  editFirstname: (name: string, state: ProfileState) => void;
}
interface UseProfileState {
  data: ProfileType;
}

type ProfileActions = {
  editLastname: (name: string) => void;
};

//should make an empty set for this.

export const useProfileStore = create<ProfileState>()((set) => ({
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

  editFirstname: (firstName, state) =>
    set({
      data: { ...state.data, first_name: firstName },
    }),
}));

export const ProfileStore = create(
  devtools(
    persist(
      immer<UseProfileState & ProfileActions>((set) => ({
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
        editLastname: (lastName: string) =>
          set((state) => {
            state.data.last_name = lastName;
          }),
      })),
      {
        name: "profile store",
      }
    )
  )
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("useProfileStore", useProfileStore);

  mountStoreDevtool("ProfileStore", ProfileStore);
}
