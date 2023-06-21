import { ProfileType } from "@/types";
import { create } from "zustand";
import { immer } from 'zustand/middleware/immer'

interface ProfileState {
  data: ProfileType;
  editFirstname: (name: string, state: ProfileState) => void;
}

type ProfileActions = {
    editLastname: (name: string, state: ProfileState) => void;
    decrement: (qty: number) => void
  }
  

//should make an empty set for this.

const useProfileStore = create<ProfileState>()((set) => ({
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

export default useProfileStore;
