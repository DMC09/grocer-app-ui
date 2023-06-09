"use client";

import { Button } from "@mui/material";
import { useSupabase } from "../supabase/supabase-provider";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

export default function LeaveGroup() {
  const { supabase, session } = useSupabase();

  async function handleLeaveGroup() {
    // need to delete myself from the group;
    // need a useEffect to see if there is a filter using my profile id.

    const { data, error } = await supabase
      .from("groups")
      .delete()
      .eq("profile_id", session?.user.id);

    if (error) {
      throw new Error(error.message);
    } else {
        console.log(data)
      console.log("Group left!!");
    }
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={handleLeaveGroup}
        endIcon={<CancelPresentationIcon />}
        sx={{ fontSize: 20 }}
      >
        Leave group!
      </Button>
    </>
  );
}
