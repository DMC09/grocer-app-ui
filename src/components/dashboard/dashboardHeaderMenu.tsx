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
import CheckIcon from "@mui/icons-material/Check";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useContext, useEffect, useMemo, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Settings } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { DashboardView, GroceryStoreType, ProfileType } from "@/types";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import CloseIcon from "@mui/icons-material/Close";
import useZustandStore from "@/hooks/useZustandStore";
import { ProfileDataStore } from "@/stores/ProfileDataStore";
import { useDialog } from "@/context/DialogContext";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { GroceryDataStore } from "@/stores/GroceryDataStore";
import {
  deleteGroceryStore,
  getAllGroceryStoresData,
} from "@/helpers/groceryStore";
import { handleChangeGroceryStoreItemView } from "@/helpers/profile";
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

  async function handleChangeView(view: DashboardView) {
    switch (view) {
      case DashboardView.AllItemsView:
        await supabase
          .from("profiles")
          .update({ view_by_category: false, view_all: true })
          .eq("id", profileData?.id)
          .select()
          .single();
        break;
      case DashboardView.CategoryView:
        await supabase
          .from("profiles")
          .update({ view_by_category: true, view_all: false })
          .eq("id", profileData?.id)
          .select()
          .single();
        break;
      case DashboardView.StoreView:
        await supabase
          .from("profiles")
          .update({ view_by_category: false, view_all: false })
          .eq("id", profileData?.id)
          .select()
          .single();
        break;
      default:
        console.error("Invalid DashboardView value:", view);
        break;
    }
  }

  const dashboardView = useMemo(() => {
    let dashboardView;

    switch (true) {
      case profileData?.view_all:
        dashboardView = DashboardView.AllItemsView;
        break;
      case profileData?.view_by_category:
        dashboardView = DashboardView.CategoryView;
        break;
      default:
        dashboardView = DashboardView.StoreView;
    }

    return dashboardView;
  }, [profileData?.view_all, profileData?.view_by_category]);

  //   Depending on View I want to show different things
  // All Items mode I want to show only Add Item
  // Category Mode I want to show add Category
  // store mode keep all stores
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
        {dashboardView === DashboardView.AllItemsView && (
          <MenuItem onClick={openNewStoreDialog}>
            <ListItemIcon>
              <ControlPointIcon fontSize="small" />
            </ListItemIcon>
            Add Item
          </MenuItem>
        )}

        {dashboardView === DashboardView.StoreView && (
          <MenuItem onClick={openNewStoreDialog}>
            <ListItemIcon>
              <ControlPointIcon fontSize="small" />
            </ListItemIcon>
            Add Store
          </MenuItem>
        )}
        {dashboardView === DashboardView.CategoryView && (
          <MenuItem onClick={() => alert("need to implement")}>
            <ListItemIcon>
              <ControlPointIcon fontSize="small" />
            </ListItemIcon>
            Add Category
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={() => handleChangeView(DashboardView.CategoryView)}>
          <ListItemIcon>
            {dashboardView === DashboardView.CategoryView ? (
              <CheckCircleRoundedIcon fontSize="small" />
            ) : (
              <RadioButtonUncheckedIcon fontSize="small" />
            )}
          </ListItemIcon>
          View by <cite></cite>ategory
        </MenuItem>
        <MenuItem onClick={() => handleChangeView(DashboardView.StoreView)}>
          <ListItemIcon>
            {dashboardView === DashboardView.StoreView ? (
              <CheckCircleRoundedIcon fontSize="small" />
            ) : (
              <RadioButtonUncheckedIcon fontSize="small" />
            )}
          </ListItemIcon>
          View by store
        </MenuItem>
        <MenuItem onClick={() => handleChangeView(DashboardView.AllItemsView)}>
          <ListItemIcon>
            {dashboardView === DashboardView.AllItemsView ? (
              <CheckCircleRoundedIcon fontSize="small" />
            ) : (
              <RadioButtonUncheckedIcon fontSize="small" />
            )}
          </ListItemIcon>
          View all
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
