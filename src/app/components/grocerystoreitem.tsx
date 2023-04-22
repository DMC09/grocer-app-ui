"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "../supabase-provider";
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

export default function GroceryStoreItem(item: any) {
  const { supabase } = useSupabase();

  const [groceryItem, setGroceryItem] = useState<GroceryStoreItemType>(item);

  const showExtra = true;

  useEffect(() => {
    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "grocerystoreitems" },
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
          borderColor: "primary",
          flexDirection: "row",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          background: "primary",
          borderRadius: 5,
          maxWidth: 350,
          mx: 4,
        }}
        style={{ flexShrink: 0 }}
      >
        <CardActionArea
          onClick={() => console.log("you logged this apparent?")}
        >
          <CardHeader title={groceryItem.name} subheader={createdAtLocal()} />
          {showExtra && (
            <CardMedia
              component="img"
              height="150"
              image={groceryItem.image || ""}
              alt={`Image of${groceryItem.name} `}
            />
          )}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {groceryItem.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {groceryItem.notes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {groceryItem.quantity}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <IconButton
            onClick={() => handleDelete(groceryItem.id)}
            aria-label="complete"
          >
            <CheckCircleIcon color="primary" />
          </IconButton>
          <Button
            onClick={() => console.log("now you clicked  the button??")}
            size="small"
            color="primary"
          >
            Edit
          </Button>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    </>
  );
}
