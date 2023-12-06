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
  fetchAllCommonItems,
  isCommonItemDataStoreEmpty,
} from "@/helpers/commonItem";
import { CommonItemType } from "@/types";
import { theme } from "@/helpers/theme";
import { GroceryDataStore } from "@/stores/GroceryDataStore";
import { getAllGroceryStoresData } from "@/helpers/groceryStore";
import CommonItem from "../groceryStore/commonItem/commonItem";
import NoCommonItems from "../utils/commonitems/noCommonItems";

export default function CommonItemsDialog({
  storeId,
  selectId,
}: {
  storeId: number;
  selectId: string | null;
}) {
  // hooks
  const { supabase, session } = useSupabase();
  const { showCommonItemsDialog, closeCommonItemsDialog } = useDialog();

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
        console.log("Common Item Data Not Found!");
        fetchData();
      } else {
        console.log("Using Cache!");
      }
    }
  }, []);

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
    await fetchAllCommonItems(supabase); 
  }

  async function handleAddCommonItems() {
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .insert(mappedItems)
      .select();

    if (error) {
      throw new Error(error.message);
    } else {
      await fetchData();
      clearItemsToSubmit();
      closeCommonItemsDialog();
    }
  }

  const commonItemsToRender = commonItemsCatalog.map(
    (commonItem: CommonItemType) => {
      return <CommonItem key={commonItem.id} {...commonItem} />;
    }
  );

  function handleClose(): void {
    closeCommonItemsDialog();
    clearItemsToSubmit();
  }

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        id="grocery-store-settings-dialog"
        open={!!showCommonItemsDialog}
        fullWidth
        sx={{
          width: "100%",
        }}
      >
        <DialogTitle align="center">Add Common Items</DialogTitle>

        <DialogContent
          sx={{
            p: 0,
          }}
        >
          <Box sx={{ height: "90%", overflowY: "scroll", border: 1 }}>
            {commonItemsCatalog.length > 0 ? (
              commonItemsToRender
            ) : (
              <NoCommonItems />
            )}
            {/* <Box
            sx={{
              border: 1,
              borderRadius: 5,
              width: "90%",
              height: "75%",
              overflowY: "scroll",
            }}
          >
         
          </Box> */}
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
