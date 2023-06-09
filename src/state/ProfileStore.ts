import { GroupMemberType, ProfileType } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { subscribeWithSelector } from 'zustand/middleware'
import { devtools, persist } from "zustand/middleware";
import { produce } from "immer";
// Profiles
interface ProfileState {
  data: ProfileType;
  groupData: GroupMemberType[];
}

type ProfileActions = {
  editLastname: (name: string) => void;
  resetStore: () => void;
  setProfileState: (fetchedData: ProfileType) => void;
  setGroupState: (groupMembers: GroupMemberType[]) => void;
  resetGroupState: () => void;
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
    in_group: false,
  },
  groupData: [
    {
      id:null,
      avatar_url: null,
      email: null,
      first_name: null,
      group_id: null,
      group_image: null,
      group_name: null,
      last_name: null,
    },
  ],
};

const profileStore = immer<ProfileState & ProfileActions>((set, get) => ({
  data: initialProfileState.data,
  groupData: initialProfileState.groupData,
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
  setGroupState: (groupMembers: GroupMemberType[]) =>
    set((state) => {
      state.groupData = groupMembers;
    }),
  resetGroupState: () =>
    set((state) => {
      console.log('resetting group data!')
      state.groupData = [];
    }),
}));

export const useProfileStore = create(
  subscribeWithSelector(devtools(persist(profileStore, { name: "Profile cache" })))
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Profile State", useProfileStore);
}
