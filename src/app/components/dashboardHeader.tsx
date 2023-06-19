"use client";

import {
  ThemeProvider,
  Typography,
  Card,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import TocIcon from "@mui/icons-material/Toc";
import { useSupabase } from "./supabase/supabase-provider";
import { useEffect, useMemo, useState } from "react";
import GridViewIcon from "@mui/icons-material/GridView";

import { theme } from "../utils/theme";
import { PostgrestError, User } from "@supabase/supabase-js";
import AddStore from "./utils/addStore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ProfileType } from "@/types";

export default function DashboardHeader() {
  const { supabase, session } = useSupabase();
  const [selectId, setSelectId] = useState<string | null>(null);
  const [user, SetUser] = useState<User | null | undefined>(session?.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profile, SetProfile] = useState<ProfileType | null>(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  //maybe get all the profile data an memoiz just the select_id
  //test if this changes from group
  async function getProfileData() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();
    if (error) {
      throw new Error(error.message);
    } else {
      SetProfile(data);
    }
  }
  async function getSelectId() {
    const { data, error } = await supabase
      .from("profiles")
      .select("select_id")
      .eq("id", user?.id)
      .single();
    if (error) {
      throw new Error(error.message);
    } else {
      setSelectId(data?.select_id);
    }
  }
  useEffect(() => {
    if (session?.user) {
      getSelectId();
      getProfileData();
    }
  }, [supabase]);

  return (
    <>
      <ThemeProvider theme={theme}>
        {/* make a contianeher here  */}
        {selectId && (
          <Card
            sx={{
              display: "flex",
              flexFlow: "row",
              backgroundColor: "primary.main",
              justifyContent: "space-between",
            }}
          >
            <div></div>
            <Typography color="secondary.main" variant="h3">
              Dashboard
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AddStore select_id={selectId} />
            </Box>
          </Card>
        )}
      </ThemeProvider>
    </>
  );
}
