"use client";

import { useEffect, useState } from "react";
import { GroceryStoreItemType } from "@/types";
import {
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

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSupabase } from "../supabase/supabase-provider";
import EditItem from "../utils/editItem";

export default function GroceryStoreItem(item: GroceryStoreItemType) {
  const { supabase } = useSupabase();

  const created_atLocal = () => {
    if (item?.created_at) {
      const localDate = new Date(item?.created_at).toLocaleTimeString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
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
          <CardHeader title={item.name} subheader={created_atLocal()} />

          <CardMedia
            component="img"
            height="150"
            image={"https://runescape.wiki/images/Barrel_detail.png?11423"}
            alt={`Image of${item.name} `}
          />

          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {item.name}
            </Typography>
            <Typography color="#EAEAEA" variant="body2">
              {item.notes}
            </Typography>
            <Typography variant="body2">{item.quantity}</Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <IconButton
            onClick={() => handleDelete(item.id.toString())}
            aria-label="complete"
          >
            <CheckCircleIcon />
          </IconButton>
          <EditItem {...item} />
        </CardActions>
      </Card>
    </>
  );
}
