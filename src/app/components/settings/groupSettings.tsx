"use client";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import { useSupabase } from "../supabase/supabase-provider";
import { useEffect, useMemo, useState } from "react";
import JoinGroup from "../utils/joinGroup";
import CreateGroup from "../utils/createGroup";
import { GroupMemberType, GroupType, ProfileType } from "@/types";
import LeaveGroup from "../utils/leaveGroup";
import MyGroup from "../group/MyGroup";
import LibraryAddSharpIcon from "@mui/icons-material/LibraryAddSharp";
import { useProfileStore } from "@/state/ProfileStore";

export default function GroupSettings(profile: ProfileType | null) {
  const { supabase, session } = useSupabase();
  const [shareCode, setShareCode] = useState<string | null>(null);
  const groupMembers = useProfileStore((state) => state.groupData);

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
      {profile && (
        <Container  sx={{ height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              py: 4,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {profile.in_group ? (
              <Box >
                <MyGroup groupMembers={groupMembers} />
                <Box
                  sx={{
                    display: "flex",
                    p: 1,
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <Button
                    sx={{ height: "fit-content", fontSize: "small" }}
                    variant="contained"
                    onClick={handleShareCode}
                    endIcon={<LibraryAddSharpIcon />}
                  >
                    Share Code
                  </Button>
                  <Typography>{shareCode}</Typography>
                  <LeaveGroup />
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  width: "fit-content",
                  display: "flex",
                  flexFlow: "column",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                {<JoinGroup {...profile} />}
                <Divider>
                  <Chip label="or" />
                </Divider>
                {<CreateGroup {...profile} />}
              </Box>
            )}
          </Box>
        </Container>
      )}
    </>
  );
}
