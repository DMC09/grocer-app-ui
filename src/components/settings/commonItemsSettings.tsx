import { Container, CircularProgress, Box, Chip } from "@mui/material";
import { CommonItemsDataStore } from "@/stores/CommonItemsDataStore";
import { CategoryType, CommonItemType } from "@/types";
import ManagedCommonItem from "../groceryStore/commonItem/managedCommonItem";
import { fetchAllCommonItems } from "@/helpers/commonItem";
import { useSupabase } from "../supabase/supabase-provider";
import AddCommonItem from "../dialogs/addCommonItemDialog";
import NoManagedCommonItem from "../utils/commonitems/noManagedCommonItems";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useState } from "react";
import useZustandStore from "@/hooks/useZustandStore";
import { CategoryDataStore } from "@/stores/categoryDataStore";

export default function CommonItemsSettings() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const commonItemsCatalog = CommonItemsDataStore((state) => state.catalog);
  const { supabase, session } = useSupabase();

  const filteredCommonItems = commonItemsCatalog.filter(
    (item) => item.category_id === selectedCategoryId
  );

  const unfilteredCommonItemsToRender = commonItemsCatalog.map(
    (commonItem: CommonItemType) => {
      return <ManagedCommonItem key={commonItem.id} {...commonItem} />;
    }
  );

  const filteredCommonItemsToRender = filteredCommonItems.map(
    (commonItem: CommonItemType) => {
      return <ManagedCommonItem key={commonItem.id} {...commonItem} />;
    }
  );

  const CategoryData = useZustandStore(
    CategoryDataStore,
    (state) => state?.categories
  );

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

  async function handleRefresh() {
    await fetchAllCommonItems(supabase);
  }

  return (
    <>
      <PullToRefresh
        refreshingContent={<CircularProgress />}
        pullingContent={""}
        onRefresh={handleRefresh}
      >
        <Container
          sx={{
            display: "flex",
            flexFlow: "column",
            borderColor: "primary.main",
            backgroundColor: "background.default",

            width: "100%",
            mt: 2,
            overflowY: "scroll",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <AddCommonItem />
          </Box>

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

          {commonItemsCatalog.length > 0 ? (
            <Container
              sx={{
                gap: 2,
                height: "90%",
                overflowY: "scroll",
                display: "flex",
                flexFlow: "column",
                py: 2,
                my: 2,
              }}
            >
              <>
                {selectedCategoryId
                  ? filteredCommonItemsToRender
                  : unfilteredCommonItemsToRender}
              </>
            </Container>
          ) : (
            <NoManagedCommonItem />
          )}
        </Container>
      </PullToRefresh>
    </>
  );
}
