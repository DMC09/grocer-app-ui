"use client";

import { createContext, useContext, useState } from "react";

type DialogContext = {
  openCommonItemsDialog: boolean;
  handleCommonItemsDialogOpen: () => void;
  handleCommonItemsDialogClose: () => void;
  openAddNewItemDialog: boolean;
  handleAddNewItemDialogOpen: () => void;
  handleAddNewItemDialogClose: () => void;
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
  const [openAddNewItemDialog, setOpenAddNewItemDialog] = useState(false);
  const [openStoreSettingsDialog, setOpenStoreSettingsDialog] = useState(false);

  const handleCommonItemsDialogOpen = () => {
    setOpenCommonItemsDialog(true);
  };
  const handleCommonItemsDialogClose = () => {
    setOpenCommonItemsDialog(false);
  };
  const handleAddNewItemDialogOpen = () => {
    setOpenAddNewItemDialog(true);
  };
  const handleAddNewItemDialogClose = () => {
    setOpenAddNewItemDialog(false);
  };
  const handleStoreSettingsDialogOpen = () => {
    setOpenStoreSettingsDialog(true);
  };
  const handleStoreSettingsDialogClose = () => {
    setOpenStoreSettingsDialog(false);
  };

  return (
    <Context.Provider
      value={{
        openCommonItemsDialog,
        handleCommonItemsDialogOpen,
        handleCommonItemsDialogClose,
        openAddNewItemDialog,
        handleAddNewItemDialogOpen,
        handleAddNewItemDialogClose,
        openStoreSettingsDialog,
        handleStoreSettingsDialogOpen,
        handleStoreSettingsDialogClose,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useDialogContext = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error("Context is undefined or wasn't passed in properly");
  }

  return context;
};
