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
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { errors } from "@playwright/test";
import image from "next/image";
import { theme } from "@/helpers/theme";
import { ProfileDataStore } from "@/stores/ProfileDataStore";
import {
  AlertMsgType,
  AlertType,
  BucketType,
  ImageType,
  SnackBarPropsType,
} from "@/types";
import { useState } from "react";
import { useSupabase } from "../supabase/supabase-provider";
import { generateImagePath, handleImageUpload } from "@/helpers/image";
import { addCommonItem } from "@/helpers/commonItem";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { mixed } from "yup";
import * as Yup from "yup";


export default function AddNewCategory() {
  const [open, setOpen] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackBarPropsType>({
    msg: null,
    type: null,
    color: "",
  });
  const [imagePath, setImagePath] = useState<string | null>(null);

  const [image, setImage] = useState({
    preview: "",
    raw: "",
  });

  // Hooks
  const { supabase, session } = useSupabase();
  const selectId = ProfileDataStore((state) => state?.data?.select_id);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const validationSchema = Yup.object().shape({
    categoryName: Yup.string()
      .required("Category name is required")
      .matches(
        /^[a-zA-Z0-9 _\-!\$\.\;\#\&\/\\]+$/i,
        "Please only use letters and numbers"
      ),
  });
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      categoryName: "",
    },
  });

  // Data
  async function fetchData() {
    //TODO:
    // await fetchAllCategories(supabase);
  }

  // Handlers
  function handleClickOpen(): void {
    setOpen(true);
  }

  async function handleAlert() {
    setAlert(false);
  }

  async function handleClose() {
    reset({
      categoryName: "",
    });
    setOpen(false);
    await resetComponentState();
  }

  async function resetComponentState() {
    setImagePath("");
    setImage({
      preview: "",
      raw: "",
    });
  }

  async function handleSetImage(event: any) {
    if (event.target.files.length && selectId) {
      const generatedPath = await generateImagePath(selectId, ImageType.Item);

      const sizeInMB = event.target.files[0].size / 1048576;
      console.log("Size of image", sizeInMB);

      if (sizeInMB > 50) {
        setImage({ preview: "", raw: "" });
        setImagePath(null);
      } else {
        setImagePath(generatedPath);
        setImage({
          preview: URL.createObjectURL(event.target.files[0]),
          raw: event.target.files[0],
        });
      }
    }
  }

  async function onSubmit(data: any) {
    // TODO: finish with new helpers for categories!
    try {
      setShowLoader(true);
      if (selectId) {
        if (image.raw && imagePath) {
          await handleImageUpload(
            supabase,
            imagePath,
            image?.raw,
            BucketType.Store
          );
        }

        const item = await addCommonItem(
          supabase,
          data.itemName,
          data.itemNotes,
          selectId,
          imagePath
        );

        if (item) {
          await fetchData();
          setSnackbar({
            msg: AlertMsgType.AddNewItemSuccess,
            type: AlertType.Success,
            color: "green",
          });
        }
      }
    } catch (error) {
      console.error(error);
      setSnackbar({
        msg: AlertMsgType.AddNewItemFail,
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
      <Button
        onClick={handleClickOpen}
        aria-label="Add New Common item"
        endIcon={<AddCircleIcon />}
        size="large"
      />

      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={showLoader}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle align="center">Add new category</DialogTitle>
        <Box sx={{}}>
          <DialogContent>
            <TextField
              autoFocus
              error={errors.categoryName ? true : false}
              margin="dense"
              id="Name"
              label="Category name"
              type="search"
              fullWidth
              variant="outlined"
              {...register("categoryName")}
            />
            <Typography variant="inherit" color="red">
              {errors.categoryName?.message}
            </Typography>
          </DialogContent>
        </Box>
        <DialogActions sx={{ mt: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
