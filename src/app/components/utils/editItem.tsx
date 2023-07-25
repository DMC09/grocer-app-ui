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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { useSupabase } from "../supabase/supabase-provider";
import { GroceryStoreItemType } from "@/types";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function EditItem(groceryStoreItem: GroceryStoreItemType) {
  const { supabase,session } = useSupabase();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState<string | null>(groceryStoreItem.name);
  const [notes, setNotes] = useState<string | null>(groceryStoreItem.notes);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [image, setImage] = useState({
    preview: groceryStoreItem?.image,
    raw: "",
  });
  const [quantity, setQuantity] = useState<number | null>(
    groceryStoreItem.quantity
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  async function handleImageUpload() {
    if (image.raw && imagePath) {
      console.log(imagePath, "imagePath");
      const { data, error } = await supabase.storage
        .from("grocerystore")
        // Need a custom path thing for this.
        // Also need to getthe public url
        .upload(imagePath, image.raw);
      if (error) {
        throw new Error(`Error uploading image ${error.message}`);
      } else {
        console.log(data, "image uploaded successfully");
      }
    }
  }

  async function generateImagePath(select_id: string) {
    //Formula is last 16 characters of select_id + Current DateTime in seconds/
    const lastPartOfSelectId = select_id?.slice(-16);
    const currentTimeStamp = new Date().getTime();

    setImagePath(
      `grocerystore_images/${lastPartOfSelectId}/${currentTimeStamp}`
    );
  }

  const handleClose = () => {
    setOpen(false);
    setName(groceryStoreItem.name);
    setNotes(groceryStoreItem.notes);
    setQuantity(groceryStoreItem.quantity);
  };

  async function handleImageSet(event: any) {
    if (event.target.files.length && groceryStoreItem?.select_id) {
      generateImagePath(groceryStoreItem?.select_id);
      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }

  async function handleEdit() {
    // do the update on this one I guess

    const now = new Date().toISOString();
    if (image.raw) {
      await handleImageUpload();
      const { data, error } = await supabase
        .from("grocerystoreitems")
        .update(
          {
            name,
            notes,
            quantity: Number(quantity),
            modified_at: now,
            image: imagePath,
          },
        )
        .eq("id", groceryStoreItem.id)
        .select();

      if (data) {
        setOpen(false);
      } else if (error) {
        throw new Error(error.message);
      }
    } else {
      const { data, error } = await supabase
        .from("grocerystoreitems")
        .update(
          {
            name,
            notes,
            quantity: Number(quantity),
            modified_at: now,
          },
        )
        .eq("id", groceryStoreItem.id)
        .select();

      if (data) {
        setOpen(false);
      } else if (error) {
        throw new Error(error.message);
      }
    }
  }

  return (
    <>
      <IconButton
        sx={{ color: "primary.main" }}
        aria-label="Edit Item"
        onClick={handleClickOpen}
      >
        <EditIcon sx={{ fontSize: 25 }} />
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Item</DialogTitle>
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
            type="number"
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
                maxWidth: 150,
              }}
            >
              <CardMedia
                component="img"
                height="150"
                image={image.preview || ""}
                alt={`Image of `}
              />
            </Card>
          ) : (
            <Card
              sx={{
                maxWidth: 150,
              }}
            >
              <CardMedia
                component="img"
                height="150"
                image={`${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${image.preview}`}
                alt={`Image of `}
              />
            </Card>
          )}
          <Button
            variant="contained"
            component="label"
            startIcon={<AddPhotoAlternateIcon />}
          >
            Upload File
            <input type="file" onChange={handleImageSet} hidden />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEdit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
