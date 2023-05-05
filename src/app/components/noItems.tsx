"use client";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import React, { useEffect, useState } from "react";
import { useSupabase } from "../supabase-provider";

export default function NoItems({ storeId }) {
  const [open, setOpen] = useState(false);

  const { supabase } = useSupabase();

  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName("")
    setNotes("");
    setQuantity("");
  };

  function handleClickAway(event: MouseEvent | TouchEvent): void {
    console.log("is this outside??");
  }

  async function handleSubmit() {
    console.log("not implement");
    console.log(storeId, "store id?");
    console.log(quantity, " quantity on submit");
    console.log(name, " name on submit");
    console.log(notes, " notes on submit");

    //Set the items and stuff to empty
    //close the dialoga nd clear it
    // force a refresh?


    try {
      
      const { data, error } = await supabase
        .from("grocerystoreitems")
        .insert([
          {
            storeId: storeId.toString(),
            name,
            notes,
            quantity: Number(quantity),
          },
        ]);

        setOpen(false);
        setName("")
        setNotes("");
        setQuantity("");
    } catch (error) {
      console.log(error)
    }


  }

  return (
    <>
      <Container
        sx={{
          display: "flex",
          flexFlow: "column",
          justifyContent: "center",
          textAlign: "center",
          p: 1,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No items available. please add one
        </Typography>
        <Box>
          <IconButton
            onClick={handleClickOpen}
            color="secondary"
            aria-label="add to grocery store"
          >
            <ControlPointIcon />
          </IconButton>
        </Box>
      </Container>
      <div>
        <ClickAwayListener onClickAway={handleClickAway}>
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
        </ClickAwayListener>
      </div>
    </>
  );
}
