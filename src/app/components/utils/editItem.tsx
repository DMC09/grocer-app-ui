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

export default function EditItem(groceryStoreItem: GroceryStoreItemType) {


  const { supabase } = useSupabase();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState<string | null>(groceryStoreItem.name);
  const [image, setImage] = useState<string | null>(groceryStoreItem.image);
  const [notes, setNotes] = useState<string | null>(groceryStoreItem.notes);
  const [quantity, setQuantity] = useState<number | null>(
    groceryStoreItem.quantity
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName(groceryStoreItem.name);
    setNotes(groceryStoreItem.notes);
    setQuantity(groceryStoreItem.quantity);
    setImage(groceryStoreItem.image);
  };

  async function handleEdit() {
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .update([
        {
          name,
          notes,
          quantity: Number(quantity),
          image,
        },
      ])
      .eq("id", groceryStoreItem.id)
      .select();

    if (data) {

      setOpen(false);
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
            onChange={(e) => setQuantity(Number(e.target.value))}
            value={quantity}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEdit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
