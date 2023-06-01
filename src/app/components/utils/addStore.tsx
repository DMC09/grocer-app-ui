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
import { ChangeEvent, useMemo, useState } from "react";
import { useSupabase } from "../supabase/supabase-provider";
import { PostgrestError } from "@supabase/supabase-js";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import image from "next/image";

export default function AddStore() {
  const { supabase, session } = useSupabase();

  const [open, setOpen] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [newGroceryStoreName, setNewGroceryStoreName] = useState<string>("");

  const getSelectId = useMemo(async (): Promise<number | null> => {
    const { data, error }: { data: any; error: PostgrestError | null } =
      await supabase.from("profiles").select("select_id").single();
    if (data) {
      return data?.select_id;
    } else {
      throw new Error(error?.message);
    }
  }, []);

  async function validation() {
    if (newGroceryStoreName.trim() === "") {
      setIsInvalid(true);
      setErrorText("Please enter a name");
      return false;
    }

    // Check if the text is valid alphanumeric
    const regExp = /^[a-zA-Z0-9]+$/;
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
    setOpen(false);
    setNewGroceryStoreName("");
    setErrorText(null);
    setIsInvalid(null);
  }

  const handleImageSet = async (event: any) => {
    if (event.target.files.length) {
      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  };
  const handleImageUpload = async () => {
    if (image.raw) {
      const { data, error } = await supabase.storage
        .from("grocerystore")
        .upload("grocerystore_images/test.png", image.raw);
      console.log(data, "data after uploading");
      if (error) {
        throw new Error(`Error uploading image ${error.message}`);
      } else {
        const { data } = supabase.storage
          .from("grocerystore")
          .getPublicUrl("grocerystore_images/test.png");

        if (data) {
          return data.publicUrl;
        } else {
          throw new Error("error retrieving public url image");
        }
      }
    }
  };

  async function handleSubmit() {
    const isValidResult = await validation();
    const public_url = await handleImageUpload();

    if (isValidResult) {
      const select_id = await getSelectId;
      const { data, error } = await supabase
        .from("grocerystores")
        .insert([{ name: newGroceryStoreName, select_id, image: public_url }]);
      if (error) {
        throw new Error(error.message);
      } else {
        setOpen(false);
        setNewGroceryStoreName("");
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
