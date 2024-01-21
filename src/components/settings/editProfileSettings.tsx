"use client";

import {
  Backdrop,
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
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
import { editProfileData, getProfileData } from "@/helpers/profile";
import { useForm, Controller, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { mixed } from "yup";
import "yup-phone-lite";

export default function EditProfileSettings(profile: ProfileType) {
  // Component State
  const [image, setImage] = useState({
    preview: profile?.avatar_url,
    raw: "",
  });
  const [open, setOpen] = useState(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [imagePath, setImagePath] = useState<string | null>(null);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().matches(
      /^[a-zA-Z0-9 _\-!\$\.\;\#\&]+$/i,
      "Please only use letters and numbers"
    ), // only space and letters
    lastName: Yup.string().matches(
      /^[a-zA-Z0-9 _\-!\$\.\;\#\&]+$/i,
      "Please only use letters and numbers"
    ), // only space and letters
    phone: Yup.string().phone("US", "Please enter a valid phone number"),
    file: mixed()
      .notRequired()
      .test("fileSize", "The file is too large", (value: any) => {
        if (value && value[0]) {
          const sizeInMega = value[0].size / 1048576;
          return sizeInMega < 10;
        }
        return true;
      }),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: profile.first_name || "",
      lastName: profile.last_name || "",
      phone: profile.phone ? profile.phone : undefined,
    },
  });

  // Hooks
  const { supabase, session } = useSupabase();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Event Handlers
  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setImagePath(null);
    setImage({ preview: profile?.avatar_url, raw: "" });
    reset({
      firstName: profile.first_name || "",
      lastName: profile.last_name || "",
      phone: profile.phone ? profile.phone : "",
    });
    setOpen(false);
  }

  async function getData() {
    await getProfileData(supabase, session?.user.id);
  }

  async function handleSetImage(event: any) {
    setImagePath(null);
    setImage({ preview: profile?.avatar_url, raw: "" });

    if (event.target.files.length && profile?.select_id) {
      const generatedPath = await generateImagePath(
        profile?.select_id,
        ImageType.Profile
      );

      setImagePath(generatedPath);
      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }

  async function onSubmit(data: any) {
    try {
      console.log("submitting!");
      setShowLoader(true);
      const timeStamp = new Date().toISOString();
      if (image.raw && imagePath) {
        await handleImageUpload(
          supabase,
          imagePath,
          image?.raw,
          BucketType.Profile
        );
      }
      const newProfileData = await editProfileData(
        supabase,
        data.firstName,
        data.lastName,
        timeStamp,
        imagePath,
        data.phone,
        profile?.id
      );

      if (newProfileData) {
        console.log(newProfileData, "new data!");
        await getData();
      } else {
        console.log("could not get data?r");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShowLoader(false);
      setOpen(false);
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
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={showLoader}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle align="center">Edit Profile Settings</DialogTitle>
        <Box sx={{}}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="First Name"
              fullWidth
              variant="outlined"
              {...register("firstName")}
            />
            <Typography variant="inherit" color="red">
              {errors.firstName?.message}
            </Typography>
          </DialogContent>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Last Name"
              fullWidth
              variant="outlined"
              {...register("lastName")}
            />
            <Typography variant="inherit" color="red">
              {errors.lastName?.message}
            </Typography>
          </DialogContent>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Phone"
              fullWidth
              variant="outlined"
              {...register("phone")}
            />
            <Typography variant="inherit" color="red">
              {errors.phone?.message}
            </Typography>
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
                height: 200,
                width: 200,
                borderRadius: 25,
                border:2
              }}
            >
              <CardMedia
                component="img"
                height={250}
                width={250}
                image={
                  (image.raw && image.preview) ||
                  `${process?.env?.NEXT_PUBLIC_SUPABASE_PROFILE}/${profile?.avatar_url}`
                }
                alt={`Preview  `}
                sx={{ objectFit: "cover"}}
              />
            </Card>
            <Button
              sx={{
                mt: 2,
              }}
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
            >
              Upload Profile Picture
              <input
                type="file"
                {...register("file", {
                  onChange: handleSetImage,
                })}
                hidden
              />
            </Button>
            <Typography variant="inherit" color="red">
              {errors.file?.message}
            </Typography>
          </DialogContent>
        </Box>
        <DialogActions
          sx={{
            mt: 2,
          }}
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
