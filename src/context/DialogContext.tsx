"use client";

import { createContext, useContext, useState } from "react";

type DialogContext = {
  openCommonItemsDialog: boolean ;
  handleCommonItemsDialogOpen: () => void;
  handleCommonItemsDialogClose: () => void;
  openAddNewItemDialog: boolean;
  handleAddNewItemDialogOpen: () => void;
  handleAddNewItemDialogClose: () => void;
  openNewStoreDialog: boolean;
  handleNewStoreDialogOpen: () => void;
  handleNewStoreDialogClose: () => void;
  openStoreSettingsDialog: boolean;
  handleStoreSettingsDialogOpen: () => void;
  handleStoreSettingsDialogClose: () => void;
};


const Context = createContext<DialogContext | undefined>(undefined);

export function DialogContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openCommonItemsDialog, setOpenCommonItemsDialog] = useState(false);

  async function handleCommonItemsDialogOpen() {
    setOpenCommonItemsDialog(true);
  }
  async function handleCommonItemsDialogClose() {
    setOpenCommonItemsDialog(false);
  }

  const [openAddNewItemDialog, setOpenAddNewItemDialog] = useState(false);

  async function handleAddNewItemDialogOpen() {
    setOpenAddNewItemDialog(true);
  }
  async function handleAddNewItemDialogClose() {
    setOpenAddNewItemDialog(false);
  }

  const [openNewStoreDialog, setOpenNewStoreDialog] = useState(false);

  async function handleNewStoreDialogOpen() {
    setOpenNewStoreDialog(true);
  }
  async function handleNewStoreDialogClose() {
    setOpenNewStoreDialog(false);
  }
  const [openStoreSettingsDialog, setOpenStoreSettingsDialog] = useState(false);

  async function handleStoreSettingsDialogOpen() {
    setOpenStoreSettingsDialog(true);
  }
  async function handleStoreSettingsDialogClose() {
    setOpenStoreSettingsDialog(false);
  }

  return (
    <Context.Provider
      value={{
        openCommonItemsDialog,
        handleCommonItemsDialogOpen,
        handleCommonItemsDialogClose,
        openAddNewItemDialog,
        handleAddNewItemDialogOpen,
        handleAddNewItemDialogClose,
        openNewStoreDialog,
        handleNewStoreDialogOpen,
        handleNewStoreDialogClose,
        openStoreSettingsDialog,
        handleStoreSettingsDialogOpen,
        handleStoreSettingsDialogClose,
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
