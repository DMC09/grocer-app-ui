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

  async function handleChangeView() {
    const { data, error } = await supabase
      .from("profiles")
      .update({ expanded_dashboard: !profile?.expanded_dashboard })
      .eq("id", profile?.id)
      .single();

    if (error) {
      throw new Error(error.message);
    } else {
      await getProfileData();
    }
  }

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
            <Typography color="#EAEAEA" variant="h3">
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
              <IconButton
                sx={{ color: "background.paper" }}
                aria-label="more"
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {/* <Divider /> */}
                <MenuItem onClick={handleChangeView}>
                  <ListItemIcon>
                    {profile?.expanded_dashboard ? (
                      <GridViewIcon />
                    ) : (
                      <TocIcon />
                    )}
                  </ListItemIcon>
                  Change View
                </MenuItem>
              </Menu>
            </Box>
          </Card>
        )}
      </ThemeProvider>
    </>
  );
}
