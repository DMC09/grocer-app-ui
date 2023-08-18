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
  useMediaQuery,
  Box,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { CommonItemsDataStore } from "@/stores/CommonItemsDataStore";
import { useSupabase } from "@/components/supabase/supabase-provider";
import {
  getAllCommonItems,
  isCommonItemDataStoreEmpty,
} from "@/helpers/commonItem";
import { CommonItemType } from "@/types";
import CommonGroceryStoreItem from "../groceryStoreItem/commonGroceryItem";
import { theme } from "@/helpers/theme";
import { GroceryDataStore } from "@/stores/GroceryDataStore";
import { getAllGroceryStoresData } from "@/helpers/groceryStore";

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
  const insertGroceryItems = GroceryDataStore(
    (state) => state.insertGroceryItems
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

  async function fetchData() {
    console.log("fetching data!Pfor");
    await getAllGroceryStoresData(supabase);
  }

  async function handleAddCommonItems() {
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .insert(mappedItems)
      .select();

    if (error) {
      throw new Error(error.message);
    } else {
      console.log(data, "data after adding common itemS1");
      fetchData();
      clearItemsToSubmit();
      handleCommonItemsDialogClose();
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

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        id="grocery-store-settings-dialog"
        open={!!openCommonItemsDialog}
        fullWidth
        sx={{}}
      >
        <DialogTitle align="center">Add Common Items</DialogTitle>

        <DialogContent
          sx={{
            borderRadius: 6,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              border: 1,
              borderRadius: 5,
              width: "100%",
              height: "75%",
              overflowY: "scroll",
            }}
          >
            {commonItemsToRender}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleAddCommonItems}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
