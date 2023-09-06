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
  IconButton,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useSupabase } from "../../supabase/supabase-provider";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { generateImagePath, handleImageUpload } from "@/helpers/image";
import {
  addNewGroceryStore,
  getAllGroceryStoresData,
} from "@/helpers/groceryStore";
import { BucketType, ImageType } from "@/types";

export default function AddNewStore({ select_id }: { select_id: string }) {
  //Component State
  const [open, setOpen] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [name, setName] = useState<string>("");
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [showImageError, setShowImageError] = useState<boolean | null>(null);

  // Hooks
  const { supabase, session } = useSupabase();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Event Handlers
  async function handleOpen() {
    setOpen(true);
  }

  async function handleClose() {
    resetComponentState();
  }

  // Validation
  async function validation() {
    if (name.trim() === "") {
      setIsInvalid(true);
      setErrorText("Please enter a name");
      return false;
    }

    // Check if the text is valid alphanumeric
    const regExp = /^[a-zA-Z0-9 _\-!\$]+$/i;

    if (!regExp.test(name)) {
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

  // Data
  async function fetchData() {
    await getAllGroceryStoresData(supabase);
  }

  // helpers
  async function resetComponentState() {
    setImage({ preview: "", raw: "" });
    setImagePath(null);
    setOpen(false);
    setName("");
    setErrorText(null);
    setIsInvalid(null);
    setShowImageError(null);
  }

  async function dismissError() {
    setImage({ preview: "", raw: "" });
    setImagePath(null);
    setShowImageError(null);
  }

  async function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setName(event.target.value);
    setErrorText(null);
    setIsInvalid(null);
  }

  async function handleSetImage(event: any) {
    setShowImageError(false);
    setImage({ preview: "", raw: "" });
    setImagePath(null);

    const generatedPath = await generateImagePath(select_id, ImageType.Store);

    if (event.target.files.length) {
      const sizeInMB = event.target.files[0].size / 1048576;
      console.log(`Image Size:${sizeInMB}`);

      if (sizeInMB > 50) {
        setShowImageError(true);
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

  async function handleSubmit() {
    const isValidResult = await validation();

    if (isValidResult) {
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
        name,
        select_id,
        imagePath
      );

      if (newStore) {
        fetchData();
      }

      resetComponentState();
    }
  }

  return (
    <>
      <Button
        aria-label="Add New Store"
        onClick={handleOpen}
        endIcon={<AddCircleIcon />}
        size="large"
        sx={{
          marginLeft: "auto",
        }}
      />
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
        <DialogTitle align="center">Add New Store</DialogTitle>
        <Box
          sx={{
            height: "50%",
          }}
        >
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
              value={name}
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
                    sx={{ objectFit: "fill" }}
                    component="img"
                    height="200"
                    image={image.preview}
                    alt={`Preview  `}
                  />
                ) : (
                  <CardMedia
                    sx={{ objectFit: "fill" }}
                    component="img"
                    height="200"
                    image={
                      "https://filetandvine.com/wp-content/uploads/2015/07/pix-uploaded-placeholder.jpg"
                    }
                    alt={`Default  `}
                  />
                )}
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
                <input type="file" onChange={handleSetImage} hidden />
              </Button>
              {showImageError && (
                <Box
                  sx={{
                    border: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 2,
                    p: 0.5,
                    backgroundColor: "red",
                    borderRadius: 5,
                  }}
                >
                  <IconButton
                    onClick={async () => await dismissError()}
                    aria-label="delete"
                    sx={{
                      color: "white",
                    }}
                  >
                    <HighlightOffIcon />
                  </IconButton>
                  <Typography sx={{ pr: 1 }} color={"white"}>
                    Image too large
                  </Typography>
                </Box>
              )}
            </>
          </DialogContent>
        </Box>
        <DialogActions
          sx={{
            mt: 8,
          }}
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
