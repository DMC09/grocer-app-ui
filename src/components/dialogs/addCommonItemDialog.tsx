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
  IconButton,
  Typography,
} from "@mui/material";
import image from "next/image";
import { useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { generateImagePath, handleImageUpload } from "@/helpers/image";
import { ProfileDataStore } from "@/stores/ProfileDataStore";
import { supabase } from "@supabase/auth-ui-shared";
import { addCommonItem, getAllCommonItems } from "@/helpers/commonItem";
import { Category } from "@mui/icons-material";
import { useSupabase } from "@/components/supabase/supabase-provider";
import { BucketType, ImageType } from "@/types";
import groceryStore from "../groceryStore/groceryStore";

export default function AddCommonItem() {
  // Component State

  const [newItemName, setNewItemName] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [showImageError, setShowImageError] = useState<boolean | null>(null);

  const [image, setImage] = useState({
    preview: "",
    raw: "",
  });

  // Hooks
  const { supabase, session } = useSupabase();
  const selectId = ProfileDataStore((state) => state?.data?.select_id);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  function handleClickOpen(): void {
    setOpen(true);
  }

  async function resetComponentState() {
    setNewItemName("");
    setShowImageError(null);
    setNotes("");
    setImagePath("");
    setImage({
      preview: "",
      raw: "",
    });
  }
  async function handleClose() {
    setOpen(false);
    resetComponentState();
  }

  async function handleSetImage(event: any) {
    if (event.target.files.length && selectId) {
      const generatedPath = await generateImagePath(selectId, ImageType.Item);

      const sizeInMB = event.target.files[0].size / 1048576;
      console.log("Size of image", sizeInMB);

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
  async function dismissError() {
    setImage({ preview: "", raw: "" });
    setImagePath(null);
    setShowImageError(null);
  }

  async function fetchData() {
    await getAllCommonItems(supabase);
  }
  async function handleSubmit() {
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
        newItemName,
        notes,
        selectId,
        imagePath
      );

      if (item) {
        fetchData();
      }
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
        sx={{
          marginLeft: "auto",
        }}
      />
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
        <DialogTitle align="center">Add Common Item</DialogTitle>
        <Box sx={{}}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="Name"
              label="Name"
              type="search"
              fullWidth
              variant="standard"
              onChange={(e) => setNewItemName(e.target.value)}
              value={newItemName}
            />
          </DialogContent>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="Notes"
              label="Notes"
              type="search"
              fullWidth
              variant="standard"
              onChange={(e) => setNotes(e.target.value)}
              value={notes}
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
        <DialogActions sx={{ mt: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
