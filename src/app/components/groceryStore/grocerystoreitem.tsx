"use client";

import { useEffect, useState } from "react";
import { GroceryStoreItemType } from "@/types";
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSupabase } from "../supabase/supabase-provider";
import EditItem from "../utils/editItem";

export default function GroceryStoreItem(item: GroceryStoreItemType) {
  const { supabase } = useSupabase();

  const [groceryItem, setGroceryItem] = useState<GroceryStoreItemType>(item);

  const showExtra = true;

  // TODO: do the edit functinliaty,
  // TODO: Fix all loading skeletons,
  useEffect(() => {
    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "grocerystoreitems",
          filter: `id=eq.${groceryItem?.id}`,
        },
        (payload) => {
          console.log("Update to the grocery items received!", payload);
          setGroceryItem(payload.new as GroceryStoreItemType);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const createdAtLocal = () => {
    if (groceryItem?.createdAt) {
      const localDate = new Date(groceryItem?.createdAt).toLocaleTimeString(
        [],
        {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }
      );
      return localDate;
    }
  };

  const handleDelete = async (itemId: number) => {
    const { data, error } = await supabase
      .from("grocerystoreitems")
      .delete()
      .eq("id", itemId.toString());
  };

  return (
    <>
      <Card
        sx={{
          border: 4,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          borderRadius: 5,
          maxWidth: 350,
        }}
        style={{ flexShrink: 0 }}
      >
        <CardActionArea onClick={() => alert("you logged this apparent?")}>
          <CardHeader title={groceryItem.name} subheader={createdAtLocal()} />

          <CardMedia
            component="img"
            height="150"
            image={"https://runescape.wiki/images/Barrel_detail.png?11423"}
            alt={`Image of${groceryItem.name} `}
          />

          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {groceryItem.name}
            </Typography>
            <Typography color="#EAEAEA" variant="body2">{groceryItem.notes}</Typography>
            <Typography variant="body2">{groceryItem.quantity}</Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <IconButton
            onClick={() => handleDelete(groceryItem.id)}
            aria-label="complete"
          >
            <CheckCircleIcon />
          </IconButton>
          <EditItem />
          <Button
            onClick={() => console.log("now you clicked  the button??")}
            size="small"
            color="primary"
          >
            Edit
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
