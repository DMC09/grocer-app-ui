"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Card,
  CardMedia,
} from "@mui/material";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useSupabase } from "../supabase/supabase-provider";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function AddStore({ select_id }: { select_id: string }) {
  const { supabase, session } = useSupabase();

  const [open, setOpen] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [newGroceryStoreName, setNewGroceryStoreName] = useState<string>("");
  const [imagePath, setImagePath] = useState<string | null>(null);

  async function generateImagePath(select_id: string) {
    //Formula is last 16 characters of select_id + Current DateTime in seconds/
    const lastPartOfSelectId = select_id?.slice(-16);
    const currentTimeStamp = new Date().getTime();

    setImagePath(
      `grocerystore_images/${lastPartOfSelectId}/${currentTimeStamp}`
    );
  }

  async function validation() {
    if (newGroceryStoreName.trim() === "") {
      setIsInvalid(true);
      setErrorText("Please enter a name");
      return false;
    }

    // Check if the text is valid alphanumeric
    const regExp = /^[a-zA-Z0-9 _\-!\$]+$/i;
    if (!regExp.test(newGroceryStoreName)) {
      setErrorText("Please only use letters and number");
      setIsInvalid(true);
      return false;
    } else {
      setIsInvalid(false);
      console.log("Validation successful");
      return true;
    }
  }

  async function handleClickOpen() {
    setOpen(true);
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setNewGroceryStoreName(event.target.value);
    setErrorText(null);
    setIsInvalid(null);
  }

  function handleClose(event: {}): void {
    setImage({ preview: "", raw: "" });
    setImagePath(null);
    setOpen(false);
    setNewGroceryStoreName("");
    setErrorText(null);
    setIsInvalid(null);
  }

  const handleImageSet = async (event: any) => {
    if (event.target.files.length) {
      generateImagePath(select_id);
      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  };
  const handleImageUpload = async () => {
    if (image.raw && imagePath) {
      console.log(imagePath, "path for image when uploading");
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
  };

  async function handleSubmit() {
    const isValidResult = await validation();
    await handleImageUpload();

    if (isValidResult) {
      console.log(imagePath, "path for image when submitting");
      const { data, error } = await supabase
        .from("grocerystores")
        .insert([{ name: newGroceryStoreName, select_id, image: imagePath }]);
      if (error) {
        throw new Error(error.message);
      } else {
        setOpen(false);
        setNewGroceryStoreName("");
        setImage({ preview: "", raw: "" });
      }
    } else {
      console.log("we coudln't take this submittions");
    }
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        endIcon={<AddCircleIcon />}
        sx={{ fontSize: 80 }}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add new Store</DialogTitle>
        <DialogContent>
          <TextField
            error={isInvalid || undefined}
            helperText={isInvalid && errorText}
            autoFocus
            margin="dense"
            id="Name"
            label="Name"
            type="email"
            fullWidth
            variant="standard"
            onChange={handleChange}
            value={newGroceryStoreName}
          />
        </DialogContent>
        <DialogContent>
          <>
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
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
