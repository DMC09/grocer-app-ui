"use client";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useSupabase } from "../supabase/supabase-provider";
import { useEffect, useMemo, useState } from "react";
import JoinGroup from "../utils/joinGroup";
import CreateGroup from "../utils/createGroup";
import { GroupType, ProfileType } from "@/types";
import LeaveGroup from "../utils/leaveGroup";
import MyGroup from "../group/MyGroup";
import LibraryAddSharpIcon from "@mui/icons-material/LibraryAddSharp";

export default function GroupSettings(profile: ProfileType | null) {
  const { supabase, session } = useSupabase();
  const [open, setOpen] = useState(false);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [groups, setGroups] = useState<GroupType | null>(null);
  const [otherGroupMembers, setOtherGroupMembers] = useState<any>(null);

  useEffect(() => {
    const channel = supabase
      .channel("custom-groups-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "groups",
        },
        getGroupsData
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "groups",
        },
        getGroupsData
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  async function getGroupsData() {
    let { data: groups, error } = await supabase
      .from("groups")
      .select("*")
      .eq("profile_id", profile?.id)
      .single();
    console.log(groups);

    if (groups) {
      setGroups(groups as GroupType | null);
      await getGroupsView();
    } else if (groups === null) {
      setGroups(null);
    }
  }
  useEffect(() => {
    getGroupsData();
  }, [supabase]);

  async function getGroupsView() {
    const { data, error } = await supabase
      .from("group_members_view")
      .select("*");

    if (error) {
      throw new Error(error.message);
    } else {
      setOtherGroupMembers(data);
      console.log(data, "view data");
    }
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
        <Container
          disableGutters
          maxWidth={false}
          sx={{ border: 1, height: "100%" }}
        >
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
              border: 1,
              borderColor: "blue",
              height: "85%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {groups ? (
              <Box
              sx={{
                border:1,
              }}
              >
                <MyGroup groupMembers={otherGroupMembers} />
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
                  border: 1,
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
