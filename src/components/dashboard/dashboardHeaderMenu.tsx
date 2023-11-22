"use client";
// Imports
import {
  Divider,
  Fade,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useContext, useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Settings } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { GroceryStoreType, ProfileType } from "@/types";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import CloseIcon from "@mui/icons-material/Close";
import useZustandStore from "@/hooks/useZustandStore";
import { ProfileDataStore } from "@/stores/ProfileDataStore";

import { useDialog } from "@/context/DialogContext";

import { GroceryDataStore } from "@/stores/GroceryDataStore";
import {
  deleteGroceryStore,
  getAllGroceryStoresData,
} from "@/helpers/groceryStore";
import { handleChangeGroceryStoreItemView } from "@/helpers/profile";

import CommonItemsDialog from "@/components/dialogs/commonItemsDialog";
import { useSupabase } from "../supabase/supabase-provider";
import AddNewStore from "../dialogs/addNewStoreDialog";

export default function DashboardHeaderMenu() {
  const profileData = useZustandStore(ProfileDataStore, (state) => state?.data);
  const { supabase, session } = useSupabase();
  const router = useRouter();
  // State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const GroceryStoreData = GroceryDataStore((state) => state.data);

  const { openNewStoreDialog } = useDialog();

  async function handleOpenMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }
  async function handleCloseMenu() {
    setAnchorEl(null);
  }

  async function fetchData() {
    await getAllGroceryStoresData(supabase);
  }

  async function handleChangeView() {
    if (profileData?.expanded_groceryitem !== undefined) {
      await handleChangeGroceryStoreItemView(
        supabase,
        profileData?.expanded_groceryitem,
        profileData?.id
      );
    }
  }

  return (
    <>
      <IconButton
        sx={{ color: "primary.main", marginLeft: "auto" }}
        aria-label={
          open ? "Close grocery store menu" : "Open grocery store menu"
        }
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleOpenMenu}
      >
        {!open ? <MenuIcon /> : <CloseIcon />}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
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
        <MenuItem onClick={openNewStoreDialog}>
          <ListItemIcon>
            <ControlPointIcon fontSize="small" />
          </ListItemIcon>
          Add Store
        </MenuItem>
        <Divider />
        {/* <MenuItem onClick={() => console.log("logged")}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Store Settings
        </MenuItem> */}
        {/* <MenuItem onClick={handleChangeView}>
          <ListItemIcon>
            {profileData?.expanded_groceryitem ? <GridViewIcon /> : <TocIcon />}
          </ListItemIcon>
          Change View
        </MenuItem> */}

        <MenuItem onClick={() => console.log("logged")}>
          <ListItemIcon>
            <ListAltIcon fontSize="small" />
          </ListItemIcon>
          View by Store
        </MenuItem>
        <MenuItem onClick={() => console.log("logged")}>
          <ListItemIcon>
            <ListAltIcon fontSize="small" />
          </ListItemIcon>
          View by Category
        </MenuItem>
      </Menu>
      <>
        {profileData?.select_id && (
          <AddNewStore select_id={profileData?.select_id} />
        )}
      </>
    </>
  );
}
