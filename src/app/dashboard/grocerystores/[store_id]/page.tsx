"use client";

import { Container, Skeleton, ThemeProvider } from "@mui/material";
import { useParams } from "next/navigation";
import { GroceryStoreItemType } from "@/types";
import { theme } from "@/helpers/theme";
import useZustandStore from "@/hooks/useZustandStore";
import Item from "@/components/groceryStore/groceryStoreItem/item";
import { ItemDataStore } from "@/stores/ItemStore";
import NoItems from "@/components/utils/noItems";

export default function Page() {
  const { store_id } = useParams();

  const items = useZustandStore(ItemDataStore, (state) => state.data)?.filter(
    (item) => Number(item.store_id) === Number(store_id)
  );

  const itemsToRender = items?.map((item: GroceryStoreItemType) => {
    return <Item key={item.id} groceryStoreItem={item} />;
  });

  return (
    <>
      <ThemeProvider theme={theme}>
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
            {itemsToRender}
          </Container>
        ) : (
          <NoItems />
        )}
      </ThemeProvider>
    </>
  );
}
