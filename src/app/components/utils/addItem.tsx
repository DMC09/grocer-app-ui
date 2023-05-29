import {
  ClickAwayListener,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  Container,
  IconButton,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";

import { useState } from "react";
import { useSupabase } from "../supabase/supabase-provider";

export default function AddItem({
  store_id,
  select_id,
}: {
  store_id: number;
  select_id: string | null;
}) {
  const [open, setOpen] = useState(false);

  const { supabase } = useSupabase();

  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  // function handleClickAway(event: MouseEvent | TouchEvent): void {
  //   throw new Error("Function not implemented.");
  // }

  const handleClose = () => {
    setOpen(false);
    setName("");
    setNotes("");
    setQuantity("");
  };

  async function handleSubmit() {
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .insert([
        {
          store_id,
          name,
          notes,
          quantity: Number(quantity),
          select_id,
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
          sx={{ color: "background.paper" }}
          onClick={handleClickOpen}
          aria-label="add to grocery store"
        >
          <ControlPointIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add new item</DialogTitle>
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
