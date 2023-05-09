"use client";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import React, { useEffect, useState } from "react";
import { useSupabase } from "../supabase-provider";
import AddItem from "./addItem";

export default function NoItems({ storeId }: { storeId: number }) {
  const [open, setOpen] = useState(false);

  const { supabase } = useSupabase();

  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  function handleClickAway(event: MouseEvent | TouchEvent): void {
    console.log("is this outside??");
  }

  return (
    <>
      <Container
        sx={{
          display: "flex",
          flexFlow: "column",
          justifyContent: "center",
          textAlign: "center",
          p: 1,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No items available. please add one
        </Typography>
        <AddItem storeId={storeId} />
      </Container>
    </>
  );
}
