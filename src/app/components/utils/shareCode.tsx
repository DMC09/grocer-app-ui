import { Button, Typography } from "@mui/material";
import LibraryAddSharpIcon from "@mui/icons-material/LibraryAddSharp";
import { ProfileType } from "@/types";
import { useSupabase } from "../supabase/supabase-provider";
import { useState } from "react";

export default function ShareCode(profile: ProfileType | null) {
  const { supabase, session } = useSupabase();
  const [shareCode, setShareCode] = useState<string | null>(null);
  async function handleShareCode() {
    const uuid = crypto.randomUUID();
    const uuidWithoutHyphens = uuid.replace(/-/g, "");
    const firstFourCharacters = uuidWithoutHyphens
      .substring(0, 4)
      .toLocaleUpperCase();

    const { data, error } = await supabase
      .from("groups")
      .update({ share_code: firstFourCharacters })
      .eq("profile_id", profile?.id)
      .select();

    if (data && data?.length > 0) {
      setShareCode(firstFourCharacters);
    } else {
      throw new Error(error?.message);
    }
  }
  return (
    <>
      <Button
        sx={{ height: "fit-content", fontSize: "small" }}
        variant="contained"
        onClick={handleShareCode}
        endIcon={<LibraryAddSharpIcon />}
      >
        Share Code
      </Button>
      <Typography>{shareCode}</Typography>
    </>
  );
}
