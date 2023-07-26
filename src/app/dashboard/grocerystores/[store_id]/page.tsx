"use client";

import { Container, Skeleton, ThemeProvider } from "@mui/material";

import { useParams } from "next/navigation";
import { GroceryStoreItemType } from "@/types";
import NoItems from "@/components/utils/noItems";
import { PostgrestError } from "@supabase/supabase-js";
import { theme } from "@/utils/theme";


import { useProfileStore } from "@/stores/ProfileStore";
import GroceryStoreItem from "@/components/groceryStore/groceryStoreItem/grocerystoreitem";
import ExpandedGroceryStoreItem from "@/components/groceryStore/groceryStoreItem/expandedItem";
import useZustandStore from "@/hooks/useZustandStore";
import { useGroceryStoreStore } from "@/stores/GrocerStore";

// need to grab the pfiles boolean and render the differnt view.

export default function Page() {
  const { store_id } = useParams();
  const expandedView = useZustandStore(
    useProfileStore,
    (state) => state?.data?.expanded_groceryitem
  );
  const grocerystoreitems = useZustandStore(
    useGroceryStoreStore,
    (state) => state?.data
  )?.filter((grocerystore) => Number(grocerystore.id) === Number(store_id))?.[0]
    .grocerystoreitems;

  const groceryStoreItemsToRender = grocerystoreitems?.map(
    (item: GroceryStoreItemType) => {
      return expandedView ? (
        <ExpandedGroceryStoreItem key={item.id} groceryStoreItem={item} />
      ) : (
        <GroceryStoreItem key={item.id} groceryStoreItem={item} />
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
