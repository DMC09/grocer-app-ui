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
  Typography,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { BucketType, ImageType, ProfileType } from "@/types";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useSupabase } from "../supabase/supabase-provider";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { theme } from "@/helpers/theme";
import { generateImagePath, handleImageUpload } from "@/helpers/image";
import { editProfileData } from "@/helpers/profile";

export default function EditProfileSettings(profile: ProfileType) {
  // Component State
  const [firstName, setFirstName] = useState<string | null>(
    profile?.first_name
  );
  const [lastName, setLastName] = useState<string | null>(profile?.last_name);
  const [image, setImage] = useState({
    preview: profile?.avatar_url,
    raw: "",
  });
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState<string | null>(profile?.phone);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [showImageError, setShowImageError] = useState<boolean | null>(null);

  // Hooks
  const { supabase } = useSupabase();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Event Handlers
  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  async function dismissError() {
    setImage({ preview: profile?.avatar_url, raw: "" });
    setImagePath(null);
    setShowImageError(null);
  }

  async function handleImageSet(event: any) {
    if (event.target.files.length && profile?.select_id) {
      const generatedPath = await generateImagePath(
        profile?.select_id,
        ImageType.Profile
      );

      const sizeInMB = event.target.files[0].size / 1048576;

      if (sizeInMB > 50) {
        setShowImageError(true);
        setImagePath(null);
        setImage({ preview: profile?.avatar_url, raw: "" });
      } else {
        setImagePath(generatedPath);
        setImage({
          preview: URL.createObjectURL(event.target.files[0]),
          raw: event.target.files[0],
        });
      }
    }
  }

  async function handleEdit() {
    const timeStamp = new Date().toISOString();

    if (image.raw && imagePath) {
      await handleImageUpload(
        supabase,
        imagePath,
        image?.raw,
        BucketType.Profile
      );

      const newProfileData = await editProfileData(
        supabase,
        firstName,
        lastName,
        timeStamp,
        imagePath,
        phone,
        profile?.id
      );

      if (newProfileData) {
        setOpen(false);
      } else {
        throw new Error("Unable to update profile");
      }
    }
  }

  return (
    <>
      <IconButton
        sx={{ color: "primary.main" }}
        aria-label="Edit Profile Settings"
        onClick={handleOpen}
      >
        <EditIcon sx={{ fontSize: 25 }} />
      </IconButton>
      <Dialog open={open} fullScreen={fullScreen} onClose={handleClose}>
        <DialogTitle align="center">Edit Profile Settings</DialogTitle>
        <Box sx={{}}>
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
                  width: "100%",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={image.preview || ""}
                  alt={`Preview  `}
                  sx={{ objectFit: "fill" }}
                />
              </Card>
            ) : (
              <Card
                sx={{
                  width: "100%",
                }}
              >
                {profile?.avatar_url && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${process?.env?.NEXT_PUBLIC_SUPABASE_PROFILE}/${profile?.avatar_url}`}
                    alt={` ${profile.first_name} ${profile.last_name}  `}
                    sx={{ objectFit: "fill" }}
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
          {showImageError && (
            <Box
              sx={{
                border: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 2,
                p: 0.5,
                backgroundColor: "red",
                borderRadius: 5,
              }}
            >
              <IconButton
                onClick={async () => await dismissError()}
                aria-label="delete"
                sx={{
                  color: "white",
                }}
              >
                <HighlightOffIcon />
              </IconButton>
              <Typography sx={{ pr: 1 }} color={"white"}>
                Image too large
              </Typography>
            </Box>
          )}
        </Box>
        <DialogActions
          sx={{
            mt: 2,
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
