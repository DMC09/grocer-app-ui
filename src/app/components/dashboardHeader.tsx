"use client";

import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  ThemeProvider,
  Button,
  Typography,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSupabase } from "./supabase/supabase-provider";
import { useEffect, useMemo, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import HomeIcon from "@mui/icons-material/Home";

import { theme } from "../utils/theme";
import { PostgrestError } from "@supabase/supabase-js";
import AddStore from "./utils/addStore";

export default function DashboardHeader() {
  //TODO: move the add store logic to it's own file.
  const { supabase, session } = useSupabase();

  const [open, setOpen] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [newGroceryStoreName, setNewGroceryStoreName] = useState<string>("");

  const getSelectId = useMemo(async (): Promise<number | null> => {
    const { data, error }: { data: any; error: PostgrestError | null } =
      await supabase.from("profiles").select("select_id").single();
    if (data) {
      return data?.select_id;
    } else {
      throw new Error(error?.message);
      return null;
    }
  }, []);

  async function handleClickOpen() {
    setOpen(true);
  }

  function handleChange(text: string): void {
    setNewGroceryStoreName(text);
  }

  function handleClose(event: {}): void {
    setOpen(false);
    setNewGroceryStoreName("");
  }

  function isValidInput(text: string) {
    // Check if the text is empty
    if (text.trim() === "") {
      return "The text is empty.";
    }

    // Check if the text is valid alphanumeric
    const regExp = /^[a-zA-Z0-9]+$/;
    if (!regExp.test(text)) {
      return "The text is not valid alphanumeric.";
    } else {
      return;
    }
  }

  async function handleSubmit() {
    // logic to stop submission if ther is not correct submisiso n
    const select_id = await getSelectId;
    const { data, error } = await supabase
      .from("grocerystores")
      .insert([{ name: newGroceryStoreName, select_id }]);
    if (error) {
      throw new Error(error.message);
    } else {
      setOpen(false);
      setNewGroceryStoreName("");
    }
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        {/* make a contianeher here  */}
        <Card
          sx={{
            display: "flex",
            flexFlow: "row",
            backgroundColor: "primary.main",
            justifyContent: "space-between",
          }}
        >
          <div></div>
          <Typography align="center" color="#EAEAEA" variant="h3">
            Dashboard!!
          </Typography>
          <AddStore />
        </Card>
      </ThemeProvider>
    </>
  );
}
