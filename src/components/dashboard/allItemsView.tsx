import { CategoryType, GroceryStoreItemType } from "@/types";
import Item from "../groceryStore/groceryStoreItem/item";
import { Badge, Chip, Container, Typography } from "@mui/material";
import NoItems from "../utils/placeholders/noItems";
import useZustandStore from "@/hooks/useZustandStore";
import { CategoryDataStore } from "@/stores/categoryDataStore";
import { useState } from "react";

export default function AllItemsView({
  items,
}: {
  items: GroceryStoreItemType[] | [] | undefined;
}) {
  // State
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  // Global State
  const CategoryData = useZustandStore(
    CategoryDataStore,
    (state) => state?.categories
  );
  // Computed
  const filteredItems = items?.filter(
    (item) => item.category_id === selectedCategoryId
  );

  const unfilteredItemsToRender = items?.map((item) => {
    return <Item groceryStoreItem={item} key={item.id} />;
  });

  const filteredItemsToRender = filteredItems?.map(
    (item: GroceryStoreItemType) => {
      return <Item key={item.id} groceryStoreItem={item} />;
    }
  );

  const categoriesToRender = CategoryData?.map((category: CategoryType) => {
    return (
      <>
        {/* <Badge overlap="circular" badgeContent={4} color="primary"> */}

        <Chip
          color="primary"
          key={category.id}
          variant={selectedCategoryId === category.id ? "filled" : "outlined"}
          label={category.name}
          onClick={() => handleSetCategory(category?.id)}
        />
        {/* </Badge> */}
      </>
    );
  });

  //handlers
  function handleSetCategory(categoryId: number): void {
    if (categoryId == selectedCategoryId) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(categoryId);
    }
  }

  return (
    <>
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
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
            height: "100%",
            display: "flex",
            flexFlow: "column",
            backgroundColor: "white",
            overflowY: "scroll",
          }}
        >
          <ul style={{ width: "100%" }}>
            {" "}
            {selectedCategoryId
              ? filteredItemsToRender
              : unfilteredItemsToRender}
          </ul>
        </Container>
      ) : (
        <NoItems />
      )}
    </>
  );
}
