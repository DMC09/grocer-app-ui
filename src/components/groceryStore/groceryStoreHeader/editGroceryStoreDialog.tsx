import { useSupabase } from "@/components/supabase/supabase-provider";
import { useDialogContext } from "@/context/DialogContext";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { GroceryStoreType } from "@/types";
import { theme } from "@/utils/theme";
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
import { useState } from "react";
import {
  generateGroceryStoreItemImagePath,
  handleGroceryStoreImageUpload,
} from "@/utils/client/image";
import { updateGroceryStore } from "@/utils/client/groceryStore";

export default function EditGroceryStoreDialog(groceryStore: GroceryStoreType) {
  //state
  const [updatedGroceryStoreName, setUpdatedGroceryStoreName] =
    useState<string>(groceryStore.name);
  const [imagePath, setImagePath] = useState<string | null>(null);

  const [updatedImage, setUpdatedImage] = useState({
    preview: groceryStore?.image,
    raw: "",
  });

  //hooks
  const { supabase, session } = useSupabase();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { openStoreSettingsDialog, handleStoreSettingsDialogClose } =
    useDialogContext();


//handlers 
  async function handleSetUpdatedImage(event: any) {
    if (event.target.files.length && groceryStore?.select_id) {
      const generatedImagePath = await generateGroceryStoreItemImagePath(
        groceryStore?.select_id
      );
      setImagePath(generatedImagePath);
      setUpdatedImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }
  async function handleUpdateGroceryStoreSettings() {
    if (updatedImage.raw && imagePath) {
      await handleGroceryStoreImageUpload(
        supabase,
        imagePath,
        updatedImage?.raw
      );
      await updateGroceryStore(
        supabase,
        groceryStore.id,
        updatedGroceryStoreName,
        imagePath
      );
      handleStoreSettingsDialogClose();
    } else {
      await updateGroceryStore(
        supabase,
        groceryStore.id,
        updatedGroceryStoreName
      );
      handleStoreSettingsDialogClose();
    }
  }

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        id="grocery-store-settings-dialog"
        open={openStoreSettingsDialog}
        onClose={handleStoreSettingsDialogClose}
      >
        <DialogTitle align="center">Grocery Store Settings</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="Name"
            label="Name"
            fullWidth
            variant="standard"
            onChange={(e) => setUpdatedGroceryStoreName(e.target.value)}
            value={updatedGroceryStoreName}
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
          <Card
            sx={{
              maxWidth: 150,
            }}
          >
            {updatedImage.raw ? (
              <CardMedia
                component="img"
                height="150"
                image={updatedImage.preview || ""}
                alt={`Image of `}
              />
            ) : (
              <CardMedia
                component="img"
                height="150"
                image={`${process?.env?.NEXT_PUBLIC_SUPABASE_GROCERYSTORE}/${updatedImage.preview}`} //maybe this should be normal image??
                alt={`Image of `}
              />
            )}{" "}
          </Card>

          <Button
            variant="contained"
            component="label"
            startIcon={<AddPhotoAlternateIcon />}
          >
            Upload File
            <input type="file" onChange={handleSetUpdatedImage} hidden />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStoreSettingsDialogClose}>Cancel</Button>
          <Button onClick={handleUpdateGroceryStoreSettings}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
