import {
  ClickAwayListener,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  Container,
  IconButton,
  Card,
  CardMedia,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useState } from "react";
import { useSupabase } from "../supabase/supabase-provider";

// Create upload image capability
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

  async function generateImagePath(select_id: string) {
    //Formula is last 16 characters of select_id + Current DateTime in seconds/
    const lastPartOfSelectId = select_id?.slice(-16);
    const currentTimeStamp = new Date().getTime();

    setImagePath(
      `grocerystoreitem_images/${lastPartOfSelectId}/${currentTimeStamp}`
    );
  }
  async function handleImageSet(event: any) {
    if (event.target.files.length && select_id) {
      generateImagePath(select_id);
      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }

  async function handleImageUpload() {
    console.log(image.raw, "path for image when uploading");
    console.log(imagePath, "path for image when uploading");
    if (image.raw && imagePath) {
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

  async function handleSubmit() {
    if (image.raw) {
      await handleImageUpload();
      const { data, error } = await supabase
        .from("grocerystoreitems")
        .insert([
          {
            store_id,
            name,
            notes,
            quantity: Number(quantity),
            select_id,
            image: imagePath,
          },
        ])
        .select();
      if (data) {
        setOpen(false);
        setName("");
        setNotes("");
        setQuantity("");
        setImage({ preview: "", raw: "" });
      } else if (error) {
        throw new Error(error.message);
      }
    } else {
      const { data, error } = await supabase
        .from("grocerystoreitems")
        .insert([
          {
            store_id,
            name,
            notes,
            quantity: Number(quantity),
            select_id,
          },
        ])
        .select();
      if (data) {
        setOpen(false);
        setName("");
        setNotes("");
        setQuantity("");
      } else if (error) {
        throw new Error(error.message);
      }
    }
  }

  return (
    <>
      <Box sx={{}}>
        <IconButton
          sx={{ color: "background.paper" }}
          onClick={handleClickOpen}
          aria-label="add to grocery store"
        >
          <ControlPointIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>

      <Dialog open={open} onClose={handleClose}>
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
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
