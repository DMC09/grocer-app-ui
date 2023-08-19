import { CommonItemType } from "@/types";
import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Card,
  CardMedia,
  Button,
  DialogActions,
} from "@mui/material";
import image from "next/image";
import { useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useSupabase } from "@/components/supabase/supabase-provider";
import { ProfileDataStore } from "@/stores/ProfileDataStore";
import { getAllCommonItems, updateCommonItem } from "@/helpers/commonItem";
import { handleGroceryStoreItemImageUpload } from "@/helpers/image";

export default function EditCommonItem(item: CommonItemType) {
  const [open, setOpen] = useState(false);
  const { supabase, session } = useSupabase();
  const [name, setName] = useState<string | null>(item?.item_name);
  const [notes, setNotes] = useState<string | null>(item.item_notes);
  const [imagePath, setImagePath] = useState<string | null>(null);

  const selectId = ProfileDataStore((state) => state.data.select_id);
  const [image, setImage] = useState({
    preview: item?.image,
    raw: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

   function handleClose() {
    setOpen(false);
    resetData();
  }

  async function resetData() {
    setImagePath(null);
    setImage({
      preview: item.image,
      raw: "",
    });
  }

  async function getData() {
    await getAllCommonItems(supabase);
  }

  async function generateImagePath(select_id: string) {
    //Formula is last 16 characters of select_id + Current DateTime in seconds/
    const lastPartOfSelectId = select_id?.slice(-16);
    const currentTimeStamp = new Date().getTime();

    setImagePath(
      `grocerystore_images/${lastPartOfSelectId}/${currentTimeStamp}`
    );
  }

  async function handleImageSet(event: any) {
    if (event.target.files.length && selectId) {
      generateImagePath(selectId);
      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }

  async function handleEdit() {
    if (image.raw && imagePath) {
      console.log("okay we are uploading an image");
      await handleGroceryStoreItemImageUpload(supabase, imagePath, image?.raw);
      console.log("Uploaded image");
    }

    const updatedCommonItem = await updateCommonItem(
      supabase,
      item.id,
      name,
      notes,
      imagePath
    );

    console.log(updatedCommonItem, "updated itme");
    if (updatedCommonItem) {
      await getData();
    }
    handleClose();
    resetData();
    // edit the item in supabase
    // throw new Error("Function not implemented.");
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
