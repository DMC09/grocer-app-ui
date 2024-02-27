import { theme } from "@/helpers/theme";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Card,
  CardMedia,
  DialogActions,
  useMediaQuery,
  Box,
  Typography,
  Backdrop,
  CircularProgress,
  Snackbar,
  MenuItem,
} from "@mui/material";

import { useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { generateImagePath, handleImageUpload } from "@/helpers/image";
import { ProfileDataStore } from "@/stores/ProfileDataStore";
import { addCommonItem, fetchAllCommonItems } from "@/helpers/commonItem";
import { useSupabase } from "@/components/supabase/supabase-provider";
import {
  AlertMsgType,
  AlertType,
  BucketType,
  CategoryType,
  ImageType,
  SnackBarPropsType,
} from "@/types";

import { useForm, Controller, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { mixed } from "yup";
import useZustandStore from "@/hooks/useZustandStore";
import { CategoryDataStore } from "@/stores/categoryDataStore";

export default function AddCommonItem() {
  // Component State
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
  const [categoryIdToUse, setCategoryIdToUse] = useState<number | null>(null);

  // Hooks
  const { supabase, session } = useSupabase();
  const selectId = ProfileDataStore((state) => state?.data?.select_id);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const CategoryData = useZustandStore(
    CategoryDataStore,
    (state) => state?.categories
  );

  const validationSchema = Yup.object().shape({
    itemName: Yup.string()
      .required("Item name is required")
      .matches(
        /^[a-zA-Z0-9 _\-!\$\.\;\#\&\/\\]+$/i,
        "Please only use letters and numbers"
      ),
    itemNotes: Yup.string()
      .matches(
        /^[a-zA-Z0-9 _\-!\$\.\;\#\&\/\\]+$/i,
        "Please only use letters and numbers"
      )
      .notRequired(),
    itemCategory: Yup.number().nullable("Must use category iD"),
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
      itemCategory: 0,
    },
  });

  // Data
  async function fetchData() {
    await fetchAllCommonItems(supabase);
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
      itemName: "",
      itemNotes: " ",
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
          imagePath,
          categoryIdToUse
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

  async function handleSetCategory(e: any) {
    setCategoryIdToUse(e.target.value);
  }

  return (
    <>
      <Button
        onClick={handleClickOpen}
        aria-label="Add New Common item"
        endIcon={<AddCircleIcon />}
        size="large"
      />
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
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={showLoader}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle align="center">Add Common Item</DialogTitle>
        <Box sx={{}}>
          <DialogContent>
            <TextField
              autoFocus
              error={errors.itemName ? true : false}
              margin="dense"
              id="Name"
              label="Name"
              type="search"
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
              type="search"
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
              defaultValue={0}
              fullWidth
              select
              error={errors.itemCategory ? true : false}
              label="Category"
              {...register("itemCategory", { onChange: handleSetCategory })}
            >
              <MenuItem value={0} key={null}>
                --
              </MenuItem>
              {CategoryData?.map((category: CategoryType) => (
                <MenuItem value={category.id} key={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <Typography variant="inherit" color="red">
              {errors.itemCategory?.message}
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
              <Card sx={{ mb: 2.5, width: "100%" }}>
                <CardMedia
                  sx={{ objectFit: "fill" }}
                  component="img"
                  height="200"
                  image={
                    (image.raw && image.preview) ||
                    "https://filetandvine.com/wp-content/uploads/2015/07/pix-uploaded-placeholder.jpg"
                  }
                  alt={`Default  `}
                />
              </Card>

              <Button
                variant="outlined"
                component="label"
                startIcon={<AddPhotoAlternateIcon />}
              >
                Upload File
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
            </>
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
