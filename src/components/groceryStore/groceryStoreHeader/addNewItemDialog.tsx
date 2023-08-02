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
import { theme } from "@/utils/theme";
import { useState } from "react";
import {
  generateGroceryStoreItemImagePath,
  handleGroceryStoreImageUpload,
} from "@/utils/client/image";
import groceryStore from "../groceryStore";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useDialogContext } from "@/context/DialogContext";
import { addNewGroceryStoreItem } from "@/utils/client/groceryStore";
import { supabase } from "@supabase/auth-ui-shared";
import { useSupabase } from "@/components/supabase/supabase-provider";
import { GroceryStoreType } from "@/types";

export default function AddNewItemDialog(groceryStore: GroceryStoreType) {
  const [newItemName, setNewItemName] = useState<string>();
  const [notes, setNotes] = useState("");
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState({
    preview: "",
    raw: "",
  });

  const { openAddNewItemDialog, handleAddNewItemDialogClose } =
    useDialogContext();
  const { supabase, session } = useSupabase();

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

  async function handleSubmitNewItem() {
    if (groceryStore.select_id && newItemName) {
      if (image.raw && imagePath) {
        await handleGroceryStoreImageUpload(supabase, imagePath, image?.raw);
        await addNewGroceryStoreItem(
          supabase,
          groceryStore.id,
          newItemName,
          notes,
          Number(quantity),
          groceryStore.select_id,
          imagePath
        );
      } else {
        await addNewGroceryStoreItem(
          supabase,
          groceryStore.id,
          newItemName,
          notes,
          Number(quantity),
          groceryStore.select_id
        );
      }

      //   add error handling!
      setNewItemName("");
      handleAddNewItemDialogClose();
      setNotes("");
      setQuantity("");
      setImage({ preview: "", raw: "" });
    }
  }

  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog fullScreen={fullScreen} open={openAddNewItemDialog}>
      <DialogTitle align="center">Add new item</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="Name"
          label="Name"
          type="email"
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
          type="email"
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
          type="number"
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
        <Button onClick={handleSubmitNewItem}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
