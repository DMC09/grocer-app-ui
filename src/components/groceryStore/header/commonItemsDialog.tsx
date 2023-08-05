import { useDialog } from "@/context/DialogContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Card,
  CardMedia,
  Button,
  DialogActions,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import commonItemsStubData from "@/stub/commonitems.json";

import { CommonItemsDataStore } from "@/stores/CommonItemsDataStore";
import { useSupabase } from "@/components/supabase/supabase-provider";
import {
  getAllCommonItems,
  isCommonItemDataStoreEmpty,
} from "@/helpers/commonItem";
import { CommonItemType } from "@/types";
import CommonGroceryStoreItem from "../groceryStoreItem/commonGroceryItem";

export default function CommonItemsDialog({
  storeId,
  selectId,
}: {
  storeId: number;
  selectId: string | null;
}) {
  // hooks
  const { supabase, session } = useSupabase();
  const { openCommonItemsDialog, handleCommonItemsDialogClose } = useDialog();

  // Zustand
  const commonItemsCatalog = CommonItemsDataStore((state) => state.catalog);
  const itemsToSubmit = CommonItemsDataStore((state) => state.itemsToSubmit);
  const clearItemsToSubmit = CommonItemsDataStore(
    (state) => state.clearItemsToSubmit
  );

  //Refresh datat
  useEffect(() => {
    if (commonItemsCatalog) {
      if (isCommonItemDataStoreEmpty(commonItemsCatalog)) {
        console.log("we need to fetch the common items!");
        getData();
      } else {
        console.log("we have common items!");
      }
    }
  }, []);

  async function getData() {
    await getAllCommonItems(supabase);
  }

  const mappedItems = itemsToSubmit.map((item) => ({
    cid: item.id,
    store_id: storeId,
    name: item.name,
    notes: item.notes,
    quantity: Number(item.quantity),
    select_id: selectId,
    image: item.image,
  }));

  async function handleAddCommonItems() {
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .insert(mappedItems)
      .select();

    if (error) {
      throw new Error(error.message);
    } else {
      console.log(data, "data from respone/?");
      handleCommonItemsDialogClose();
      // close the dialog
      //also it to state
    }
  }

  const commonItemsToRender = commonItemsCatalog.map(
    (commonItem: CommonItemType) => {
      return <CommonGroceryStoreItem key={commonItem.id} {...commonItem} />;
    }
  );

  function handleClose(): void {
    handleCommonItemsDialogClose();
    clearItemsToSubmit();
  }

  return (
    <>
      <Dialog id="grocery-store-settings-dialog" open={!!openCommonItemsDialog}>
        <DialogTitle align="center">Add Common Items</DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexFlow: "column",
          }}
        >
          {commonItemsToRender}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleAddCommonItems}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
