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
import { useSupabase } from "../supabase/supabase-provider";

export default function NoItems() {
  return (
    <>
      <Container
        sx={{
          display: "flex",
          flexFlow: "column",
          justifyContent: "center",
          textAlign: "center",
          p: 1,
          border: 1,
        }}
      >
        <Typography variant="h4" color="text.secondary">
          No items available. please add one
        </Typography>
      </Container>
    </>
  );
}
