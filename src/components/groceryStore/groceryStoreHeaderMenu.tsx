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
  Fade,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  useMediaQuery,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import GridViewIcon from "@mui/icons-material/GridView";
import TocIcon from "@mui/icons-material/Toc";
import { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Settings } from "@mui/icons-material";
import { useSupabase } from "../supabase/supabase-provider";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { GroceryStoreType, ProfileType } from "@/types";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { User } from "@supabase/supabase-js";
import {
  addNewGroceryStoreItem,
  deleteGroceryStore,
  updateGroceryStore,
} from "@/utils/client/groceryStore";
import {
  generateGroceryStoreItemImagePath,
  handleGroceryStoreImageUpload,
} from "@/utils/client/image";
import { theme } from "@/utils/theme";

import { handleChangeGroceryStoreItemView } from "@/utils/client/profile";
import CloseIcon from "@mui/icons-material/Close";
import useStore from "@/hooks/useStore";
import { useProfileStore } from "@/state/ProfileStore";

export default function GroceryStoreHeaderMenu(groceryStore: GroceryStoreType) {
  const profileData = useStore(useProfileStore, (state) => state?.data);

  // bring in the zustand stuff.
  // Hooks
  const { supabase, session } = useSupabase();
  const router = useRouter();
  // State
  const [user, SetUser] = useState<User | null | undefined>(session?.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [openSettingsDialog, setOpenSettingsDialog] = useState<boolean>(false);
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [updatedGroceryStoreName, setUpdatedGroceryStoreName] =
    useState<string>(groceryStore.name);
  const [newGroceryStoreName, setNewGroceryStoreName] = useState<string>();
  const [updatedImage, setUpdatedImage] = useState({
    preview: groceryStore?.image,
    raw: "",
  });
  const [newImage, setNewImage] = useState({
    preview: "",
    raw: "",
  });

  // Need to seperate dialogs for this,including seperate the state
  async function handleOpenMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }
  async function handleCloseMenu() {
    setAnchorEl(null);
  }
  async function handleSettingsDialogClose() {
    setOpenSettingsDialog(false);
  }
  async function handleCreateDialogClose() {
    setOpenCreateDialog(false);
  }

  async function handleDelete() {
    await deleteGroceryStore(supabase, groceryStore.id, router);
  }

  async function handleSetUpdatedImage(event: any) {
    if (event.target.files.length && groceryStore?.select_id) {
      const generatedImagePath = await generateGroceryStoreItemImagePath(
        groceryStore?.select_id
      );
      setImagePath(generatedImagePath);
      setUpdatedImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }

  async function handleSetNewImage(event: any) {
    if (event.target.files.length && groceryStore?.select_id) {
      const generatedImagePath = await generateGroceryStoreItemImagePath(
        groceryStore?.select_id
      );
      setImagePath(generatedImagePath);
      setNewImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }

  async function handleUpdateGroceryStoreSettings() {
    if (updatedImage.raw && imagePath) {
      await handleGroceryStoreImageUpload(
        supabase,
        imagePath,
        updatedImage?.raw
      );
      await updateGroceryStore(
        supabase,
        groceryStore.id,
        updatedGroceryStoreName,
        imagePath
      );
      setOpenSettingsDialog(false);
    } else {
      await updateGroceryStore(
        supabase,
        groceryStore.id,
        updatedGroceryStoreName
      );
      setOpenSettingsDialog(false);
    }
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

  async function handleSubmitNewItem() {
    if (groceryStore.select_id && newGroceryStoreName) {
      if (newImage.raw && imagePath) {
        await handleGroceryStoreImageUpload(supabase, imagePath, newImage?.raw);
        await addNewGroceryStoreItem(
          supabase,
          groceryStore.id,
          newGroceryStoreName,
          notes,
          Number(quantity),
          groceryStore.select_id,
          imagePath
        );
      } else {
        await addNewGroceryStoreItem(
          supabase,
          groceryStore.id,
          newGroceryStoreName,
          notes,
          Number(quantity),
          groceryStore.select_id
        );
      }
      setOpenCreateDialog(false);
      setNewGroceryStoreName("");
      setNotes("");
      setQuantity("");
      setNewImage({ preview: "", raw: "" });
    }
  }

  return (
    <>
      <IconButton
        sx={{ color: "primary.main" }}
        aria-label={!open? "Close grocery store menu":"Open grocery store menu"}
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
        <MenuItem onClick={() => setOpenCreateDialog(true)}>
          <ListItemIcon>
            <ControlPointIcon fontSize="small" />
          </ListItemIcon>
          Add Item
        </MenuItem>
        <MenuItem onClick={() => setOpenSettingsDialog(true)}>
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
        <Divider />
        <MenuItem onClick={handleDelete}>
          {/* need a modal to show the store settings which right now is the nmae */}
          <ListItemIcon>
            <DeleteForeverIcon fontSize="small" />
          </ListItemIcon>
          Delete Store
        </MenuItem>
      </Menu>
      <>
        {/* Create Dialog */}
        <Dialog
          fullScreen={fullScreen}
          open={openCreateDialog}
          onClose={handleCreateDialogClose}
        >
          <DialogTitle>Add new item</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="Name"
              label="Name"
              type="email"
              fullWidth
              variant="standard"
              onChange={(e) => setNewGroceryStoreName(e.target.value)}
              value={newGroceryStoreName}
            />
          </DialogContent>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="Notes"
              label="Notes"
              type="email"
              fullWidth
              variant="standard"
              onChange={(e) => setNotes(e.target.value)}
              value={notes}
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
            <TextField
              fullWidth
              type="number"
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              onChange={(e) => setQuantity(e.target.value)}
              value={quantity}
            />
            <Card
              sx={{
                maxWidth: 150,
                mt: 4,
              }}
            >
              {newImage.preview ? (
                <CardMedia
                  component="img"
                  height="150"
                  image={newImage.preview}
                  alt={`Image of `}
                />
              ) : (
                <CardMedia
                  component="img"
                  height="150"
                  image={
                    "https://filetandvine.com/wp-content/uploads/2015/07/pix-uploaded-placeholder.jpg"
                  }
                  alt={`Image of `}
                />
              )}
            </Card>

            <Button
              variant="contained"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
            >
              Upload File
              <input type="file" onChange={handleSetNewImage} hidden />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCreateDialogClose}>Cancel</Button>
            <Button onClick={handleSubmitNewItem}>Submit</Button>
          </DialogActions>
        </Dialog>
      </>
      <>
        {/* Settings Dialog */}
        <Dialog
          fullScreen={fullScreen}
          id="grocery-store-settings-dialog"
          open={openSettingsDialog}
          onClose={handleSettingsDialogClose}
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
              onChange={(e) => setUpdatedGroceryStoreName(e.target.value)}
              value={updatedGroceryStoreName}
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
            <Card
              sx={{
                maxWidth: 150,
              }}
            >
              {updatedImage.raw ? (
                <CardMedia
                  component="img"
                  height="150"
                  image={updatedImage.preview || ""}
                  alt={`Image of `}
                />
              ) : (
                <CardMedia
                  component="img"
                  height="150"
                  image={`${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${updatedImage.preview}`} //maybe this should be normal image??
                  alt={`Image of `}
                />
              )}{" "}
            </Card>

            <Button
              variant="contained"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
            >
              Upload File
              <input type="file" onChange={handleSetUpdatedImage} hidden />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSettingsDialogClose}>Cancel</Button>
            <Button onClick={handleUpdateGroceryStoreSettings}>Save</Button>
          </DialogActions>
        </Dialog>
      </>
    </>
  );
}
