/* eslint-disable react/jsx-no-undef */
"use client";
// Imports
import { DashboardView, GroceryStoreType, ProfileType } from "@/types";
import {
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { updateDashboardView } from "@/helpers/profile";
import useZustandStore from "@/hooks/useZustandStore";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { ProfileDataStore } from "@/stores/ProfileDataStore";
import { useDialog } from "@/context/DialogContext";
import { useMemo, useState } from "react";
import { useSupabase } from "../supabase/supabase-provider";
import AddNewStore from "../dialogs/addNewStoreDialog";
import AddNewItemDialog from "../dialogs/addNewItemDialog";
import CommonItemsDialog from "../dialogs/commonItemsDialog";
import { ItemDataStore } from "@/stores/ItemStore";
import { clearAllItems } from "@/helpers/ItemUtils";

export default function DashboardHeaderMenu() {
  const profileData = useZustandStore(ProfileDataStore, (state) => state?.data);
  const dashboardView = useZustandStore(
    ProfileDataStore,
    (state) => state?.dashboardView
  );
  const { supabase } = useSupabase();

  const itemsData = useZustandStore(ItemDataStore, (state) => state?.data);

  const itemIds = useMemo(() => {
    if (!itemsData) return []; // Handle empty array

    return itemsData.map((item) => item.id);
  }, [itemsData]); // Recalculate only when itemsData changes

  // State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const { openNewStoreDialog, openNewItemDialog, openCommonItemsDialog } =
    useDialog();

  async function handleOpenMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }
  async function handleCloseMenu() {
    setAnchorEl(null);
  }

  async function handleChangeView(view: DashboardView) {
    if (profileData?.id && dashboardView) {
      await updateDashboardView(supabase, profileData?.id, view);
    }
  }

  async function clearAll() {
    await clearAllItems(supabase, itemIds);
  }

  return (
    <>
      <IconButton
        sx={{ color: "primary.main", marginLeft: "auto" }}
        aria-label={open ? "Close dashboard menu" : "Open dashboard menu"}
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleOpenMenu}
      >
        {!open ? <MenuIcon /> : <CloseIcon />}
      </IconButton>
      <Menu
        aria-label="Dashboard Menu"
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
          <div>
            <MenuItem onClick={openNewItemDialog}>
              <ListItemIcon>
                <ControlPointIcon fontSize="small" />
              </ListItemIcon>
              Add item
            </MenuItem>

            <MenuItem onClick={() => openCommonItemsDialog()}>
              <ListItemIcon>
                <ControlPointIcon fontSize="small" />
              </ListItemIcon>
              Add common item
            </MenuItem>
          </div>
        )}

        {dashboardView === DashboardView.StoreView && (
          <MenuItem onClick={openNewStoreDialog}>
            <ListItemIcon>
              <ControlPointIcon fontSize="small" />
            </ListItemIcon>
            Add new store
          </MenuItem>
        )}
        {dashboardView === DashboardView.CategoryView && (
          <MenuItem onClick={() => alert("need to implement")}>
            <ListItemIcon>
              <ControlPointIcon fontSize="small" />
            </ListItemIcon>
            Add new category
          </MenuItem>
        )}
        <Divider />
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
        {dashboardView === DashboardView.AllItemsView ? (
          <div>
            <Divider />
            <MenuItem onClick={() => clearAll()}>
              <ListItemIcon>
                <DisabledByDefaultIcon fontSize="small" />
              </ListItemIcon>
              Clear All
            </MenuItem>
          </div>
        ) : null}
      </Menu>
      <>
        {profileData?.select_id && (
          <AddNewStore select_id={profileData?.select_id} />
        )}
        <AddNewItemDialog />
        {profileData?.select_id && (
          <CommonItemsDialog storeId={null} selectId={profileData?.select_id} />
        )}
      </>
    </>
  );
}
