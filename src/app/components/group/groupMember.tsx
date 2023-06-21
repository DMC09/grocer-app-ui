"use client";

import { GroupMemberType } from "@/types";
import { Avatar, Typography } from "@mui/material";

export default function GroupMember(member: GroupMemberType) {
  return (
    <>
      <Avatar
        sx={{ width: 32, height: 32 }}
        src={`${process.env.NEXT_PUBLIC_SUPABASE_PROFILE}/${member?.avatar_url}`}
      />
      <p>{member.first_name}</p>
      <p>{member.last_name}</p>
    </>
  );
}
