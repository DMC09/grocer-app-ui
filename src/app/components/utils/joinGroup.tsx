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
    // call the RPC
    // dialog to open a box and enter the code
    // app thinks and maybe a loading screen
    // state if successfull, I should refresh the group settings stuff
    // Failture notify user. but shouldn't really happen

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
        console.log("Insert successful");
        return true;
      } else {
        console.log("Insert failed");
        return false;
      }
    }
  }

  return (
    <>
      <IconButton
        sx={{ color: "primary.main" }}
        aria-label="Join a group"
        onClick={handleClickOpen}
      >
        Join Group
        <GroupAddIcon sx={{ fontSize: 25 }} />
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
