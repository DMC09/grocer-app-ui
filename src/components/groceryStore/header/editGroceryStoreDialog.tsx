import { useSupabase } from "@/components/supabase/supabase-provider";
import { useDialog } from "@/context/DialogContext";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { GroceryStoreType, GroceryStoreWithItemsType } from "@/types";
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
} from "@mui/material";
import { useState } from "react";

import { GroceryDataStore } from "@/stores/GroceryDataStore";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  getAllGroceryStoresData,
  updateGroceryStore,
} from "@/helpers/groceryStore";
import {
  generateGroceryStoreItemImagePath,
  handleGroceryStoreImageUpload,
} from "@/helpers/image";

export default function EditGroceryStoreDialog(groceryStore: GroceryStoreType) {
  //state
  const [updatedGroceryStoreName, setUpdatedGroceryStoreName] =
    useState<string>(groceryStore.name);
  const [imagePath, setImagePath] = useState<string | null>(null);

  const [updatedImage, setUpdatedImage] = useState({
    preview: groceryStore?.image,
    raw: "",
  });

  const GroceryStoreData = GroceryDataStore((state) => state.data);

  //hooks
  const { supabase, session } = useSupabase();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [showImageError, setShowImageError] = useState<boolean | null>(null);
  const { openStoreSettingsDialog, handleStoreSettingsDialogClose } =
    useDialog();

  async function dismissError() {
    setUpdatedImage({ preview: "", raw: "" });
    setImagePath(null);
    setShowImageError(null);
  }

  //handlers
  async function handleImageUpdate(event: any) {
    if (event.target.files.length && groceryStore?.select_id) {
      const generatedImagePath = await generateGroceryStoreItemImagePath(
        groceryStore?.select_id
      );
      setImagePath(generatedImagePath);
      setUpdatedImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }

  async function fetchData() {
    await getAllGroceryStoresData(supabase);
  }

  async function handleUpdate() {
    if (updatedImage.raw && imagePath) {
      // TODO: error handling
      await handleGroceryStoreImageUpload(
        supabase,
        imagePath,
        updatedImage?.raw
      );
    }
    const updatedStoreData = await updateGroceryStore(
      supabase,
      groceryStore.id,
      updatedGroceryStoreName,
      imagePath
    );

    if (updatedStoreData) {
      fetchData();
    }

    handleStoreSettingsDialogClose();
  }

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        id="grocery-store-settings-dialog"
        open={openStoreSettingsDialog}
        onClose={handleStoreSettingsDialogClose}
      >
        <DialogTitle align="center">{`${groceryStore.name} Settings`}</DialogTitle>
        <Box sx={{}}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="Name"
              label="Name"
              fullWidth
              variant="standard"
              onChange={(e) => setUpdatedGroceryStoreName(e.target.value)}
              value={updatedGroceryStoreName}
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
            <Card
              sx={{
                width: "100%",
              }}
            >
              {updatedImage.raw ? (
                <CardMedia
                  component="img"
                  height="150"
                  image={updatedImage.preview || ""}
                  alt={`Image of `}
                />
              ) : (
                <CardMedia
                  component="img"
                  height="150"
                  image={`${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${updatedImage.preview}`} //maybe this should be normal image??
                  alt={`Image of `}
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
              <input type="file" onChange={handleImageUpdate} hidden />
            </Button>
            {showImageError && (
              <Box
                sx={{
                  border: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 1,
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
                <Typography color={"white"}>Image too large</Typography>
              </Box>
            )}
          </DialogContent>
        </Box>
        <DialogActions>
          <Button onClick={handleStoreSettingsDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
