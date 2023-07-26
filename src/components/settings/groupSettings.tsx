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
import JoinCreateActions from "../group/joinCreateActions";
import ShareCode from "../utils/shareCode";

export default function GroupSettings(profile: ProfileType | null) {
  const { supabase, session } = useSupabase();
  const groupMembers = useProfileStore((state) => state.groupData);

  return (
    <>
      {profile && (
        <Container id="group-settings-container" sx={{ height: "100%" }}>
          {profile.in_group ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexFlow: "column",
                  alignItems: "center",
                  width: "100%",
                  height: "50%",
                  border: 2,
                  borderRadius: 8,
                  borderColor: "primary.main",
                  backgroundColor: "background.paper",
                  boxShadow: 5,
                  my: 2,
                }}
              >
                <MyGroup groupMembers={groupMembers} />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  border: 2,
                  borderColor: "primary.main",
                  borderRadius: 8,
                  py: 2,
                  backgroundColor: "background.paper",
                  alignItems: "flex-start",
                  justifyContent: "space-around",
                  boxShadow: 5,
                  height: "10%",
                }}
              >
                <ShareCode {...profile} />
                <LeaveGroup />
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexFlow: "column",
                justifyContent: "space-around",
                alignItems: "center",
                width: "100%",
                height: "50%",
              }}
            >
              <JoinCreateActions {...profile} />
            </Box>
          )}
        </Container>
      )}
    </>
  );
}
