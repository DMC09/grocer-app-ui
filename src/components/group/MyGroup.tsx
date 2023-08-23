"use client";

import { GroupMemberType } from "@/types";
import { Avatar, Box, Typography } from "@mui/material";
import GroupMember from "./groupMember";
export default function MyGroup({
  groupMembers,
}: {
  groupMembers: GroupMemberType[] | [];
}) {
  const groupMembersToRender = groupMembers?.map((member: GroupMemberType) => {
    return (
      <>
        <GroupMember key={member.id} {...member} />
      </>
    );
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexFlow: "column",
        justifyContent: "space-around",

        height: "100%",
      }}
    >
      <Typography color="#071236" align="center" variant="h3" sx={{ my: 2 }}>
        {groupMembers[0]?.group_name}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          height: "50%",
          overflowY: "scroll",
          justifyContent: "space-around",
        }}
      >
        {groupMembers && groupMembers.length > 0 && groupMembersToRender}
      </Box>
    </Box>
  );
}
