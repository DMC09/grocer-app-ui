"use client";

import { Container, Skeleton, ThemeProvider } from "@mui/material";
import { useParams } from "next/navigation";
import { GroceryStoreItemType } from "@/types";
import NoItems from "@/components/utils/grocerystoreitems/noItems";
import { PostgrestError } from "@supabase/supabase-js";
import { theme } from "@/helpers/theme";
import { ProfileDataStore } from "@/stores/ProfileDataStore";
import useZustandStore from "@/hooks/useZustandStore";
import { GroceryDataStore } from "@/stores/GroceryDataStore";
import ExpandedItem from "@/components/groceryStore/groceryStoreItem/expandedItem";
import Item from "@/components/groceryStore/groceryStoreItem/item";





// need to grab the pfiles boolean and render the differnt view.

export default function Page() {
  const { store_id } = useParams();
  const expandedView = useZustandStore(
    ProfileDataStore,
    (state) => state?.data?.expanded_groceryitem
  );
  const grocerystoreitems = useZustandStore(
    GroceryDataStore,
    (state) => state?.data
  )?.filter((grocerystore) => Number(grocerystore.id) === Number(store_id))?.[0]
    ?.grocerystoreitems;

  const groceryStoreItemsToRender = grocerystoreitems?.map(
    (item: GroceryStoreItemType) => {
      return expandedView ? (
        <ExpandedItem key={item.id} groceryStoreItem={item} />
      ) : (
        <Item key={item.id} groceryStoreItem={item} />
      );
    }
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        {grocerystoreitems && grocerystoreitems.length > 0 ? (
          <Container
            disableGutters
            sx={{
              mt: 2,
              height: "100%",
              width: "95%",
              display: "flex",
              flexFlow: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 3,
            }}
          >
            {groceryStoreItemsToRender}
          </Container>
        ) : (
          <NoItems />
        )}
      </ThemeProvider>
    </>
  );
}
