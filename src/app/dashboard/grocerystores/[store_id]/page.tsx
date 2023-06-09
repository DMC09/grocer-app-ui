"use client";

import { Container, Skeleton, ThemeProvider } from "@mui/material";

import { useParams } from "next/navigation";
import { GroceryStoreItemType } from "@/types";
import NoItems from "@/app/components/utils/noItems";
import { PostgrestError } from "@supabase/supabase-js";
import { theme } from "@/app/utils/theme";
import useStore from "@/app/hooks/useStore";
import { useGroceryStoreStore } from "@/state/GrocerStore";
import { useProfileStore } from "@/state/ProfileStore";
import GroceryStoreItem from "@/app/components/groceryStore/grocerystoreitem";

// need to grab the pfiles boolean and render the differnt view.

export default function Page() {
  const { store_id } = useParams();
  const expandedView = useStore(
    useProfileStore,
    (state) => state?.data?.expanded_groceryitem
  );
  const grocerystoreitems = useStore(
    useGroceryStoreStore,
    (state) => state?.data
  )?.filter((grocerystore) => Number(grocerystore.id) === Number(store_id))?.[0]
    .grocerystoreitems;

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            height: "85%",
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
            backgroundColor: "primary.light",
            gap: 3,
            p: 2,
            border: 2,
          }}
        >
          {expandedView !== undefined &&
          grocerystoreitems &&
          grocerystoreitems.length > 0 ? (
            grocerystoreitems.map((item: GroceryStoreItemType) => {
              return (
                <GroceryStoreItem
                  key={item.id}
                  expanded={expandedView}
                  groceryStoreItem={item}
                />
              );
            })
          ) : (
            <NoItems />
          )}
        </Container>
      </ThemeProvider>
    </>
  );
}
