import { GroceryStoreItemType } from "@/types";
import Item from "../groceryStore/groceryStoreItem/item";
import { Container, Typography } from "@mui/material";
import NoItems from "../utils/noItems";

export default function allItemsView({
  items,
}: {
  items: GroceryStoreItemType[] | [] | undefined;
}) {
  const allItemsToRender = items?.map((item) => {
    return <Item groceryStoreItem={item} key={item.id} />;
  });



  return (
    <>
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
          <ul style={{width: "100%"}}>{allItemsToRender}</ul>
        </Container>
      ) : (
        <NoItems />
      )}
    </>
  );
}
