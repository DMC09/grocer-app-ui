"use client";
// Imports
import {
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import ListAltIcon from "@mui/icons-material/ListAlt";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useContext, useEffect, useMemo, useState } from "react";
import { Settings } from "@mui/icons-material";
import { useSupabase } from "../../supabase/supabase-provider";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { GroceryStoreType } from "@/types";
import CloseIcon from "@mui/icons-material/Close";
import useZustandStore from "@/hooks/useZustandStore";
import { ProfileDataStore } from "@/stores/ProfileDataStore";
import { useDialog } from "@/context/DialogContext";
import { GroceryDataStore } from "@/stores/GroceryDataStore";
import {
  deleteGroceryStore,
  fetchAllItems,
  fetchAllGroceryStores,
} from "@/helpers/groceryStore";
import CommonItemsDialog from "@/components/dialogs/commonItemsDialog";
import EditGroceryStoreDialog from "@/components/dialogs/editGroceryStoreDialog";
import AddNewStoreItem from "@/components/dialogs/addNewStoreItem";
import { clearAllItems } from "@/helpers/ItemUtils";
import { ItemDataStore } from "@/stores/ItemStore";

export default function GroceryStoreHeaderMenu(groceryStore: GroceryStoreType) {
  const profileData = useZustandStore(ProfileDataStore, (state) => state?.data);
  const { supabase, session } = useSupabase();
  const router = useRouter();
  // State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const GroceryStoreData = GroceryDataStore((state) => state.data);
  const itemsData = useZustandStore(ItemDataStore, (state) => state?.data);
  const itemIds = useMemo(() => {
    if (!itemsData) return []; // Handle empty array

    return itemsData
      .filter((item) => item.store_id === groceryStore.id)
      .map((item) => item.id);
  }, [groceryStore.id, itemsData]); // Recalculate only when itemsData changes

  const { openCommonItemsDialog, openNewItemDialog, openStoreSettingsDialog } =
    useDialog();

  async function handleOpenMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }
  async function handleCloseMenu() {
    setAnchorEl(null);
  }

  async function fetchData() {
    await fetchAllGroceryStores(supabase);
    await fetchAllItems(supabase);
  }

  async function handleDeleteGroceryStore() {
    const deletedStoreId = await deleteGroceryStore(
      supabase,
      groceryStore.id,
      router
    );

    if (deletedStoreId) {
      await fetchData();
    }
  }

  async function clearAll() {
    await clearAllItems(supabase, itemIds);
  }

  return (
    <>
      <IconButton
        sx={{ color: "primary.main" }}
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
        <MenuItem onClick={openNewItemDialog}>
          <ListItemIcon>
            <ControlPointIcon fontSize="small" />
          </ListItemIcon>
          Add Item
        </MenuItem>
        <MenuItem onClick={openStoreSettingsDialog}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Store Settings
        </MenuItem>
        {/* <MenuItem onClick={handleChangeView}>
          <ListItemIcon>
            {profileData?.expanded_groceryitem ? <GridViewIcon /> : <TocIcon />}
          </ListItemIcon>
          Change View
        </MenuItem> */}

        <MenuItem onClick={openCommonItemsDialog}>
          <ListItemIcon>
            <ListAltIcon fontSize="small" />
          </ListItemIcon>
          Add Common Item
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => clearAll()}>
          <ListItemIcon>
            <DisabledByDefaultIcon fontSize="small" />
          </ListItemIcon>
          Clear All
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteGroceryStore}>
          <ListItemIcon>
            <DeleteForeverIcon fontSize="small" />
          </ListItemIcon>
          Delete Store
        </MenuItem>
      </Menu>
      <>
        <AddNewStoreItem groceryStoreId={groceryStore.id} />
      </>
      <>
        <EditGroceryStoreDialog {...groceryStore} />
      </>
      <>
        <CommonItemsDialog
          selectId={groceryStore.select_id}
          storeId={groceryStore.id}
        />
      </>
    </>
  );
}
