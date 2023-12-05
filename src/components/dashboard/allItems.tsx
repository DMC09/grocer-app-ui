import { GroceryStoreItemType } from "@/types";
import Item from "../groceryStore/groceryStoreItem/item";
import { Container, Typography } from "@mui/material";
import NoItems from "../utils/noItems";

export default function allItemsView({
  items,
}: {
  items: GroceryStoreItemType[] | [] | undefined;
}) {
  //If Items then redner them otherwise riendor a placeholder text
  const allItemsToRender = items?.map((item) => {
    return <Item groceryStoreItem={item} key={item.id} />;
  });

  return (
    <>
      {items && items.length > 0 ? (
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
            <>{allItemsToRender}</>
          </ul>
        </Container>
      ) : (
        <NoItems />
      )}
    </>
  );
}
