"use client";
// Imports
import {
  Button,
  Card,
  CardMedia,
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
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import GridViewIcon from "@mui/icons-material/GridView";
import TocIcon from "@mui/icons-material/Toc";
import { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Settings } from "@mui/icons-material";
import { useSupabase } from "../supabase/supabase-provider";
import { useRouter } from "next/navigation";
import { GroceryStoreType, ProfileType } from "@/types";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { User } from "@supabase/supabase-js";
import {
  getProfileData,
  handleChangeGroceryStoreItemView,
} from "@/app/utils/client/profile";
import {
  deleteGroceryStore,
  updateGroceryStore,
} from "@/app/utils/client/groceryStore";
import {
  generateGroceryStoreItemImagePath,
  handleGroceryStoreImageUpload,
} from "@/app/utils/client/image";

export default function GroceryStoreHeaderMenu(groceryStore: GroceryStoreType) {
  // Hooks
  const { supabase, session } = useSupabase();
  const router = useRouter();
  // State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openSettingsDialog, setOpenSettingsDialog] = useState<boolean>(false);
  const [user, SetUser] = useState<User | null | undefined>(session?.user);
  const [profile, SetProfile] = useState<ProfileType | null>(null);
  const [image, setImage] = useState({
    preview: groceryStore?.image,
    raw: "",
  });
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [newGroceryStoreName, setNewGroceryStoreName] = useState<string>(
    groceryStore.name
  );

  // Need to seperate dialogs for this,including seperate the state
  async function handleOpenMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }
  async function handleCloseMenu() {
    setAnchorEl(null);
  }
  async function handleDialogClose() {
    setOpenSettingsDialog(false);
  }

  async function getData() {
    const data = await getProfileData(supabase, user?.id);
    if (data) {
      SetProfile(data);
    }
  }

  async function handleDelete() {
    await deleteGroceryStore(supabase, groceryStore.id, router);
  }

  async function handleImageSet(event: any) {
    if (event.target.files.length && groceryStore?.select_id) {
      const generatedImagePath = await generateGroceryStoreItemImagePath(
        groceryStore?.select_id
      );
      setImagePath(generatedImagePath);
      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }

  async function handleUpdateSettings() {
    if (image.raw && imagePath) {
      await handleGroceryStoreImageUpload(supabase, imagePath, image?.raw);
      await updateGroceryStore(
        supabase,
        groceryStore.id,
        newGroceryStoreName,
        imagePath
      );
      setOpenSettingsDialog(false);
    } else {
      await updateGroceryStore(supabase, groceryStore.id, newGroceryStoreName);
      setOpenSettingsDialog(false);
    }
  }

  async function handleChangeView() {
    if (profile?.expanded_groceryitem !== undefined) {
      await handleChangeGroceryStoreItemView(
        supabase,
        profile?.expanded_groceryitem,
        profile?.id
      );
      await getData();
    }
  }

  useEffect(() => {
    if (session?.user) {
      getData();
    }
  }, [supabase]);

  return (
    <>
      <IconButton
        sx={{ color: "background.paper" }}
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleOpenMenu}
      >
        <MoreVertIcon />
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
        {/* <MenuItem onClick={() => setOpenSettingsDialog(true)}>
          <ListItemIcon>
            <ControlPointIcon fontSize="small" />
          </ListItemIcon>
          Add Item
        </MenuItem> */}
        <MenuItem onClick={() => setOpenSettingsDialog(true)}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Store Settings
        </MenuItem>
        <MenuItem onClick={handleChangeView}>
          <ListItemIcon>
            {profile?.expanded_groceryitem ? <GridViewIcon /> : <TocIcon />}
          </ListItemIcon>
          Change View
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
      <Dialog
        id="grocery-store-settings-dialog"
        open={openSettingsDialog}
        onClose={handleDialogClose}
      >
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
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexFlow: "column",
          }}
        >
          {image.raw ? (
            <Card
              sx={{
                maxWidth: 150,
              }}
            >
              <CardMedia
                component="img"
                height="150"
                image={image.preview || ""}
                alt={`Image of `}
              />
            </Card>
          ) : (
            <Card
              sx={{
                maxWidth: 150,
              }}
            >
              <CardMedia
                component="img"
                height="150"
                image={`${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${image.preview}`}
                alt={`Image of `}
              />
            </Card>
          )}
          <Button
            variant="contained"
            component="label"
            startIcon={<AddPhotoAlternateIcon />}
          >
            Upload File
            <input type="file" onChange={handleImageSet} hidden />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleUpdateSettings}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
