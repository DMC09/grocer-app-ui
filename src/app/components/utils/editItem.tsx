import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { useSupabase } from "../supabase/supabase-provider";
import { GroceryStoreItemType } from "@/types";

export default function EditItem(groceryStoreItem:GroceryStoreItemType) {

    console.log(groceryStoreItem,'what is this!??')

  const { supabase } = useSupabase();
  const [open, setOpen] = useState(false);

  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setNotes("");
    setQuantity("");
  };

  async function handleSubmit() {
    const store_id = 0;
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .insert([
        {
          store_id,
          name,
          notes,
          quantity: Number(quantity),
        },
      ])
      .select();

    if (data) {
      setOpen(false);
      setName("");
      setNotes("");
      setQuantity("");
    } else if (error) {
      throw new Error(error.message);
    }
  }

  return (
    <>
      <Box sx={{}}>
        <IconButton
          sx={{ color: "primary.main" }}
          aria-label="add to grocery store"
          onClick={handleClickOpen}
        >
          <EditIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="Name"
            label="Name"
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="Notes"
            label="Notes"
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => setNotes(e.target.value)}
            value={notes}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            type="number"
            id="outlined-basic"
            label="Quantity"
            variant="outlined"
            onChange={(e) => setQuantity(e.target.value)}
            value={quantity}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
