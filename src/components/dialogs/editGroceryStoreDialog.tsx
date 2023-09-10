import { useSupabase } from "@/components/supabase/supabase-provider";
import { useDialog } from "@/context/DialogContext";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  BucketType,
  GroceryStoreType,
  GroceryStoreWithItemsType,
  ImageType,
} from "@/types";
import { theme } from "@/helpers/theme";
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
} from "@mui/material";
import { useEffect, useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  getAllGroceryStoresData,
  updateGroceryStore,
} from "@/helpers/groceryStore";
import { generateImagePath, handleImageUpload } from "@/helpers/image";
import { useForm, Controller, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { mixed } from "yup";

export default function EditGroceryStoreDialog(groceryStore: GroceryStoreType) {
  //State
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [updatedImage, setUpdatedImage] = useState({
    preview: groceryStore?.image,
    raw: "",
  });

  //Hooks
  const { supabase, session } = useSupabase();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { openStoreSettingsDialog, handleStoreSettingsDialogClose } =
    useDialog();

  const validationSchema = Yup.object().shape({
    storeName: Yup.string()
      .required("Must have a store name")
      .matches(/^[a-zA-Z0-9 _\-!\$]+$/i, "Please only use letters and numbers"),
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
    defaultValues: {
      storeName: groceryStore.name,
    },
  });

  // Data
  async function fetchData() {
    await getAllGroceryStoresData(supabase);
  }

  // Handlers
  async function handleClose() {
    await setUpdatedImage({ preview: groceryStore.image, raw: "" });
    await reset({
      storeName: groceryStore.name,
    });
    await handleStoreSettingsDialogClose();
  }

  async function onSubmit(data: any) {
    try {
      if (updatedImage.raw && imagePath) {
        await handleImageUpload(
          supabase,
          imagePath,
          updatedImage?.raw,
          BucketType.Store
        );
      }
      const updatedStoreData = await updateGroceryStore(
        supabase,
        groceryStore.id,
        data.storeName,
        imagePath
      );

      if (updatedStoreData) {
        await fetchData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      await handleStoreSettingsDialogClose();
    }
  }

  //Helpers
  async function handleSetImage(event: any) {
    if (event.target.files.length && groceryStore?.select_id) {
      const generatedPath = await generateImagePath(
        groceryStore?.select_id,
        ImageType.Store
      );

      setImagePath(generatedPath);
      setUpdatedImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }

  // Effects
  useEffect(() => {
    reset({
      storeName: groceryStore.name,
    });
  }, [groceryStore.name, reset]);

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        id="grocery-store-settings-dialog"
        open={openStoreSettingsDialog}
        onClose={handleClose}
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={showLoader}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle align="center">{`${groceryStore.name} Settings`}</DialogTitle>
        <Box sx={{}}>
          <DialogContent>
            <TextField
              autoFocus
              error={errors.storeName ? true : false}
              margin="dense"
              id="storeName"
              label="Store Name"
              fullWidth
              variant="standard"
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
            <Card
              sx={{
                width: "100%",
              }}
            >
              {updatedImage.raw ? (
                <CardMedia
                  sx={{ objectFit: "fill" }}
                  component="img"
                  height="150"
                  image={updatedImage.preview || ""}
                  alt={`Preview`}
                />
              ) : (
                <CardMedia
                  sx={{ objectFit: "fill" }}
                  component="img"
                  height="150"
                  image={`${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${updatedImage.preview}`}
                  alt={`${groceryStore.name}`}
                />
              )}{" "}
            </Card>

            <Button
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
              sx={{
                mt: 4,
              }}
            >
              Change Image?
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
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
