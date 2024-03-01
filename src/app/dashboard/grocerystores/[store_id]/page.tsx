"use client";

import { Chip, Container, Skeleton, ThemeProvider } from "@mui/material";
import { useParams } from "next/navigation";
import { CategoryType, GroceryStoreItemType } from "@/types";
import { theme } from "@/helpers/theme";
import useZustandStore from "@/hooks/useZustandStore";
import Item from "@/components/groceryStore/groceryStoreItem/item";
import { ItemDataStore } from "@/stores/ItemStore";
import NoItems from "@/components/utils/placeholders/noItems";
import { CategoryDataStore } from "@/stores/categoryDataStore";
import { useState } from "react";

export default function Page() {
  const { store_id } = useParams();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const CategoryData = useZustandStore(
    CategoryDataStore,
    (state) => state?.categories
  );

  const items = useZustandStore(ItemDataStore, (state) => state.data)?.filter(
    (item) => Number(item.store_id) === Number(store_id)
  );

  const filteredItems = items?.filter(
    (item) => item.category_id === selectedCategoryId
  );

  const unfilteredItemsToRender = items?.map((item: GroceryStoreItemType) => {
    return <Item key={item.id} groceryStoreItem={item} />;
  });

  const filteredItemsToRender = filteredItems?.map(
    (item: GroceryStoreItemType) => {
      return <Item key={item.id} groceryStoreItem={item} />;
    }
  );

  function handleSetCategory(categoryId: number): void {
    if (categoryId == selectedCategoryId) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(categoryId);
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

  return (
    <>
      <ThemeProvider theme={theme}>
        {categoriesToRender && categoriesToRender?.length > 0 ? (
          <Container
            sx={{
              display: "flex",
              py: 1,
              gap: 0.5,
              overflowX: "scroll",
            }}
          >
            {categoriesToRender}
          </Container>
        ) : null}
        {items && items.length > 0 ? (
          <Container
            disableGutters
            sx={{
              mt: 2,
              display: "flex",
              flexFlow: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 3,
            }}
          >
            <ul style={{ width: "100%" }}>
              {selectedCategoryId
                ? filteredItemsToRender
                : unfilteredItemsToRender}
            </ul>
          </Container>
        ) : (
          <NoItems />
        )}
      </ThemeProvider>
    </>
  );
}
