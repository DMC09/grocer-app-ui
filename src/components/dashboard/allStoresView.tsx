import { GroceryStoreType } from "@/types";
import GroceryStore from "../groceryStore/groceryStore";
import { Container } from "@mui/material";
import NoStores from "../utils/placeholders/noStores";
import { useMemo } from "react";

export default function AllStoresView({
  groceryStores,
}: {
  groceryStores: GroceryStoreType[] | [] | undefined;
}) {
  const sortedGroceryStores = useMemo(() => {
    if (!groceryStores) return []; // Handle empty array

    const copy = [...groceryStores];
    copy.sort((a, b) => {
      const quantityA = a.quantity ?? 0;
      const quantityB = b.quantity ?? 0;
      return quantityB - quantityA; // Descending order
    });
    return copy;
  }, [groceryStores]);

  const groceryStoresToRender = sortedGroceryStores?.map(
    (groceryStore: GroceryStoreType) => {
      return <GroceryStore key={groceryStore.id} groceryStore={groceryStore} />;
    }
  );

  return (
    <>
      {groceryStores && groceryStores.length > 0 ? (
        <Container
          disableGutters
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexFlow: "column",
            justifyContent: "flex-start",
            backgroundColor: "white",
            overflowY: "scroll",
          }}
        >
          <ul>{groceryStoresToRender}</ul>
        </Container>
      ) : (
        <NoStores />
      )}
    </>
  );
}
