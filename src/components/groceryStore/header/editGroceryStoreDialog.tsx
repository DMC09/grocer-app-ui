import { useSupabase } from "@/components/supabase/supabase-provider";
import { useDialog } from "@/context/DialogContext";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { GroceryStoreType, GroceryStoreWithItemsType } from "@/types";
import { theme } from "@/helpers/theme";
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

import { GroceryDataStore } from "@/stores/GroceryDataStore";
import { updateGroceryStore } from "@/helpers/groceryStore";
import {
  generateGroceryStoreItemImagePath,
  handleGroceryStoreImageUpload,
} from "@/helpers/image";

export default function EditGroceryStoreDialog(groceryStore: GroceryStoreType) {
  //state
  const [updatedGroceryStoreName, setUpdatedGroceryStoreName] =
    useState<string>(groceryStore.name);
  const [imagePath, setImagePath] = useState<string | null>(null);

  const [updatedImage, setUpdatedImage] = useState({
    preview: groceryStore?.image,
    raw: "",
  });

  const GroceryStoreData = GroceryDataStore((state) => state.data);

  const updateGroceryStoreState = GroceryDataStore(
    (state) => state.updateGroceryStore
  );

  //hooks
  const { supabase, session } = useSupabase();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { openStoreSettingsDialog, handleStoreSettingsDialogClose } =
    useDialog();

  //handlers
  async function handleImageUpdate(event: any) {
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
  async function handleUpdate() {
    if (updatedImage.raw && imagePath) {
      // TODO: error handling
      await handleGroceryStoreImageUpload(
        supabase,
        imagePath,
        updatedImage?.raw
      );
    }
    const updatedStoreData = await updateGroceryStore(
      supabase,
      groceryStore.id,
      updatedGroceryStoreName,
      imagePath
    );

    const index = GroceryStoreData.findIndex(
      (groceryStore) => groceryStore.id == updatedStoreData.id
    );
    const currentGroceryStoreObject = GroceryStoreData[index];

    const areObjectsEqual = Object.is(
      currentGroceryStoreObject,
      updatedStoreData
    );
    if (!areObjectsEqual) {
      console.log(
        `%cComponent: - Updating ${currentGroceryStoreObject?.name}`,
        "color: white; background-color: #007acc;",
        updatedStoreData
      );
      updateGroceryStoreState(updatedStoreData as GroceryStoreWithItemsType);
    }

    handleStoreSettingsDialogClose();
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
            <input type="file" onChange={handleImageUpdate} hidden />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStoreSettingsDialogClose}>Cancel</Button>
          <Button onClick={handleUpdate}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
