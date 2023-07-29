import { useDialogContext } from "@/context/DialogContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Card,
  CardMedia,
  Button,
  DialogActions,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";

export default function CommonItemsDialog() {
  // const { openCommonItemsDialog, setCommonItemsDialog } = useContext(DialogContext);
  // const { openDialog } = useContext(DialogContext);

  const {  openCommonItemsDialog, handleCommonItemsDialogClose } =
    useDialogContext();

  console.log(openCommonItemsDialog, "other var");

  // const [open, SetOpen] = useState(openCommonItemsDialog);
  // createa hook so that on mount we get to use the open and if we want we can slose it

  // console.log(data, "what is tihs");

  function handleAddCommonItems(event: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Dialog id="grocery-store-settings-dialog" open={!!openCommonItemsDialog}>
        <DialogTitle align="center">Add Common Items</DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexFlow: "column",
          }}
        ></DialogContent>
        <DialogActions>
          {/* <Button onClick={() => setCommonItemsDialog(false)}>Cancel</Button> */}
          <Button onClick={handleCommonItemsDialogClose}>Close!</Button>
          <Button onClick={handleAddCommonItems}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function useMediaQuery(arg0: any) {
  throw new Error("Function not implemented.");
}
