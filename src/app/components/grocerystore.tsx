"use client";

import {
  Badge,
  Box,
  CardContent,
  Collapse,
  Container,
  Divider,
  IconButton,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import TocOutlinedIcon from "@mui/icons-material/TocOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import GroceryStoreItem from "./grocerystoreitem";
import noItems from "./noItems";
import { useEffect, useState } from "react";
import { GroceryStoreItemType, GroceryStoreWithItemsType } from "@/types";
import { theme } from "../utils/theme";
import { useSupabase } from "../supabase-provider";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import NoItems from "./noItems";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddItem from "./addItem";

export default function GroceryStore(
  groceryStoreData: GroceryStoreWithItemsType
) {
  const { supabase } = useSupabase();

  const [open, setOpen] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const [newGroceryStoreName, setNewGroceryStoreName] = useState<string>(
    groceryStoreData.name
  );
  const [groceryStoreItems, setGroceryStoreItems] = useState<
    GroceryStoreItemType[] | null
  >(null);

  async function getGroceryStoreItems() {
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .select("*")
      .eq("storeId", groceryStoreData?.id);
    if (data) {
      setGroceryStoreItems(data);
    } else if (error) {
      throw new Error(error.message);
    }
  }

  useEffect(() => {
    const channel = supabase
      .channel("custom-grocerystoreitems-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "grocerystoreitems" },
        getGroceryStoreItems
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "grocerystoreitems" },
        getGroceryStoreItems
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "grocerystoreitems" },
        getGroceryStoreItems
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    getGroceryStoreItems();
  }, [supabase]);

  const groceryStoreItemsToRender = groceryStoreItems?.map(
    (grocerystoreitem: GroceryStoreItemType) => {
      return (
        <GroceryStoreItem key={grocerystoreitem.id} {...grocerystoreitem} />
      );
    }
  );

  async function handleDelete(): Promise<void> {
    const { error } = await supabase
      .from("grocerystores")
      .delete()
      .eq("id", groceryStoreData.id);

    if (error) {
      throw new Error(error.message);
    }
  }

  // const handleEdit = () => {
  //   console.log(newGroceryStoreName,'Name before')
  //   setNewGroceryStoreName(groceryStoreData.name)
  //   console.log(newGroceryStoreName,'After')
  //   setIsEditable(!isEditable);
  // };

  async function handleConfirm() {
    setIsEditable(false);
    const { error } = await supabase
      .from("grocerystores")
      .update({ name: newGroceryStoreName })
      .eq("id", groceryStoreData.id);
    setNewGroceryStoreName("");

    if (error) throw new Error(error.message);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container
          sx={{
            p: 1,
            bgcolor: "background.paper",
            borderRadius: 1,
            border: 1,
            borderColor: "secondary.main",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 1,
              m: 6,
              bgcolor: "background.default",
              borderRadius: 1,
              border: 1,
              borderColor: "error.main",
            }}
          >
            {isEditable ? (
              <TextField
                id="standard-basic"
                label="Name:"
                value={newGroceryStoreName}
                onChange={(e) => setNewGroceryStoreName(e.target.value)}
                onBlur={() => setIsEditable(false)}
              />
            ) : (
              <Typography variant="h1" color="text.secondary">
                {groceryStoreData.name}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                flexFlow: "column",
                alignSelf: "flex-start",
              }}
            >
              <IconButton
                onClick={() => {
                  setOpen(!open);
                  isEditable && setIsEditable(false);
                }}
                aria-label="expand"
                size="small"
              >
                {open ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <Badge
                    badgeContent={groceryStoreData?.quantity}
                    color="secondary"
                  >
                    <TocOutlinedIcon color="error" />
                  </Badge>
                )}
              </IconButton>
              {open && !isEditable && (
                <IconButton
                  onClick={() => {
                    setIsEditable(!isEditable);
                  }}
                  aria-label="complete"
                >
                  <ModeEditIcon color="secondary" />
                </IconButton>
              )}
              {open && isEditable && (
                <IconButton onClick={handleConfirm}>
                  <CheckCircleIcon color="primary" />
                </IconButton>
              )}
              {open && (
                <IconButton onClick={handleDelete}>
                  <DeleteIcon color="secondary" />
                </IconButton>
              )}
            </Box>
          </Box>

          {open && groceryStoreItemsToRender && groceryStoreItemsToRender?.length > 0 && (
            <Box
              sx={{
                display:"flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
            <AddItem storeId={groceryStoreData.id} />
            </Box>
          )}
          <Collapse in={open} timeout="auto" unmountOnExit>
            <CardContent>
              <Container
                sx={{
                  border: 1,
                  display: "flex",
                  justifyContent: "flex-start",
                  bgcolor: "background.default",
                  borderRadius: 10,
                  borderColor: "primary.main",
                }}
                style={{ overflowX: "scroll" }}
              >
                {groceryStoreItemsToRender &&
                groceryStoreItemsToRender.length > 0 ? (
                  groceryStoreItemsToRender
                ) : (
                  <NoItems storeId={groceryStoreData.id} />
                )}
              </Container>
            </CardContent>
          </Collapse>
        </Container>
      </ThemeProvider>
    </>
  );
}
