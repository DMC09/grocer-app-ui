"use client";

import {
  Box,
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { ProfileType } from "@/types";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useSupabase } from "../supabase/supabase-provider";
import { theme } from "@/helpers/theme";

export default function EditProfileSettings(profile: ProfileType | null) {
  const { supabase } = useSupabase();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [firstName, setFirstName] = useState<string | null | undefined>(
    profile?.first_name
  );
  const [lastName, setLastName] = useState<string | null | undefined>(
    profile?.last_name
  );
  const [phone, setPhone] = useState<string | null | undefined>(profile?.phone);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [image, setImage] = useState({
    preview: profile?.avatar_url,
    raw: "",
  });
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function handleImageUpload() {
    if (image.raw && imagePath) {
      // TODO: error handling
      const { data, error } = await supabase.storage
        .from("profile")
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

  async function handleEdit() {
    // do the update on this one I guess

    const now = new Date().toISOString();
    if (image.raw) {
      await handleImageUpload();
      const { data, error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          updated_at: now,
          avatar_url: imagePath,
          phone,
        })
        .eq("id", profile?.id)
        .select();

      if (data) {
        setOpen(false);
      } else if (error) {
        throw new Error(error.message);
      }
    } else {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          updated_at: now,
          phone,
        })
        .eq("id", profile?.id)
        .select();

      if (data) {
        setOpen(false);
      } else if (error) {
        throw new Error(error.message);
      }
    }
  }
  async function generateImagePath(select_id: string) {
    //Formula is last 16 characters of select_id + Current DateTime in seconds/
    const lastPartOfSelectId = select_id?.slice(-16);
    const currentTimeStamp = new Date().getTime();

    setImagePath(`profiles/${lastPartOfSelectId}/${currentTimeStamp}`);
  }

  async function handleImageSet(event: any) {
    if (event.target.files.length && profile?.select_id) {
      generateImagePath(profile?.select_id);
      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }

  return (
    <>
      <IconButton
        sx={{ color: "primary.main" }}
        aria-label="Edit Profile Settings"
        onClick={handleClickOpen}
      >
        <EditIcon sx={{ fontSize: 25 }} />
      </IconButton>
      <Dialog open={open} fullScreen={fullScreen} onClose={handleClose}>
        <DialogTitle align="center">Edit Profile Settings</DialogTitle>
        <Box
        sx={{}}
        >
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="First Name"
              fullWidth
              variant="standard"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            />
          </DialogContent>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Last Name"
              fullWidth
              variant="standard"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            />
          </DialogContent>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Phone"
              fullWidth
              variant="standard"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
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
                  width:"100%"
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={image.preview || ""}
                  alt={`Image of `}
                sx={{objectFit:"fill"}}
                />
              </Card>
            ) : (
              <Card
                sx={{
width:"100%"
                }}
              >
                {profile?.avatar_url && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${process?.env?.NEXT_PUBLIC_SUPABASE_PROFILE}/${profile?.avatar_url}`}
                    alt={`Image of `}
                    sx={{objectFit:"fill"}}
                  />
                )}
              </Card>
            )}
            <Button
              sx={{
                mt: 2,
              }}
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
            >
              Upload Profile Picture
              <input type="file" onChange={handleImageSet} hidden />
            </Button>
          </DialogContent>
        </Box>
        <DialogActions
        sx={{
          mt:2
        }}
        
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleEdit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
