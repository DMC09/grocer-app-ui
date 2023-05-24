"use client";

import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  ThemeProvider,
  Button,
  Typography,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSupabase } from "./supabase/supabase-provider";
import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { theme } from "../utils/theme";

export default function DashboardHeader() {
    // move the add store button to it's won file.
  const { supabase, session } = useSupabase();
  const [open, setOpen] = useState(false);
  const [newGroceryStoreName, setNewGroceryStoreName] = useState<string>("");

  async function handleClickOpen() {
    setOpen(true);
  }
  function handleClose(event: {}): void {
    setOpen(false);
    setNewGroceryStoreName("");
  }

  async function handleSubmit() {
    const { data, error } = await supabase
      .from("grocerystores")
      .insert([{ name: newGroceryStoreName }]);
    if (error) {
      throw new Error(error.message);
    } else {
      setOpen(false);
      setNewGroceryStoreName("");
    }
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        {/* make a contianeher here  */}
        <Card
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "primary.main",
          }}
        >
          <Typography color="#EAEAEA" variant="h3">
            Grocery Stores
          </Typography>
          <Button
            variant="contained"
            onClick={handleClickOpen}
            endIcon={<AddCircleIcon />}
          >
            Add new Store
          </Button>
        </Card>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add new Store</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="Name"
              label="Name"
              type="email"
              fullWidth
              variant="standard"
              onChange={(e) => setNewGroceryStoreName(e.target.value)}
              value={newGroceryStoreName}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </>
  );
}
