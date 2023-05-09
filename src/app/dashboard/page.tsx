"use client";

import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import GroceryStore from "../components/grocerystore";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useSupabase } from "../supabase-provider";
import { useEffect, useState } from "react";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import { GroceryStoreWithItemsType, GroceryStoreType } from "@/types";
import { Typography } from "@supabase/ui";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function Dashboard() {
  // Hooks
  const { supabase } = useSupabase();
  const [open, setOpen] = useState(false);
  const [groceryStores, setGroceryStores] = useState<GroceryStoreType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newGroceryStoreName, setNewGroceryStoreName] = useState<string>("");

  const getGroceryStores = async () => {
    const { data, error } = await supabase.from("grocerystores").select("*");
    if (data) {
      setIsLoading(false);
      setGroceryStores(data);
    } else if (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    getGroceryStores();
  }, [supabase]);

  useEffect(() => {
    const channel = supabase
      .channel("custom-grocerystore-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "grocerystores" },
        getGroceryStores
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "grocerystores" },
        getGroceryStores
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "grocerystores" },
        getGroceryStores
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  //add a state for loading
  // use realtime to listen for insert and then fetch new data.

  const groceryStoresToRender =
    groceryStores &&
    groceryStores?.map((groceryStore: any) => {
      return <GroceryStore key={groceryStore.id} {...groceryStore} />;
    });

  //Handleers
  async function handleClickOpen() {
    setOpen(true);
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

  
  function handleClose(event: {}): void {
    setOpen(false);
    setNewGroceryStoreName("");
  }
  
  function handleClickAway(event: MouseEvent | TouchEvent): void {
    console.log("Clciked away");
  }

  return (
    <>
      <Container
        sx={{
          height: "100%",
          border: 1,
        }}
      >
        <Typography variant="h1" color="text.secondary">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          onClick={handleClickOpen}
          endIcon={<AddCircleIcon />}
        >
          Add new Store
        </Button>
        <div>
          <ClickAwayListener onClickAway={handleClickAway}>
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
          </ClickAwayListener>
        </div>
        <>
          {isLoading ? (
            <p>loading</p>
          ) : groceryStores?.length > 0 ? (
            groceryStoresToRender
          ) : (
            <p>nothing to see!</p>
          )}
        </>
      </Container>
    </>
  );
}
