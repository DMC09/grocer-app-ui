import {
  Box,
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { useSupabase } from "../../supabase/supabase-provider";
import { GroceryStoreItemType } from "@/types";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  GroceryDataStore,
  findGroceryStoreIndex,
  getGroceryStoreItemIndex,
} from "@/stores/GroceryDataStore";
import {
  generateStoreItemImagePath,
  handleStoreItemImageUpload,
} from "@/helpers/image";
import { updateGroceryStoreItem } from "@/helpers/groceryStoreItem";
import { getAllGroceryStoresData } from "@/helpers/groceryStore";
import { theme } from "@/helpers/theme";

export default function EditItem(groceryStoreItem: GroceryStoreItemType) {
  // Component State
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [showImageError, setShowImageError] = useState<boolean | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [image, setImage] = useState({
    preview: groceryStoreItem?.image,
    raw: "",
  });

  // Hooks
  const { supabase, session } = useSupabase();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Data
  async function fetchData() {
    await getAllGroceryStoresData(supabase);
  }

  // Event Handlers
  async function dismissError() {
    setImage({ preview: groceryStoreItem?.image, raw: "" });
    setImagePath(null);
    setShowImageError(null);
  }

  async function resetComponentState() {
    setName(groceryStoreItem?.name);
    setNotes(groceryStoreItem?.notes);
    setQuantity(groceryStoreItem?.quantity);
    setImagePath(null);
    setImage({
      preview: groceryStoreItem.image,
      raw: "",
    });
  }

  function handleClose() {
    setOpen(false);
    resetComponentState();
  }

  async function handleImageSet(event: any) {
    if (event.target.files.length && groceryStoreItem?.select_id) {
      setShowImageError(false);
      setImage({ preview: groceryStoreItem.image, raw: "" });
      setImagePath(null);

      const sizeInMB = event.target.files[0].size / 1048576;

      const generatedImagePath = await generateStoreItemImagePath(
        groceryStoreItem?.select_id
      );

      if (sizeInMB > 50) {
        setShowImageError(true);
        setImagePath(null);
        setImage({ preview: groceryStoreItem.image, raw: "" });
      } else {
        setImagePath(generatedImagePath);
        setImage({
          preview: URL.createObjectURL(event.target.files[0]),
          raw: event.target.files[0],
        });
      }
    }
  }

  async function handleEdit() {
    if (name && quantity) {
      const now = new Date().toISOString();
      if (image.raw && imagePath) {
        await handleStoreItemImageUpload(supabase, imagePath, image?.raw);
      }
      const updatedItem = await updateGroceryStoreItem(
        supabase,
        groceryStoreItem.id,
        name,
        notes,
        quantity,
        now,
        imagePath
      );

      if (updatedItem) {
        fetchData();
      }

      handleClose();
    }
  }

  useEffect(() => {
    setName(groceryStoreItem.name);
    setNotes(groceryStoreItem.notes);
    setQuantity(groceryStoreItem.quantity);
    setImage({
      preview: groceryStoreItem.image,
      raw: "",
    });
  }, [
    groceryStoreItem.image,
    groceryStoreItem.name,
    groceryStoreItem.notes,
    groceryStoreItem.quantity,
  ]);

  return (
    <>
      <IconButton
        sx={{ color: "background.default" }}
        aria-label="Edit Item"
        onClick={handleClickOpen}
      >
        <EditIcon sx={{ fontSize: 25 }} />
      </IconButton>

      <Dialog open={open} fullScreen={fullScreen} onClose={handleClose}>
        <DialogTitle>{`Edit ${groceryStoreItem?.name}`}</DialogTitle>
        <Box sx={{}}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="Name"
              label="Name"
              fullWidth
              variant="standard"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </DialogContent>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="Notes"
              label="Notes"
              type="email"
              fullWidth
              variant="standard"
              onChange={(e) => setNotes(e.target.value)}
              value={notes}
            />
          </DialogContent>
          <DialogContent>
            <TextField
              type="tel"
              fullWidth
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              onChange={(e) => setQuantity(Number(e.target.value))}
              value={quantity}
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
            {image.raw ? (
              <Card
                sx={{
                  width: "100%",
                }}
              >
                <CardMedia
                sx={{objectFit: "fill",}}
                  component="img"
                  height="200"
                  image={image.preview || ""}
                  alt={`Preview`}
                />
              </Card>
            ) : (
              <Card sx={{ width: "100%" }}>
                <CardMedia
                sx={{objectFit: "fill",}}
                  component="img"
                  height="200"
                  image={`${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${image.preview}`}
                  alt={`Default`}
                />
              </Card>
            )}
            <Button
              sx={{ mt: 2 }}
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
            >
              Add Image?
              <input type="file" onChange={handleImageSet} hidden />
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
          </DialogContent>
        </Box>
        <DialogActions
          sx={{
            mt: 2,
          }}
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleEdit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
