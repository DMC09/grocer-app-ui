"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Card,
  CardMedia,
  useMediaQuery,
  useTheme,
  Box,
  Typography,
  Backdrop,
  CircularProgress,
  Snackbar,

} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useSupabase } from "../supabase/supabase-provider";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { generateImagePath, handleImageUpload } from "@/helpers/image";
import {
  addNewGroceryStore,
  fetchAllGroceryStores,

} from "@/helpers/groceryStore";
import {
  AlertMsgType,
  AlertType,
  BucketType,
  ImageType,
  SnackBarPropsType,
} from "@/types";
import React, { Fragment } from "react";
import { useForm, Controller, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { mixed } from "yup";
import { useDialog } from "@/context/DialogContext";

export default function AddNewStore({ select_id }: { select_id: string }) {
  //Component State
  const [open, setOpen] = useState<boolean>(false);
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const [imagePath, setImagePath] = useState<string | null>(null);

  const [snackbar, setSnackbar] = useState<SnackBarPropsType>({
    msg: null,
    type: null,
    color: "",
  });

  // Hooks
  const { showNewStoreDialog, closeNewStoreDialog } = useDialog();
  const { supabase, session } = useSupabase();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const validationSchema = Yup.object().shape({
    storeName: Yup.string()
      .required("Store name is required")
      .matches(
        /^$|^[a-zA-Z0-9 _\-!\$]+$/i,
        "Please only use letters and numbers"
      ),
    file: mixed()
      .notRequired()
      .test("fileSize", "The file is too large", (value: any) => {
        if (value && value[0]) {
          const sizeInMega = value[0].size / 1048576;
          return sizeInMega < 50;
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
  });

  // Data
  async function fetchData() {
    await fetchAllGroceryStores(supabase);
  }

  // Handlers
  async function handleOpen() {
    setOpen(true);
  }

  async function handleClose() {
    reset({
      storeName: "",
    });
    closeNewStoreDialog();
    resetComponentState();
  }

  async function handleAlert() {
    setAlert(false);
  }

  async function handleSetImage(event: any) {
    setImage({ preview: "", raw: "" });
    setImagePath(null);
    const generatedPath = await generateImagePath(select_id, ImageType.Store);
    setImagePath(generatedPath);
    setImage({
      preview: URL.createObjectURL(event.target.files[0]),
      raw: event.target.files[0],
    });
  }

  // Helpers
  async function resetComponentState() {
    setImage({ preview: "", raw: "" });
    setImagePath(null);
    setOpen(false);
  }

  // Submit
  async function onSubmit(data: any) {
    try {
      setShowLoader(true);
      if (image.raw && imagePath) {
        await handleImageUpload(
          supabase,
          imagePath,
          image?.raw,
          BucketType.Store
        );
      }

      const newStore = await addNewGroceryStore(
        supabase,
        data.storeName,
        select_id,
        imagePath
      );

      if (newStore) {
        await fetchData();
        setSnackbar({
          msg: AlertMsgType.AddNewStoreSuccess,
          type: AlertType.Success,
          color: "green",
        });
      }
    } catch (error) {
      console.error(error);
      setSnackbar({
        msg: AlertMsgType.AddNewStoreFail,
        type: AlertType.Fail,
        color: "red",
      });
    } finally {
      setShowLoader(false);
      setAlert(true);
      handleClose();
    }
  }

  return (
    <>
      {alert ? (
        <>
          <Snackbar
            sx={{
              textAlign: "center",
            }}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={alert}
            ContentProps={{
              sx: {
                color: "white",
                backgroundColor: snackbar.color,
              },
            }}
            autoHideDuration={2000}
            onClose={handleAlert}
            message={snackbar.msg}
          />
        </>
      ) : null}

      <Dialog
        fullScreen={fullScreen}
        open={showNewStoreDialog}
        onClose={handleClose}
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={showLoader}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle align="center">Add new store</DialogTitle>
        <Box
          sx={{
            height: "50%",
          }}
        >
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              required
              error={errors.storeName ? true : false}
              margin="dense"
              id="storeName"
              label="Store name"
              type="search"
              variant="outlined"
              {...register("storeName")}
            />
            <Typography variant="inherit" color="red">
              {errors.storeName?.message}
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
            <>
              <Card sx={{ zIndex: 0, mb: 2.5, border: 1 }}>
                <CardMedia
                  sx={{ objectFit: "fill", zIndex: 0 }}
                  component="img"
                  height="250"
                  image={
                    image.preview ||
                    "https://filetandvine.com/wp-content/uploads/2015/07/pix-uploaded-placeholder.jpg"
                  }
                  alt={`Default  `}
                />
              </Card>

              <Button
                variant="outlined"
                component="label"
                startIcon={<AddPhotoAlternateIcon />}
                sx={{
                  color: "primary.dark",
                }}
              >
                Add Store Image?
                <input
                  {...register("file", {
                    onChange: handleSetImage,
                  })}
                  type="file"
                  name="file"
                  hidden
                />
              </Button>
              <Typography sx={{ mt: 1 }} variant="inherit" color="red">
                {errors?.file?.message}
              </Typography>
            </>
          </DialogContent>
        </Box>
        <DialogActions
          sx={{
            mt: 8,
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
