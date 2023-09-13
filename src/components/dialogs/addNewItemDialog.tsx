import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Card,
  CardMedia,
  Button,
  DialogActions,
  useMediaQuery,
  Box,
  IconButton,
  Typography,
  Backdrop,
  CircularProgress,
  Slide,
  Snackbar,
} from "@mui/material";
import { theme } from "@/helpers/theme";
import { useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useDialog } from "@/context/DialogContext";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useSupabase } from "@/components/supabase/supabase-provider";
import {
  AlertMsgType,
  AlertType,
  BucketType,
  GroceryStoreType,
  ImageType,
  SnackBarPropsType,
} from "@/types";

import { generateImagePath, handleImageUpload } from "@/helpers/image";
import { addNewGroceryStoreItem } from "@/helpers/groceryStoreItem";
import { getAllGroceryStoresData } from "@/helpers/groceryStore";
import { useForm, Controller, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { mixed } from "yup";

export default function AddNewItemDialog(groceryStore: GroceryStoreType) {
  //Component State
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackBarPropsType>({
    msg: null,
    type: null,
    color: "",
  });
  const [image, setImage] = useState({
    preview: "",
    raw: "",
  });

  const validationSchema = Yup.object().shape({
    itemName: Yup.string()
      .required("Item name is required")
      .matches(/^[a-zA-Z0-9 _\-!\$]+$/i, "Please only use letters and numbers"),
    itemNotes: Yup.string()
      .matches(/^[a-zA-Z0-9 _\-!\$]+$/i, "Please only use letters and numbers")
      .notRequired(),
    itemQuantity: Yup.number()
      .required("Quantity is required")
      .min(1, "must have at least 1 "),
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
      itemName: "",
      itemNotes: " ",
      itemQuantity: 1,
    },
  });

  // hooks
  const { supabase, session } = useSupabase();
  const { openAddNewItemDialog, handleAddNewItemDialogClose } = useDialog();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Data
  async function fetchData() {
    await getAllGroceryStoresData(supabase);
  }

  //Handlers
  async function handleAlert() {
    setAlert(false);
  }

  async function handleClose() {
    reset({
      itemName: "",
      itemNotes: " ",
      itemQuantity: 1,
    });

    handleAddNewItemDialogClose();
    resetComponentState();
  }

  async function handleSetImage(event: any) {
    if (event.target.files.length && groceryStore?.select_id) {
      const generatedPath = await generateImagePath(
        groceryStore?.select_id,
        ImageType.Item
      );

      setImage({ preview: "", raw: "" });
      setImagePath(null);

      setImagePath(generatedPath);
      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });

      const sizeInMB = event.target.files[0].size / 1048576;
      console.log("Size of image", sizeInMB);
    }
  }

  async function onSubmit(data: any, selectId: string) {
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
      const newItem = await addNewGroceryStoreItem(
        supabase,
        groceryStore.id,
        data.itemName,
        data.itemNotes.trim(),
        Number(data.itemQuantity),
        selectId,
        imagePath
      );

      if (newItem) {
        fetchData();
        setSnackbar({
          msg: AlertMsgType.AddNewItemSuccess,
          type: AlertType.Success,
          color: "green",
        });
      }
    } catch (error) {
      console.error(error);
      setSnackbar({
        msg: AlertMsgType.AddNewItemFail,
        type: AlertType.Fail,
        color: "red",
      });
    } finally {
      await handleClose();
      setShowLoader(false);
      setAlert(true);
    }
  }

  // Helpers
  async function resetComponentState() {
    setImage({ preview: "", raw: "" });
    setImagePath(null);
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
      <Dialog fullScreen={fullScreen} open={openAddNewItemDialog}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={showLoader}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle align="center">Add New Item</DialogTitle>
        <Box sx={{}}>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              required
              error={errors.itemName ? true : false}
              margin="dense"
              id="itemName"
              label="Name"
              type="search"
              variant="outlined"
              {...register("itemName")}
            />
            <Typography variant="inherit" color="red">
              {errors.itemName?.message}
            </Typography>
          </DialogContent>
          <DialogContent>
            <TextField
              error={errors.itemNotes ? true : false}
              margin="dense"
              id="Notes"
              label="Notes"
              type="search"
              fullWidth
              variant="outlined"
              {...register("itemNotes")}
            />
            <Typography variant="inherit" color="red">
              {errors.itemNotes?.message}
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
            <TextField
              fullWidth
              error={errors.itemQuantity ? true : false}
              type="tel"
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              {...register("itemQuantity")}
            />
            <Typography variant="inherit" color="red">
              {errors.itemQuantity?.message}
            </Typography>
            <Card
              sx={{
                mt: 4,
                width: "100%",
              }}
            >
              <CardMedia
                sx={{ objectFit: "fill" }}
                component="img"
                height="200"
                image={
                  image.preview ||
                  "https://filetandvine.com/wp-content/uploads/2015/07/pix-uploaded-placeholder.jpg"
                }
                alt={`Preview  `}
              />
            </Card>

            <Button
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
              sx={{
                color: "primary.dark",
                mt: 4,
              }}
            >
              Add Item Image?
              <input
                type="file"
                {...register("file", {
                  onChange: handleSetImage,
                })}
                hidden
              />
            </Button>
            <Typography sx={{ mt: 1 }} variant="inherit" color="red">
              {errors?.file?.message}
            </Typography>
          </DialogContent>
        </Box>
        <DialogActions
          sx={{
            mt: 4,
          }}
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit((d) => onSubmit(d, groceryStore?.select_id))}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
