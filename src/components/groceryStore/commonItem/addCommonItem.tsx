// Button to bring up a dialog to add a new common item

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
} from "@mui/material";
import image from "next/image";
import { useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  generateGroceryStoreItemImagePath,
  handleGroceryStoreItemImageUpload,
} from "@/helpers/image";
import { ProfileDataStore } from "@/stores/ProfileDataStore";
import { supabase } from "@supabase/auth-ui-shared";
import { addCommonItem, getAllCommonItems } from "@/helpers/commonItem";
import { Category } from "@mui/icons-material";
import { useSupabase } from "@/components/supabase/supabase-provider";

export default function AddCommonItem() {
  const { supabase, session } = useSupabase();
  const [newItemName, setNewItemName] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const selectId = ProfileDataStore((state) => state?.data?.select_id);
  const [image, setImage] = useState({
    preview: "",
    raw: "",
  });

  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  function handleClickOpen(): void {
    setOpen(true);
  }

  async function handleClose() {
    setOpen(false);
    setNewItemName("");
    setNotes("");
    setImagePath("");
    setImage({
      preview: "",
      raw: "",
    });
  }

  async function handleSetImage(event: any) {
    if (event.target.files.length && selectId) {
      const generatedImagePath = await generateGroceryStoreItemImagePath(
        selectId
      );
      setImagePath(generatedImagePath);
      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }

  async function getData() {
    await getAllCommonItems(supabase);
  }
  async function handleSubmit() {
    if (selectId) {
      if (image.raw && imagePath) {
        await handleGroceryStoreItemImageUpload(
          supabase,
          imagePath,
          image?.raw
        );
        // TODO: Add error handling and better logging
      }

      const item = await addCommonItem(
        supabase,
        newItemName,
        notes,
        selectId,
        imagePath
      );

      if (item) {
        getData();
      }
      handleClose();
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
        <DialogTitle align="center">Add Common Item</DialogTitle>
        <Box
        sx={{

        }}
        >

        
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
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
            >
              Upload File
              <input type="file" onChange={handleSetImage} hidden />
            </Button>
          </>
        </DialogContent>
        </Box>
        <DialogActions
        sx={{mt:2}}
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
