import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Card,
  CardMedia,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useState } from "react";
import { useSupabase } from "../supabase/supabase-provider";
import {
  generateGroceryStoreItemImagePath,
  handleGroceryStoreImageUpload,
} from "@/app/utils/client/image";
import { addNewGroceryStoreItem } from "@/app/utils/client/groceryStore";

export default function AddItem({
  store_id,
  select_id,
}: {
  store_id: number;
  select_id: string | null;
}) {
  const [open, setOpen] = useState(false);

  const { supabase } = useSupabase();

  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [imagePath, setImagePath] = useState<string | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  async function handleImageSet(event: any) {
    if (event.target.files.length && select_id) {
      const generatedImagePath = await generateGroceryStoreItemImagePath(
        select_id
      );
      setImagePath(generatedImagePath);
      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }

  async function handleSubmitNewItem() {
    if (select_id) {
      if (image.raw && imagePath) {
        await handleGroceryStoreImageUpload(supabase, imagePath, image?.raw);
        await addNewGroceryStoreItem(
          supabase,
          store_id,
          name,
          notes,
          Number(quantity),
          select_id,
          imagePath
        );
      } else {
        await addNewGroceryStoreItem(
          supabase,
          store_id,
          name,
          notes,
          Number(quantity),
          select_id
        );
      }
      setOpen(false);
      setName("");
      setNotes("");
      setQuantity("");
      setImage({ preview: "", raw: "" });
    }
  }

  // function handleClickAway(event: MouseEvent | TouchEvent): void {
  //   throw new Error("Function not implemented.");
  // }
  //TODO: Do the same type of validation for the items in the store
  //Also make sure to fix all tables so they cann't take null for certain things.
  // prevent evet putting zero

  const handleClose = () => {
    setOpen(false);
    setName("");
    setNotes("");
    setQuantity("");
  };

  return (
    <>
      <MenuItem sx={{ color: "green" }} onClick={handleClickOpen}>
        <ListItemIcon aria-label="add to grocery store">
          <ControlPointIcon sx={{ color: "green" }} fontSize="small" />
        </ListItemIcon>
        Add Item
      </MenuItem>
      <Dialog open={open}>
        <DialogTitle>Add new item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="Name"
            label="Name"
            type="email"
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
            onChange={(e) => setQuantity(e.target.value)}
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
          {image.preview ? (
            <Card
              sx={{
                maxWidth: 150,
              }}
            >
              <CardMedia
                component="img"
                height="150"
                image={image.preview}
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
                image={
                  "https://filetandvine.com/wp-content/uploads/2015/07/pix-uploaded-placeholder.jpg"
                }
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
          <Button onClick={handleSubmitNewItem}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
