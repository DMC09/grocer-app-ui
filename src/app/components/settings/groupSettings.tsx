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
import { getGroupData } from "@/app/utils/client/group";

export default function GroupSettings(profile: ProfileType | null) {
  const { supabase, session } = useSupabase();
  const [shareCode, setShareCode] = useState<string | null>(null);
  const resetGroup = useProfileStore((state) => state.resetGroupState);
  const groupMembers = useProfileStore((state) => state.groupData);

  useEffect(() => {
    if (profile?.in_group) {
      getData();
    }
  }, [supabase]);

  async function getData() {
    await getGroupData(supabase);
  }

  async function handleShareCode() {
    const uuid = crypto.randomUUID();
    const uuidWithoutHyphens = uuid.replace(/-/g, "");
    const firstFourCharacters = uuidWithoutHyphens.substring(0, 4);

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
        <Container disableGutters maxWidth={false} sx={{ height: "100%" }}>
          <Box
            sx={{
              height: "15%",
            }}
          >
            <Typography align="left" variant="h6">
              Group Settings
            </Typography>
          </Box>
          <Box
            sx={{
              height: "85%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {profile.in_group ? (
              <Box sx={{}}>
                <MyGroup groupMembers={groupMembers} />
                <Button
                  variant="contained"
                  onClick={handleShareCode}
                  endIcon={<LibraryAddSharpIcon />}
                >
                  Generate Share Code
                </Button>
                <Typography>{`The Share Code is ${
                  shareCode ? shareCode : "not generated"
                }`}</Typography>
                <LeaveGroup />
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
