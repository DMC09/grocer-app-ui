"use client";

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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useRouter } from "next/navigation";
import DashboardHeader from "../components/dashboardHeader";

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
              borderRadius: 1,
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
                sx={{ objectFit: "fill" }}
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
      {/* move the contianer as part of the layout that way there is continuity */}
      {/* The loading will container just the skelton */}
      {/* Make this container take up the full width in the layout */}
      {/* Make the box take move the space and have it the inverse of the colors itself. */}

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
      <DashboardHeader />
        <Container
        maxWidth={false}
          sx={{
            display: "flex",
            flexFlow: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            backgroundColor:"primary.light",
            gap: 3,
            py:2,
            border:2
          }}
        >
          {/* this needs it's own container */}
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
    </>
  );
}
