"use client";

import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import GroceryStore from "../components/groceryStore/grocerystore";
import {
  Badge,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useSupabase } from "../components/supabase/supabase-provider";
import { useEffect, useState } from "react";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import { GroceryStoreWithItemsType, GroceryStoreType } from "@/types";
import { Typography } from "@supabase/ui";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useRouter, redirect } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const { supabase } = useSupabase();

  const [open, setOpen] = useState(false);
  const [groceryStores, setGroceryStores] = useState<
    GroceryStoreType[] | [] | null
  >(null);


  const [isLoading, setIsLoading] = useState<boolean>(true);

  // TODO:move the add new store to it's own component 
  const [newGroceryStoreName, setNewGroceryStoreName] = useState<string>("");


// TODO: move this to the client utils 
  const getAllGroceryStores = async () => {
    const { data, error } = await supabase.from("grocerystores").select("*");
    if (data) {
      setIsLoading(false);
      setGroceryStores(data);
    } else if (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    getAllGroceryStores();
  }, [supabase]);

  // TODO: test if I make differnt edits that hte data is correct
  useEffect(() => {
    const channel = supabase
      .channel("custom-grocerystore-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "grocerystores" },
        getAllGroceryStores
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "grocerystores" },
        getAllGroceryStores
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "grocerystores" },
        getAllGroceryStores
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);


  // figure out a order for the stores
  const groceryStoresToRender = groceryStores?.map((groceryStore: any) => {
    return (
      <>
        <Badge color="secondary" badgeContent={groceryStore.quantity}>
          <Card
            raised
            sx={{
              border: 1,
              borderColor: "primary",
              background: "primary",
              borderRadius: 3,
              width: 350,
              height: 300,
            }}
            style={{ flexShrink: 0 }}
          >
            <CardActionArea
              onClick={() => {
                router.push(`/dashboard/grocerystores/${groceryStore.id}`);
              }}
            >
              <CardHeader title={groceryStore.name} />
              <CardMedia
                component="img"
                height={250}
                image={groceryStore.image}
                alt={`Image of${groceryStore.name} `}
                sx={{objectFit: "fill" }}

              />
              {/* <CardContent></CardContent> */}
            </CardActionArea>
            {/* <CardActions></CardActions> */}
          </Card>
        </Badge>
      </>
    );
  });

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
          border: 3,
        }}
      >
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
          <Container
            sx={{
              display: "flex",
              flexFlow: "row",
              flexWrap: "wrap",
              gap: 3,
              my: 2,
            }}
          >
            {groceryStores && groceryStores.length > 0 && groceryStoresToRender}
          </Container>

          {/* {isLoading ? (
            <p>loading</p>
          ) : groceryStores?.length > 0 ? (
            groceryStoresToRender
          ) : (
            <p>nothing to see!</p>
          )} */}
        </>
      </Container>
    </>
  );
}
