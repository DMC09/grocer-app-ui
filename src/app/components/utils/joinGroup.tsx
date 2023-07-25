import GroupAddIcon from "@mui/icons-material/GroupAdd";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useSupabase } from "../supabase/supabase-provider";
import { useState } from "react";
import { ProfileType } from "@/types";

export default function JoinGroup(profile: ProfileType) {
  const { supabase, session } = useSupabase();
  const [open, setOpen] = useState(false);
  const [shareCode, setShareCode] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShareCode("");
  };

  async function handleSubmit() {
    if (
      profile &&
      profile.first_name &&
      profile.last_name &&
      profile.avatar_url
    ) {
      const { data, error } = await supabase.rpc("join_group_via_share_code", {
        share_code: shareCode,
        email: profile?.email,
        first_name: profile?.first_name,
        last_name: profile?.last_name,
        profile_id: profile?.id,
        profile_image: profile?.avatar_url,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        return true;
      } else {
        return false;
      }
    } else {
      throw new Error("missing information")
    }
  }

  return (
    <>
      <IconButton
        sx={{ color: "primary.main", fontSize: 40 }}
        aria-label="Join a group"
        size="large"
        onClick={handleClickOpen}
      >
        <GroupAddIcon sx={{ fontSize: 40, mr: 1 }} />
        Join Group
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Submit Share code</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="share Code"
            label="Share Code"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setShareCode(e.target.value.toLocaleUpperCase())}
            value={shareCode}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
