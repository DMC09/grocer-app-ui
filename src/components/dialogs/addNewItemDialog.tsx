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
import { theme } from "@/helpers/theme";
import { useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useDialog } from "@/context/DialogContext";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useSupabase } from "@/components/supabase/supabase-provider";
import { GroceryStoreItemType, GroceryStoreType } from "@/types";
import {
  GroceryDataStore,
  findGroceryStoreIndex,
} from "@/stores/GroceryDataStore";
import {
  generateStoreItemImagePath,
  handleStoreImageUpload,
} from "@/helpers/image";
import { addNewGroceryStoreItem } from "@/helpers/groceryStoreItem";
import { getAllGroceryStoresData } from "@/helpers/groceryStore";

export default function AddNewItemDialog(groceryStore: GroceryStoreType) {
  //Component State
  const [itemName, setItemName] = useState<string>();
  const [notes, setNotes] = useState("");
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState({
    preview: "",
    raw: "",
  });
  const [showImageError, setShowImageError] = useState<boolean | null>(null);

  // hooks
  const { supabase, session } = useSupabase();
  const { openAddNewItemDialog, handleAddNewItemDialogClose } = useDialog();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Data
  async function fetchData() {
    await getAllGroceryStoresData(supabase);
  }

  //handlers
  async function resetComponentState() {
    setImage({ preview: "", raw: "" });
    setImagePath(null);
    setQuantity("");
    setNotes("");
    setItemName("");
    setShowImageError(null);
  }

  function handleClose() {
    handleAddNewItemDialogClose();
    resetComponentState();
  }

  async function dismissError() {
    setImage({ preview: "", raw: "" });
    setImagePath(null);
    setShowImageError(null);
  }

  async function handleSetImage(event: any) {
    if (event.target.files.length && groceryStore?.select_id) {
      const generatedImagePath = await generateStoreItemImagePath(
        groceryStore?.select_id
      );

      setShowImageError(false);
      setImage({ preview: "", raw: "" });
      setImagePath(null);

      const sizeInMB = event.target.files[0].size / 1048576;
      console.log("Size of image", sizeInMB);

      if (sizeInMB > 50) {
        setShowImageError(true);
        setImage({ preview: "", raw: "" });
        setImagePath(null);
      } else {
        setImagePath(generatedImagePath);
        setImage({
          preview: URL.createObjectURL(event.target.files[0]),
          raw: event.target.files[0],
        });
      }
    }
  }

  async function handleAddNewItem() {
    if (groceryStore.select_id && itemName) {
      if (image.raw && imagePath) {
        // TODO: error handling
        await handleStoreImageUpload(supabase, imagePath, image?.raw);
      }
      const newItem = await addNewGroceryStoreItem(
        supabase,
        groceryStore.id,
        itemName,
        notes,
        Number(quantity),
        groceryStore.select_id,
        imagePath
      );

      if (newItem) {
        fetchData();
      }
      handleClose();
    }
  }

  return (
    <Dialog fullScreen={fullScreen} open={openAddNewItemDialog}>
      <DialogTitle align="center">Add New Item</DialogTitle>
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
            onChange={(e) => setItemName(e.target.value)}
            value={itemName}
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
          <TextField
            fullWidth
            type="tel"
            id="outlined-basic"
            label="Quantity"
            variant="outlined"
            onChange={(e) => setQuantity(e.target.value)}
            value={quantity}
          />
          <Card
            sx={{
              mt: 4,
              width: "100%",
            }}
          >
            {image.preview ? (
              <CardMedia
                component="img"
                height="200"
                image={image.preview}
                alt={`Preview  `}
              />
            ) : (
              <CardMedia
                component="img"
                height="200"
                image={
                  "https://filetandvine.com/wp-content/uploads/2015/07/pix-uploaded-placeholder.jpg"
                }
                alt={`Default `}
              />
            )}
          </Card>

          <Button
            variant="outlined"
            component="label"
            startIcon={<AddPhotoAlternateIcon />}
            sx={{
              color: "primary.dark",
              mt: 4,
            }}
          >
            Add Item Image?
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
                aria-label="Dismiss Image Error"
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
        </DialogContent>
      </Box>
      <DialogActions
        sx={{
          mt: 4,
        }}
      >
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAddNewItem}>
          Submit
        </Button>
      </DialogActions>{" "}
    </Dialog>
  );
}
