"use client";

import { createContext, useContext, useState } from "react";

type DialogContext = {
  showCommonItemsDialog: boolean;
  openCommonItemsDialog: () => void;
  closeCommonItemsDialog: () => void;
  showNewItemDialog: boolean;
  openNewItemDialog: () => void;
  closeNewItemDialog: () => void;
  showNewStoreDialog: boolean;
  openNewStoreDialog: () => void;
  closeNewStoreDialog: () => void;
  showStoreSettingsDialog: boolean;
  openStoreSettingsDialog: () => void;
  closeStoreSettingsDialog: () => void;
};

const Context = createContext<DialogContext | undefined>(undefined);

export function DialogContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showCommonItemsDialog, setShowCommonItemsDialog] = useState(false);

  async function openCommonItemsDialog() {
    setShowCommonItemsDialog(true);
  }
  async function closeCommonItemsDialog() {
    setShowCommonItemsDialog(false);
  }

  const [showNewItemDialog, setshowNewItemDialog] = useState(false);

  async function openNewItemDialog() {
    setshowNewItemDialog(true);
  }
  async function closeNewItemDialog() {
    setshowNewItemDialog(false);
  }

  const [showNewStoreDialog, setShowNewStoreDialog] = useState(false);

  async function openNewStoreDialog() {
    setShowNewStoreDialog(true);
  }
  async function closeNewStoreDialog() {
    setShowNewStoreDialog(false);
  }
  const [showStoreSettingsDialog, setShowStoreSettingsDialog] = useState(false);

  async function openStoreSettingsDialog() {
    setShowStoreSettingsDialog(true);
  }
  async function closeStoreSettingsDialog() {
    setShowStoreSettingsDialog(false);
  }

  return (
    <Context.Provider
      value={{
        showCommonItemsDialog,
        openCommonItemsDialog,
        closeCommonItemsDialog,
        showNewItemDialog,
        openNewItemDialog,
        closeNewItemDialog,
        showNewStoreDialog,
        openNewStoreDialog,
        closeNewStoreDialog,
        showStoreSettingsDialog,
        openStoreSettingsDialog,
        closeStoreSettingsDialog,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useDialog = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error("Context is undefined or wasn't passed in properly");
  }

  return context;
};
