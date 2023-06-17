"use client";

import {  useState } from "react";
import { GroceryStoreItemProps, GroceryStoreItemType } from "@/types";
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
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSupabase } from "../supabase/supabase-provider";
import EditItem from "../utils/editItem";


export default function GroceryStoreItem({
  groceryStoreItem,
  expanded,
}: GroceryStoreItemProps) {
  const { supabase, session } = useSupabase();
  const [open, setOpen] = useState(false);

  // need to find a way to compare the current time and if this time is whtin the house then we know it's modified.
  function updatedRecently(timestamp: string | Date | null) {
    if (timestamp) {
      // Convert the timestamp to a Date object.
      const passedDate = new Date(timestamp).getTime();

      // Get the current time in milliseconds.
      const now = Date.now();

      // Return true if the passedDate is within the last 5 minutes.
      return passedDate > now - 300000;
    } else {
      return false;
    }
  }
  const expandView = false;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const created_atLocal = () => {
    if (groceryStoreItem?.created_at) {
      const localDate = new Date(
        groceryStoreItem?.created_at
      ).toLocaleTimeString([], {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
        hour: "numeric",
        minute: "2-digit",
      });
      return localDate;
    }
  };

  const handleDelete = async (itemId: string) => {
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .delete()
      .eq("id", itemId);

    if (error) {
      throw new Error(error.message);
    }
  };

  function handleEdit() {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      {expanded ? (
        <Badge
          color="primary"
          variant="dot"
          invisible={!updatedRecently(groceryStoreItem.modified_at)}
        >
          <Card
            raised
            sx={{
              border: 2,
              borderRadius: 2,
              borderColor: "primary.main",
              width: 250,
              height: 305,
            }}
            style={{ flexShrink: 0 }}
          >
            <CardHeader
              titleTypographyProps={{ variant: "h6", color: "primary.dark" }}
              sx={{ p: 0.5, m: 0 }}
              title={groceryStoreItem.name}
            />
            <CardContent sx={{ p: 0.5, m: 0 }}>
              <Typography color="#071236" variant="body2">
                {groceryStoreItem.notes}
              </Typography>
            </CardContent>
            <CardActionArea
              onClick={() => alert("you logged this apparent?")}
              sx={{ p: 0, m: 0 }}
            >
              <CardMedia
                component="img"
                height="150"
                image={`${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${groceryStoreItem?.image}`}
                alt={`Image of${groceryStoreItem.name} `}
                sx={{ objectFit: "fill" }}
              />
            </CardActionArea>
            <CardActions
              sx={{
                p: 0.5,
                m: 0,
                display: "flex",
                flexFlow: "row",
                justifyContent: "space-around",
              }}
            >
              <IconButton
                sx={{ p: 0.5, m: 0 }}
                color="success"
                onClick={() => handleDelete(groceryStoreItem.id.toString())}
                aria-label="complete"
              >
                <CheckCircleIcon />
              </IconButton>
              <Typography color="#071236" variant="subtitle2">
                {groceryStoreItem.quantity}
              </Typography>
              {/* <Typography color="#071236" variant="caption">
              {created_atLocal()}
            </Typography> */}
              <EditItem {...groceryStoreItem} />
            </CardActions>
          </Card>
        </Badge>
      ) : (
        <>
          <Badge
            color="primary"
            variant="dot"
            invisible={!updatedRecently(groceryStoreItem.modified_at)}
          >
            <Card
              sx={{
                border: 2,
                borderRadius: 2,
                borderColor: "primary.main",
                display: "flex",
                height: "fit-content",
                width: 200,
              }}
            >
              <CardActionArea onClick={handleClickOpen} sx={{ p: 0, m: 0 }}>
                <Box>
                  <Typography variant="h5">{groceryStoreItem?.name}</Typography>
                </Box>
              </CardActionArea>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton
                  sx={{ p: 0.5, m: 0 }}
                  color="success"
                  onClick={() => handleDelete(groceryStoreItem.id.toString())}
                  aria-label="complete"
                >
                  <CheckCircleIcon />
                </IconButton>
              </Box>
            </Card>
            <Dialog open={open} onClose={handleClose}>
              <Box sx={{ border:1,display: "flex" }}>
                <Box sx={{  }}>
                  <DialogTitle>{groceryStoreItem?.name}</DialogTitle>
                  <Box
                    sx={{
                      display: "flex",
                      flexFlow: "column",
                      justifyContent: "space-around",
                      height: "50%",
                      alignItems: "center",
                    }}
                  >
                    <Typography color="#071236" variant="subtitle2">
                      {groceryStoreItem.notes}
                    </Typography>
                    <Typography color="#071236" variant="subtitle2">
                      {groceryStoreItem.quantity}
                    </Typography>
                  </Box>
                </Box>
                <CardMedia
                  component="img"
                  image={`${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${groceryStoreItem?.image}`}
                  alt={`Image of${groceryStoreItem.name} `}
                  sx={{ objectFit: "fill", width: 150, height: 150 }}
                />
              </Box>
              <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                <EditItem {...groceryStoreItem} />
              </DialogActions>
            </Dialog>
          </Badge>
        </>
      )}
    </>
  );
}
