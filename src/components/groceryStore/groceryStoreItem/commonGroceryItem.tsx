import {} from "@/types";
import { Box, Card, Checkbox, Typography } from "@mui/material";

export default function CommonGroceryStoreItem(item: any) {
  // Wehn chekced the appearance will changed and it will also trigger it being added as part of the state
  // quanity we can use as part of the state and when an item is checked we add it to the

  return (
    <Box
      sx={{
        border: 1,
        display: "flex",
        m: 1,
        height: "33%",
      }}
    >
      <Checkbox size="small" />
      <Card
        sx={{
          display: "flex",
          p: 1,
        }}
      >
        <Typography variant="h5">{item.item_name}</Typography>
      </Card>
    </Box>
  );
}
