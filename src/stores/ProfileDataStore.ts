import { DashboardView, GroupMemberType, ProfileType } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { subscribeWithSelector } from "zustand/middleware";
import { devtools, persist } from "zustand/middleware";
import { produce } from "immer";
// Profiles
interface ProfileState {
  data: ProfileType;
  groupData: GroupMemberType[];
  dashboardView: DashboardView;
}

type ProfileActions = {
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
    view_all: false,
    view_by_category: false,
    first_name: "",
    id: "",
    last_name: "",
    phone: null,
    select_id: null,
    updated_at: "",
    in_group: false,
  },
  groupData: [
    {
      id: null,
      avatar_url: null,
      email: null,
      first_name: null,
      group_id: null,
      group_image: null,
      group_name: null,
      last_name: null,
    },
  ],
  dashboardView: DashboardView.StoreView,
};

const _ProfileDataStore = immer<ProfileState & ProfileActions>((set, get) => ({
  data: initialProfileState.data,
  groupData: initialProfileState.groupData,
  dashboardView: initialProfileState.dashboardView,
  resetStore: () => {
    set(initialProfileState);
  },
  setProfileState: (fetchedData: ProfileType) => {
    set((state) => {
      state.data = fetchedData;
    });
  },
  setGroupState: (groupMembers: GroupMemberType[]) =>
    set((state) => {
      state.groupData = groupMembers;
    }),
  resetGroupState: () =>
    set((state) => {
      console.log("resetting group data!");
      state.groupData = [];
    }),
}));

export const ProfileDataStore = create(
  subscribeWithSelector(
    devtools(persist(_ProfileDataStore, { name: "Profile Data Cache" }))
  )
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Profile Data State", ProfileDataStore);
}
