"use client";

import { GroupMembers } from "@/types";
import { Avatar, Typography } from "@mui/material";

export default function MyGroup({
  groupMembers,
}: {
  groupMembers: GroupMembers[] | [];
}) {
  console.log("GroupMembers", groupMembers);

  const groupMembersToRender = groupMembers?.map((member: GroupMembers) => {
    return (
      <>
        <Avatar
          sx={{ width: 32, height: 32 }}
          src={`${process.env.NEXT_PUBLIC_SUPABASE_PROFILE}/${member?.avatar_url}`}
        />
        <p>{member.first_name}</p>
      </>
    );
  });

  return (
    <>
      <Typography color="#071236" variant="body2">
        My group
      </Typography>
      {groupMembers && groupMembers.length > 0 && groupMembersToRender}
    </>
  );
}
