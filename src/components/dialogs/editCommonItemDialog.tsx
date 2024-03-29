import { BucketType, CategoryType, CommonItemType, ImageType } from "@/types";
import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
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
  Typography,
  Backdrop,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useSupabase } from "@/components/supabase/supabase-provider";
import { ProfileDataStore } from "@/stores/ProfileDataStore";
import { fetchAllCommonItems, updateCommonItem } from "@/helpers/commonItem";
import { generateImagePath, handleImageUpload } from "@/helpers/image";
import { theme } from "@/helpers/theme";
import { useForm, Controller, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { mixed } from "yup";
import useZustandStore from "@/hooks/useZustandStore";
import { CategoryDataStore } from "@/stores/categoryDataStore";
export default function EditCommonItem(item: CommonItemType) {
  // component State
  const [open, setOpen] = useState(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [imagePath, setImagePath] = useState<string | null>(null);

  const [image, setImage] = useState({
    preview: item?.image,
    raw: "",
  });
  const [categoryIdToUse, setCategoryIdToUse] = useState<number | null>(
    item.category_id
  );

  // Hooks
  const { supabase, session } = useSupabase();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const selectId = ProfileDataStore((state) => state.data.select_id);
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
      itemName: item.item_name || "",
      itemNotes: item.item_notes,
      itemCategory: item.category_id || 0,
    },
  });

  // Data
  async function fetchData() {
    await fetchAllCommonItems(supabase);
  }

  function handleClickOpen() {
    setOpen(true);
  }

  async function handleClose() {
    reset({
      itemName: item.item_name || "",
      itemNotes: item.item_notes,
    });
    setOpen(false);
    resetComponentState();
  }

  async function resetComponentState() {
    setImagePath(null);
    setImage({ preview: item.image, raw: "" });
  }

  async function handleSetImage(event: any) {
    if (event.target.files.length && selectId) {
      setImage({ preview: item.image, raw: "" });
      setImagePath(null);

      const generatedPath = await generateImagePath(selectId, ImageType.Item);

      setImagePath(generatedPath);

      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }

  async function handleSetCategory(e: any) {
    setCategoryIdToUse(e.target.value);
  }

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
      const updatedCommonItem = await updateCommonItem(
        supabase,
        item.id,
        data.itemName,
        data.itemNotes,
        imagePath,
        categoryIdToUse
      );

      console.log(updatedCommonItem, "updated item");
      if (updatedCommonItem) {
        await fetchData();
      }
    } catch (error) {
    } finally {
      setShowLoader(false);
      await handleClose();
    }
  }

  return (
    <>
      <IconButton
        sx={{ color: "background.default" }}
        aria-label="Edit Common Item"
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
        <DialogTitle>{`Edit ${item.item_name}`}</DialogTitle>
        <Box>
          <DialogContent>
            <TextField
              autoFocus
              error={errors.itemName ? true : false}
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
              defaultValue={item?.category_id}
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
            <Card
              sx={{
                width: "100%",
              }}
            >
              <CardMedia
                sx={{ objectFit: "fill" }}
                component="img"
                height="200"
                image={
                  (image.raw && image.preview) ||
                  `${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${image.preview}`
                }
                alt={`Preview `}
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
              Upload File
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
