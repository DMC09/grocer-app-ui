import { BucketType, CommonItemType, ImageType } from "@/types";
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
  useMediaQuery,
  Box,
  Typography,
} from "@mui/material";
import image from "next/image";
import { useEffect, useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useSupabase } from "@/components/supabase/supabase-provider";
import { ProfileDataStore } from "@/stores/ProfileDataStore";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { getAllCommonItems, updateCommonItem } from "@/helpers/commonItem";
import { generateImagePath, handleImageUpload } from "@/helpers/image";
import { theme } from "@/helpers/theme";

export default function EditCommonItem(item: CommonItemType) {
  // component State
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [showImageError, setShowImageError] = useState<boolean | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);

  const [image, setImage] = useState({
    preview: item?.image,
    raw: "",
  });

  // Hooks
  const { supabase, session } = useSupabase();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const selectId = ProfileDataStore((state) => state.data.select_id);

  // Data
  async function fetchData() {
    await getAllCommonItems(supabase);
  }

  // Event Handlers
  async function dismissError() {
    setImage({ preview: item?.image, raw: "" });
    setImagePath(null);
    setShowImageError(null);
  }

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    resetComponentState();
  }

  async function resetComponentState() {
    setName(item.item_name);
    setNotes(item.item_notes);
    setImagePath(null);
    setImage({ preview: item.image, raw: "" });
  }

  async function handleImageSet(event: any) {
    if (event.target.files.length && selectId) {
      setShowImageError(false);
      setImage({ preview: item.image, raw: "" });
      setImagePath(null);

      const sizeInMB = event.target.files[0].size / 1048576;

      const generatedPath = await generateImagePath(selectId, ImageType.Item);

      if (sizeInMB > 50) {
        setShowImageError(true);
        setImagePath(null);
        setImage({ preview: item.image, raw: "" });
      } else {
        setImagePath(generatedPath);

        setImage({
          preview: URL.createObjectURL(event.target.files[0]),
          raw: event.target.files[0],
        });
      }
    }
  }

  async function handleEdit() {
    if (image.raw && imagePath) {
      await handleImageUpload(
        supabase,
        imagePath,
        image?.raw,
        BucketType.Store
      );
      // TODO: Add better error handling and logging
    }

    const updatedCommonItem = await updateCommonItem(
      supabase,
      item.id,
      name,
      notes,
      imagePath
    );

    console.log(updatedCommonItem, "updated item");
    if (updatedCommonItem) {
      await fetchData();
    }
    handleClose();
  }

  useEffect(() => {
    setName(item.item_name);
    setNotes(item.item_notes);
    setImage({ preview: item.image, raw: "" });
  }, [item.image, item.item_name, item.item_notes]);

  return (
    <>
      <IconButton
        sx={{ color: "background.default" }}
        aria-label="Edit Common Item"
        onClick={handleClickOpen}
      >
        <EditIcon sx={{ fontSize: 25 }} />
      </IconButton>
      <Dialog open={open} fullScreen={fullScreen} onClose={handleClose}>
        <DialogTitle>{`Edit ${item.item_name}`}</DialogTitle>
        <Box>
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
                  width: "100%",
                }}
              >
                <CardMedia
                  sx={{ objectFit: "fill" }}
                  component="img"
                  height="200"
                  image={image.preview || ""}
                  alt={`Preview `}
                />
              </Card>
            ) : (
              <Card
                sx={{
                  width: "100%",
                }}
              >
                <CardMedia
                  sx={{ objectFit: "fill" }}
                  component="img"
                  height="200"
                  image={`${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${image.preview}`}
                  alt={`${item.item_name}`}
                />
              </Card>
            )}
            <Button
              sx={{
                mt: 2,
              }}
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
            >
              Upload File
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
