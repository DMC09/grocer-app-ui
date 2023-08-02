import {
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
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useState } from "react";
import { useSupabase } from "../supabase/supabase-provider";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { ProfileType } from "@/types";

export default function CreateGroup(profile: ProfileType | null) {
  const { supabase, session } = useSupabase();
  const [groupName, setGroupName] = useState("");
  const [open, setOpen] = useState(false);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string>("");
  const [image, setImage] = useState({ preview: "", raw: "" });

  async function handleClickOpen() {
    await generateGroupId();
    await setOpen(true);
  }
  async function handleClose() {
    await setOpen(false);
    await setGroupName("");
    await setImagePath(null);
    await setImage({ preview: "", raw: "" });
  }

  async function generateGroupId() {
    setGroupId(crypto.randomUUID());
  }

  async function handleImageUpload() {
    if (image.raw && imagePath) {
      // TODO: error handling
      const { data, error } = await supabase.storage
        .from("profile")
        // Need a custom path thing for this.
        // Also need to getthe public url
        .upload(imagePath, image.raw);
      if (error) {
        throw new Error(`Error uploading image ${error.message}`);
      } else {
      }
    }
  }

  async function generateImagePath(group_id: string) {
    //Formula is last 16 characters of select_id + Current DateTime in seconds/
    const lastPartOfSelectId = group_id?.slice(-16);
    const currentTimeStamp = new Date().getTime();
    setImagePath(`groups/${lastPartOfSelectId}/${currentTimeStamp}`);
  }
  //Need to generate UUID
  async function handleImageSet(event: any) {
    if (event.target.files.length && groupId) {
      generateImagePath(groupId);
      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
      });
    }
  }

  async function handleSubmit() {
    if (image.raw && imagePath) {
      // TODO: error handling
      await handleImageUpload();
      const { data, error } = await supabase
        .from("groups")
        .insert([
          {
            group_id: groupId,
            profile_id: profile?.id,
            group_image: imagePath,
            group_name: groupName,
            is_admin: true,
            email: profile?.email,
            first_name: profile?.first_name,
            last_name: profile?.last_name,
            profile_image: profile?.avatar_url,
          },
        ])
        .select();
      if (error) {
        throw new Error(error.message);
      } else {
        console.log(data, "data after ubmitting");
        await setOpen(false);
        await setGroupName("");
        await setImagePath(null);
        await setImage({ preview: "", raw: "" });
      }
    } else {
      console.log(groupId);
      console.log(profile?.id);
      const { data, error } = await supabase.from("groups").insert([
        {
          group_id: groupId,
          profile_id: profile?.id,
          email: profile?.email,
          first_name: profile?.first_name,
          last_name: profile?.last_name,
          profile_image: profile?.avatar_url,
          group_name: groupName,
          is_admin: true,
        },
      ]);

      if (error) {
        throw new Error(error.message);
      } else {
        await setOpen(false);
        await setGroupName("");
        await setImagePath(null);
        await setImage({ preview: "", raw: "" });
        console.log(data, "data after ubmitting");
      }
    }
  }
  return (
    <>
      <IconButton
        sx={{ color: "primary.main", fontSize: 40 }}
        aria-label="Create new group"
        onClick={handleClickOpen}
      >
        <PersonAddAlt1Icon sx={{ fontSize: 40, mr: 1 }} />
        Create Group
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle align="center">Create New Group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="Group Name"
            label="Group Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setGroupName(e.target.value)}
            value={groupName}
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
