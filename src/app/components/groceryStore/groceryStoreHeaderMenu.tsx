"use client";

import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Settings, Logout } from "@mui/icons-material";
import { useSupabase } from "../supabase/supabase-provider";
import { useRouter } from "next/navigation";
import { GroceryStoreType } from "@/types";

export default function GroceryStoreHeaderMenu(groceryStore: GroceryStoreType) {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [newGroceryStoreName, setNewGroceryStoreName] = useState<string>(
    groceryStore.name
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("grocerystores")
      .delete()
      .eq("id", groceryStore.id)
      .select();

    if (data && data.length > 0) {
      router.push("/dashboard");
    }
    if (error) {
      throw new Error(error.message);
    }
  };

  async function handleSave() {
    const { data, error } = await supabase
      .from("grocerystores")
      .update({ name: newGroceryStoreName })
      .eq("id", groceryStore.id)
      .single();

    if (error) {
      throw new Error(error.message);
    } else {
      setOpenDialog(false);
    }
  }

  return (
    <>
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
        <MenuItem onClick={() => setOpenDialog(true)}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Store Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete}>
          {/* need a modal to show the store settings which right now is the nmae */}
          <ListItemIcon>
            <DeleteForeverIcon fontSize="small" />
          </ListItemIcon>
          Delete Store
        </MenuItem>
      </Menu>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Grocery Store Settings</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="Name"
            label="Name"
            fullWidth
            variant="standard"
            onChange={(e) => setNewGroceryStoreName(e.target.value)}
            value={newGroceryStoreName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
