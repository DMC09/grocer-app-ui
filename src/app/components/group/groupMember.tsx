"use client";

import { GroupMemberType } from "@/types";
import { Avatar, Box, Typography } from "@mui/material";

export default function GroupMember(member: GroupMemberType) {
  return (
    <>
      <Box
        sx={{
          width: 100,
          display: "flex",
          flexFlow: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Avatar
          sx={{ width: 32, height: 32 }}
          src={`${process.env.NEXT_PUBLIC_SUPABASE_PROFILE}/${member?.avatar_url}`}
        />
        <Typography>{member.first_name}</Typography>
        <Typography>{member.last_name}</Typography>
      </Box>
    </>
  );
}
