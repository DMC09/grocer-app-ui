"use client";

import { useEffect, useState } from "react";
import { GroceryStoreItemType } from "@/types";
import {
  Badge,
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

  const created_atLocal = () => {
    if (item?.created_at) {
      const localDate = new Date(item?.created_at).toLocaleTimeString([], {
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

  return (
    <>
      <Badge
        color="primary"
        variant="dot"
        invisible={!updatedRecently(item.modified_at)}
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
            title={item.name}
          />
          <CardContent sx={{ p: 0.5, m: 0 }}>
            <Typography color="#071236" variant="body2">
              {item.notes}
            </Typography>
          </CardContent>
          <CardActionArea
            onClick={() => alert("you logged this apparent?")}
            sx={{ p: 0, m: 0 }}
          >
            <CardMedia
              component="img"
              height="150"
              image={`${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${item?.image}`}
              alt={`Image of${item.name} `}
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
              onClick={() => handleDelete(item.id.toString())}
              aria-label="complete"
            >
              <CheckCircleIcon />
            </IconButton>
            <Typography color="#071236" variant="subtitle2">
              {item.quantity}
            </Typography>
            {/* <Typography color="#071236" variant="caption">
              {created_atLocal()}
            </Typography> */}
            <EditItem {...item} />
          </CardActions>
        </Card>
      </Badge>
    </>
  );
}
