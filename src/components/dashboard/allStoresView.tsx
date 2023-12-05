import { GroceryStoreItemType, GroceryStoreType } from "@/types";
import Item from "../groceryStore/groceryStoreItem/item";
import GroceryStore from "../groceryStore/groceryStore";
import { Container } from "@mui/material";
import NoStores from "../utils/noStores";

export default function allStoresView({
  groceryStores,
}: {
  groceryStores: GroceryStoreType[] | [] | undefined;
}) {
  //If Items then redner them otherwise riendor a placeholder text
  const groceryStoresToRender = groceryStores?.map(
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
          <ul>
            <>{groceryStoresToRender}</>
          </ul>
        </Container>
      ) : (
        <NoStores />
      )}
    </>
  );
}
