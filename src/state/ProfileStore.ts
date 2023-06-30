
import { ProfileType } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { devtools, persist } from "zustand/middleware";
import { produce } from "immer";
// Profiles
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
    devtools(persist(profileStore, { name: "Profile cache" }))
  );

  if (process.env.NODE_ENV === "development") {
    mountStoreDevtool("Profile State", useProfileStore);
  }