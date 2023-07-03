"use client";

import { Button } from "@mui/material";
import { useSupabase } from "../supabase/supabase-provider";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function LeaveGroup() {
  const { supabase, session } = useSupabase();

  async function handleLeaveGroup() {
    const { data, error } = await supabase
      .from("groups")
      .delete()
      .eq("profile_id", session?.user.id);

    if (error) {
      throw new Error(error.message);
    } else {
      console.log(data);
      console.log("Group left!!");
    }
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={handleLeaveGroup}
        endIcon={<ExitToAppIcon />}
      >
        Leave group
      </Button>
    </>
  );
}
