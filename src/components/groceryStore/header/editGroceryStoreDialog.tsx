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
import { useEffect, useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  getAllGroceryStoresData,
  updateGroceryStore,
} from "@/helpers/groceryStore";
import {
  generateStoreItemImagePath,
  handleStoreImageUpload,
} from "@/helpers/image";

export default function EditGroceryStoreDialog(groceryStore: GroceryStoreType) {
  //State
  const [updatedName, setUpdatedName] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [updatedImage, setUpdatedImage] = useState({
    preview: groceryStore?.image,
    raw: "",
  });

  //Hooks
  const { supabase, session } = useSupabase();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [showImageError, setShowImageError] = useState<boolean | null>(null);
  const { openStoreSettingsDialog, handleStoreSettingsDialogClose } =
    useDialog();


    // Event Handlers
  async function handleClose() {
    resetComponentState();
    handleStoreSettingsDialogClose();
  }
  async function dismissError() {
    setUpdatedImage({ preview: groceryStore?.image, raw: "" });
    setImagePath(null);
    setShowImageError(null);
  }

  // Data
  async function fetchData() {
    console.log("fetching data");
    await getAllGroceryStoresData(supabase);
  }

  //Helpers
  async function resetComponentState() {
    setShowImageError(true);
    setImagePath(null);
    setUpdatedImage({ preview: groceryStore.image, raw: "" });
    setUpdatedName(groceryStore.name);
    setShowImageError(null);
  }

  async function handleImageSet(event: any) {
    if (event.target.files.length && groceryStore?.select_id) {
      setShowImageError(false);
      setUpdatedImage({ preview: groceryStore.image, raw: "" });
      setImagePath(null);

      const generatedImagePath = await generateStoreItemImagePath(
        groceryStore?.select_id
      );

      const sizeInMB = event.target.files[0].size / 1048576;
      console.log("Size of image", sizeInMB);

      if (sizeInMB > 10) {
        setShowImageError(true);
        setImagePath(null);
        setUpdatedImage({ preview: groceryStore.image, raw: "" });
      } else {
        setImagePath(generatedImagePath);
        setUpdatedImage({
          preview: URL.createObjectURL(event.target.files[0]),
          raw: event.target.files[0],
        });
      }
    }
  }

  async function handleUpdate() {
    if (updatedName) {
      if (updatedImage.raw && imagePath) {
        await handleStoreImageUpload(
          supabase,
          imagePath,
          updatedImage?.raw
        );
      }
      const updatedStoreData = await updateGroceryStore(
        supabase,
        groceryStore.id,
        updatedName,
        imagePath
      );

      if (updatedStoreData) {
        handleClose();
        fetchData();
      }
    }
  }

// Effects
  useEffect(() => {
    setUpdatedName(groceryStore.name);
    setUpdatedImage({ preview: groceryStore.image, raw: "" });
  }, [groceryStore.image, groceryStore.name]);

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        id="grocery-store-settings-dialog"
        open={openStoreSettingsDialog}
        onClose={handleClose}
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
              onChange={(e) => setUpdatedName(e.target.value)}
              value={updatedName}
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
                  image={`${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${updatedImage.preview}`}
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
              <input type="file" onChange={handleImageSet} hidden />
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
