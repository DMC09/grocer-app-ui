import { theme } from "@/helpers/theme";
import { ProfileDataStore } from "@/stores/ProfileDataStore";
import { yupResolver } from "@hookform/resolvers/yup";
import EditIcon from "@mui/icons-material/Edit";
import {
  useMediaQuery,
  Dialog,
  Backdrop,
  CircularProgress,
  DialogTitle,
  Box,
  DialogContent,
  TextField,
  Typography,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import item from "../groceryStore/groceryStoreItem/item";
import { useSupabase } from "../supabase/supabase-provider";
import * as Yup from "yup";
import { mixed } from "yup";
import { CategoryType } from "@/types";
import { fetchAllCategories, updateCategory } from "@/helpers/category";

export default function EditCategory(category: CategoryType) {
  const [open, setOpen] = useState(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  // Hooks
  const { supabase, session } = useSupabase();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const selectId = ProfileDataStore((state) => state?.data?.select_id);

  function handleClickOpen() {
    setOpen(true);
  }

  // Data
  async function fetchData() {
    await fetchAllCategories(supabase);
  }

  async function onSubmit(data: any) {
    if (selectId) {
      try {
        setShowLoader(true);
        const updatedCategory = await updateCategory(
          supabase,
          category.id,
          data.categoryName,
          selectId
        );

        console.log(updatedCategory, "updated category");
        if (updatedCategory) {
          await fetchData();
        }
      } catch (error) {
      } finally {
        setShowLoader(false);
        //   await handleClose();
        await setOpen(false);
      }
    } else {
      throw new Error("No SelectId ");
    }
  }

  async function handleClose() {
    reset({
      categoryName: category.name || "",
    });

    await setOpen(false);
  }

  const validationSchema = Yup.object().shape({
    categoryName: Yup.string()
      .required("Item name is required")
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
      categoryName: category.name || "",
    },
  });

  return (
    <>
      <IconButton
        sx={{
          borderRadius: 0,
          width: "50%",
          color: "background.default",
          backgroundColor: "#FFC000",
          borderColor: "black",
        }}
        aria-label={`Edit ${category.name} category`}
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
        <DialogTitle>{`Edit ${category.name}`}</DialogTitle>
        <Box>
          <DialogContent>
            <TextField
              autoFocus
              error={errors.categoryName ? true : false}
              margin="dense"
              id="Name"
              label="Name"
              fullWidth
              variant="outlined"
              {...register("categoryName")}
            />
            <Typography variant="inherit" color="red">
              {errors.categoryName?.message}
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
