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
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useSupabase } from "../../supabase/supabase-provider";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import { GroceryDataStore } from "@/stores/GroceryDataStore";
import { GroceryStoreWithItemsType } from "@/types";
import {
  generateGroceryStoreImagePath,
  handleGroceryStoreImageUpload,
} from "@/helpers/image";
import { addNewGroceryStore } from "@/helpers/groceryStore";

export default function AddNewStore({ select_id }: { select_id: string }) {
  const { supabase, session } = useSupabase();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [newGroceryStoreName, setNewGroceryStoreName] = useState<string>("");
  const [imagePath, setImagePath] = useState<string | null>(null);

  async function validation() {
    if (newGroceryStoreName.trim() === "") {
      setIsInvalid(true);
      setErrorText("Please enter a name");
      return false;
    }

    // Check if the text is valid alphanumeric
    const regExp = /^[a-zA-Z0-9 _\-!\$]+$/i;
    if (!regExp.test(newGroceryStoreName)) {
      setErrorText("Please only use letters and number");
      setIsInvalid(true);
      console.log("%cValidation failed for Store Name", "color:red");
      return false;
    } else {
      setIsInvalid(false);
      console.log("%cValidation successful for Store Name", "color:green");
      return true;
    }
  }

  async function handleClickOpen() {
    setOpen(true);
  }

  async function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setNewGroceryStoreName(event.target.value);
    setErrorText(null);
    setIsInvalid(null);
  }

  async function handleClose(event: {}) {
    setImage({ preview: "", raw: "" });
    setImagePath(null);
    setOpen(false);
    setNewGroceryStoreName("");
    setErrorText(null);
    setIsInvalid(null);
  }

  async function handleSetImage(event: any) {
    const generatedImagePath = await generateGroceryStoreImagePath(select_id);

    if (event.target.files.length) {
      setImagePath(generatedImagePath);
      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }

  const addNewGroceryStoreToState = GroceryDataStore(
    (state) => state.addNewGroceryStore
  );

  const GroceryStoreData = GroceryDataStore((state) => state.data);

  async function handleSubmit() {
    const isValidResult = await validation();

    if (isValidResult) {
      if (image.raw && imagePath) {
        // TODO: error handling
        console.log(image.raw, "image properties");
        await handleGroceryStoreImageUpload(supabase, imagePath, image?.raw);
      }

      const newStore = await addNewGroceryStore(
        supabase,
        newGroceryStoreName,
        select_id,
        imagePath
      );

      const addedToState = GroceryStoreData.some(
        (groceryStore) => groceryStore.id === newStore?.id
      );

      if (!addedToState) {
        addNewGroceryStoreToState(newStore as GroceryStoreWithItemsType);
        console.log(
          `%cComponent: - Adding new store ${newStore?.name}`,
          "color: white; background-color: #007acc;",
          newStore
        );
      }

      setOpen(false);
      setNewGroceryStoreName("");
      setImage({ preview: "", raw: "" });
      setImagePath(null);
    }
  }

  return (
    <>
      <Button
        onClick={handleClickOpen}
        endIcon={<AddCircleIcon />}
        size="large"
        sx={{
          marginLeft: "auto",
        }}
      />
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
        <DialogTitle align="center">Add new Store</DialogTitle>
        <DialogContent>
          <TextField
            error={isInvalid || undefined}
            helperText={isInvalid && errorText}
            autoFocus
            margin="dense"
            id="Name"
            label="Name"
            type="search"
            fullWidth
            variant="standard"
            onChange={handleChange}
            value={newGroceryStoreName}
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
          <>
            <Card sx={{ mb: 2.5 }}>
              {image.preview ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={image.preview}
                  alt={`Image of `}
                />
              ) : (
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    "https://filetandvine.com/wp-content/uploads/2015/07/pix-uploaded-placeholder.jpg"
                  }
                  alt={`Image of `}
                />
              )}
            </Card>

            <Button
              variant="contained"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
            >
              Upload File
              <input type="file" onChange={handleSetImage} hidden />
            </Button>
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
