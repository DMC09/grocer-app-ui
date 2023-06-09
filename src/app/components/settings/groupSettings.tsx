"use client";
import { Button, Container, IconButton, Typography } from "@mui/material";
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
      <Container sx={{ border: 1 }}>
        <p>Group Settings</p>

        {groups ? (
          <p>You are a part of group now!</p>
        ) : (
          <p>Sorry you are not a apart of group</p>
        )}

        {groups && groups.is_admin && (
          <>
            <Button
              variant="contained"
              onClick={handleShareCode}
              endIcon={<AddCircleIcon />}
              sx={{ fontSize: 20 }}
            >
              Generate Share Code
            </Button>
            <Typography>{`The Share Code is ${
              shareCode ? shareCode : "not generated"
            }`}</Typography>
          </>
        )}

        {profile && !groups && <JoinGroup {...profile} />}
        {profile && !groups && <CreateGroup {...profile} />}
        {groups && <LeaveGroup />}
        {groups && <MyGroup groupMembers={otherGroupMembers} />}
      </Container>
    </>
  );
}
