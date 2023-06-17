"use client";

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

export default function GroceryStoreHeaderMenu(groceryStore: GroceryStoreType) {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
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

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

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
  async function generateImagePath(select_id: string) {
    //Formula is last 16 characters of select_id + Current DateTime in seconds/
    const lastPartOfSelectId = select_id?.slice(-16);
    const currentTimeStamp = new Date().getTime();

    setImagePath(
      `grocerystore_images/${lastPartOfSelectId}/${currentTimeStamp}`
    );
  }

  async function handleImageSet(event: any) {
    if (event.target.files.length && groceryStore?.select_id) {
      generateImagePath(groceryStore?.select_id);
      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }

  async function handleImageUpload() {
    if (image.raw && imagePath) {
      const { data, error } = await supabase.storage
        .from("grocerystore")
        // Need a custom path thing for this.
        // Also need to getthe public url
        .upload(imagePath, image.raw);
      if (error) {
        throw new Error(`Error uploading image ${error.message}`);
      } else {
        console.log(data, "image uploaded successfully");
      }
    }
  }

  useEffect(() => {
    if (session?.user) {
      getProfileData();
    }
  }, [supabase]);

  // need to be able to upload the image an then on the save just send the image path.

  async function handleSave() {
    if (image.raw) {
      await handleImageUpload();
      const { data, error } = await supabase
        .from("grocerystores")
        .update({ name: newGroceryStoreName, image: imagePath })
        .eq("id", groceryStore.id)
        .single();
      if (error) {
        throw new Error(error.message);
      } else {
        setOpenDialog(false);
      }
    } else {
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
  }

  async function handleChangeView() {
    console.log("chaning view!")
    const { data, error } = await supabase
      .from("profiles")
      .update({ expanded_groceryitem: !profile?.expanded_groceryitem })
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
        <MenuItem onClick={handleChangeView}>
          <ListItemIcon>
          {profile?.expanded_groceryitem ? (
                      <GridViewIcon />
                    ) : (
                      <TocIcon />
                    )}
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
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
