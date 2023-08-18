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
} from "@mui/material";
import { theme } from "@/helpers/theme";
import { useState } from "react";

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useDialog } from "@/context/DialogContext";

import { useSupabase } from "@/components/supabase/supabase-provider";
import { GroceryStoreItemType, GroceryStoreType } from "@/types";
import {
  GroceryDataStore,
  findGroceryStoreIndex,
} from "@/stores/GroceryDataStore";
import {
  generateGroceryStoreItemImagePath,
  handleGroceryStoreImageUpload,
} from "@/helpers/image";
import { addNewGroceryStoreItem } from "@/helpers/groceryStoreItem";
import { getAllGroceryStoresData } from "@/helpers/groceryStore";

export default function AddNewItemDialog(groceryStore: GroceryStoreType) {
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  //Component State
  const [newItemName, setNewItemName] = useState<string>();
  const [notes, setNotes] = useState("");
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState({
    preview: "",
    raw: "",
  });

  // Zustand
  const GroceryStoreData = GroceryDataStore((state) => state.data);
  const addItemToState = GroceryDataStore((state) => state.insertGroceryItem);

  // hooks
  const { supabase, session } = useSupabase();
  const { openAddNewItemDialog, handleAddNewItemDialogClose } = useDialog();

  //handlers
  async function resetComponentState() {
    setNewItemName("");
    handleAddNewItemDialogClose();
    setNotes("");
    setQuantity("");
    setImage({ preview: "", raw: "" });
  }

  async function fetchData() {
    await getAllGroceryStoresData(supabase);
  }

  async function handleSetImage(event: any) {
    if (event.target.files.length && groceryStore?.select_id) {
      const generatedImagePath = await generateGroceryStoreItemImagePath(
        groceryStore?.select_id
      );
      setImagePath(generatedImagePath);
      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }

  async function handleAddNewItem() {
    if (groceryStore.select_id && newItemName) {
      if (image.raw && imagePath) {
        // TODO: error handling
        await handleGroceryStoreImageUpload(supabase, imagePath, image?.raw);
      }
      const newItem = await addNewGroceryStoreItem(
        supabase,
        groceryStore.id,
        newItemName,
        notes,
        Number(quantity),
        groceryStore.select_id,
        imagePath
      );

      if (newItem) {
        fetchData();
      }
      resetComponentState();
    }
  }

  return (
    <Dialog fullScreen={fullScreen} open={openAddNewItemDialog}>
      <DialogTitle align="center">Add new item</DialogTitle>
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
            maxWidth: 150,
            mt: 4,
          }}
        >
          {image.preview ? (
            <CardMedia
              component="img"
              height="150"
              image={image.preview}
              alt={`Image of `}
            />
          ) : (
            <CardMedia
              component="img"
              height="150"
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddNewItemDialogClose}>Cancel</Button>
        <Button onClick={handleAddNewItem}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
