"use client";

import { GroupMemberType } from "@/types";
import { Avatar, Box, Typography } from "@mui/material";
import GroupMember from "./groupMember";
export default function MyGroup({
  groupMembers,
}: {
  groupMembers: GroupMemberType[] | [];
}) {
  console.log("GroupMembers", groupMembers);

  const groupMembersToRender = groupMembers?.map((member: GroupMemberType) => {
    return (
      <>
        <GroupMember key={member.id} {...member} />
      </>
    );
  });

  return (
    <Box sx={{ p: 1}}>
      <Typography color="#071236" align="center" variant="h5" sx={{mb:2}}>
        My group
      </Typography>
      {groupMembers && groupMembers.length > 0 && groupMembersToRender}
    </Box>
  );
}
