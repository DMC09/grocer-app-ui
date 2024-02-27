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
  Chip,
  Container,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { CommonItemsDataStore } from "@/stores/CommonItemsDataStore";
import { useSupabase } from "@/components/supabase/supabase-provider";
import {
  fetchAllCommonItems,
  isCommonItemDataStoreEmpty,
} from "@/helpers/commonItem";
import { CategoryType, CommonItemType } from "@/types";
import { theme } from "@/helpers/theme";
import { GroceryDataStore } from "@/stores/GroceryDataStore";

import CommonItem from "../groceryStore/commonItem/commonItem";
import NoCommonItems from "../utils/commonitems/noCommonItems";
import { fetchAllItems, fetchAllGroceryStores } from "@/helpers/groceryStore";
import useZustandStore from "@/hooks/useZustandStore";
import { CategoryDataStore } from "@/stores/categoryDataStore";

export default function CommonItemsDialog({
  storeId = null,
  selectId,
}: {
  storeId: number | null;
  selectId: string | null;
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  // hooks
  const { supabase, session } = useSupabase();
  const { showCommonItemsDialog, closeCommonItemsDialog } = useDialog();

  // Zustand
  const commonItemsCatalog = CommonItemsDataStore((state) => state.catalog);
  const itemsToSubmit = CommonItemsDataStore((state) => state.itemsToSubmit);
  const clearItemsToSubmit = CommonItemsDataStore(
    (state) => state.clearItemsToSubmit
  );

  const CategoryData = useZustandStore(
    CategoryDataStore,
    (state) => state?.categories
  );

  //Refresh data
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
    common_item_id: item.id,
    store_id: storeId ? storeId : null,
    name: item.name,
    notes: item.notes,
    quantity: Number(item.quantity),
    select_id: selectId,
    image: item.image,
  }));

  async function fetchData() {
    await fetchAllItems(supabase);
    await fetchAllGroceryStores(supabase);
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

  const categoriesToRender = CategoryData?.map((category: CategoryType) => {
    return (
      <>
        <Chip
          color="primary"
          key={category.id}
          variant={selectedCategoryId === category.id ? "filled" : "outlined"}
          label={category.name}
          onClick={() => handleSetCategory(category?.id)}
        />
      </>
    );
  });

  function handleSetCategory(categoryId: number): void {
    if (categoryId == selectedCategoryId) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(categoryId);
    }
  }

  const filteredCommonItems = commonItemsCatalog.filter(
    (item) => item.category_id === selectedCategoryId
  );

  const unfilteredCommonItemsToRender = commonItemsCatalog.map(
    (commonItem: CommonItemType) => {
      return <CommonItem key={commonItem.id} {...commonItem} />;
    }
  );

  const filteredCommonItemsToRender = filteredCommonItems.map(
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
        {categoriesToRender && categoriesToRender?.length > 0 ? (
          <Container
            sx={{
              display: "flex",
              borderBottom: 2,
              borderTop: 2,
              py: 1,
              gap: 0.5,
              overflowX: "scroll",
            }}
          >
            {categoriesToRender}
          </Container>
        ) : null}
        <DialogContent
          sx={{
            p: 0,
          }}
        >
          <Box sx={{ height: "90%", overflowY: "scroll" }}>
            {commonItemsCatalog.length > 0 ? (
              <>
                {selectedCategoryId
                  ? filteredCommonItemsToRender
                  : unfilteredCommonItemsToRender}
              </>
            ) : (
              <NoCommonItems />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button variant="contained" onClick={handleAddCommonItems}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
