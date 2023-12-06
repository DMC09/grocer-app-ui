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
import { useEffect, useState } from "react";
import { useSupabase } from "../../supabase/supabase-provider";
import { BucketType, GroceryStoreItemType, ImageType } from "@/types";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { generateImagePath, handleImageUpload } from "@/helpers/image";
import { updateGroceryStoreItem } from "@/helpers/ItemUtils";
import { fetchAllGroceryStores, fetchAllItems, getAllGroceryStoresData } from "@/helpers/groceryStore";
import { useForm, Controller, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { mixed } from "yup";
import { theme } from "@/helpers/theme";

export default function EditItem(groceryStoreItem: GroceryStoreItemType) {
  // Component State
  const [open, setOpen] = useState(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [image, setImage] = useState({
    preview: groceryStoreItem?.image,
    raw: "",
  });

  // Hooks
  const { supabase, session } = useSupabase();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleClickOpen = () => {
    setOpen(true);
  };

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
      itemName: groceryStoreItem.name,
      itemNotes: groceryStoreItem.notes,
      itemQuantity: groceryStoreItem.quantity,
    },
  });

  // Data
  async function fetchData() {
    await fetchAllGroceryStores(supabase);
    await fetchAllItems(supabase);

  }

  async function resetComponentState() {
    setImagePath(null);
    setImage({
      preview: groceryStoreItem.image,
      raw: "",
    });
  }

  async function handleClose() {
    reset({
      itemName: groceryStoreItem.name,
      itemNotes: groceryStoreItem.notes,
      itemQuantity: Number(groceryStoreItem?.quantity),
    });
    setOpen(false);
    await resetComponentState();
  }

  async function handleSetImage(event: any) {
    setImagePath(null);
    setImage({ preview: groceryStoreItem.image, raw: "" });
    if (event.target.files.length && groceryStoreItem?.select_id) {
      const generatedPath = await generateImagePath(
        groceryStoreItem?.select_id,
        ImageType.Item
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
      setShowLoader(true)
      const now = new Date().toISOString();
      if (image.raw && imagePath) {
        await handleImageUpload(
          supabase,
          imagePath,
          image?.raw,
          BucketType.Store
        );
      }
      const updatedItem = await updateGroceryStoreItem(
        supabase,
        groceryStoreItem.id,
        data.itemName,
        data.itemNotes,
        data.itemQuantity,
        now,
        imagePath
      );

      if (updatedItem) {
        await fetchData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      await handleClose();
      setShowLoader(false)
    }
  }

  // Effects
  useEffect(() => {
    reset({
      itemName: groceryStoreItem.name,
      itemNotes: groceryStoreItem.notes,
      itemQuantity: Number(groceryStoreItem?.quantity),
    });
  }, [
    groceryStoreItem.name,
    groceryStoreItem.notes,
    groceryStoreItem?.quantity,
    reset,
  ]);

  return (
    <>
      <IconButton
        sx={{ color: "background.default" }}
        aria-label="Edit Item"
        onClick={handleClickOpen}
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
        <DialogTitle>{`Edit ${groceryStoreItem?.name}`}</DialogTitle>
        <Box sx={{}}>
          <DialogContent>
            <TextField
              error={errors.itemName ? true : false}
              autoFocus
              margin="dense"
              id="Name"
              label="Name"
              fullWidth
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
              type="email"
              fullWidth
              variant="outlined"
              {...register("itemNotes")}
            />
            <Typography variant="inherit" color="red">
              {errors.itemNotes?.message}
            </Typography>
          </DialogContent>
          <DialogContent>
            <TextField
              type="tel"
              fullWidth
              error={errors.itemQuantity ? true : false}
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              {...register("itemQuantity")}
            />
            <Typography variant="inherit" color="red">
              {errors.itemQuantity?.message}
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
            <Card sx={{ width: "100%" }}>
              <CardMedia
                sx={{ objectFit: "fill" }}
                component="img"
                height="200"
                image={
                  (image.raw && image.preview) ||
                  `${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${groceryStoreItem.image}`
                }
                alt={`Default`}
              />
            </Card>
            <Button
              sx={{ mt: 2 }}
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
            >
              Add Image?
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
