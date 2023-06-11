"use client";

import {
  ThemeProvider,
  Typography,
  Card,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSupabase } from "./supabase/supabase-provider";
import { useCallback, useEffect, useMemo, useState } from "react";
import GridViewIcon from '@mui/icons-material/GridView';

import { theme } from "../utils/theme";
import { PostgrestError } from "@supabase/supabase-js";
import AddStore from "./utils/addStore";
import { Settings } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import image from "next/image";

export default function DashboardHeader() {
  //TODO: move the add store logic to it's own file.
  const { supabase, session } = useSupabase();
  const [selectId, setSelectId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [altView, setAltView] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    async function getSelectId() {
      const { data, error } = await supabase
        .from("profiles")
        .select("select_id")
        .eq("id", session?.user.id)
        .single();
      if (error) {
        throw new Error(error.message);
      } else {
        setSelectId(data?.select_id);
      }
    }

    getSelectId();
  }, [supabase]);

  function handleDelete() {
    throw new Error("Function not implemented.");
  }

  function handleChangeView() {
    throw new Error("Function not implemented.");
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
            <Typography align="center" color="#EAEAEA" variant="h3">
              Dashboard
            </Typography>
            <div>
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
                {/* <MenuItem onClick={() => setOpenDialog(true)}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Store Settings
                </MenuItem> */}
                {/* <Divider /> */}
                <MenuItem onClick={handleChangeView}>
                  {/* need a modal to show the store settings which right now is the nmae */}
                  <ListItemIcon>
                    <GridViewIcon fontSize="small" />
                  </ListItemIcon>
                  Change View
                </MenuItem>
              </Menu>
            </div>
          </Card>
        )}
      </ThemeProvider>
    </>
  );
}
