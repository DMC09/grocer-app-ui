"use client";

import { Divider, Chip, Box } from "@mui/material";
import { profile } from "console";
import CreateGroup from "../utils/createGroup";
import JoinGroup from "../utils/joinGroup";
import { ProfileType } from "@/types";

export default function JoinCreateActions(profile: ProfileType) {
  return (
    <>
      <Box
        textAlign={"center"}
        sx={{
          p:2,
          border:1,
          borderRadius: 8,
          backgroundColor: "background.paper",
          boxShadow:5

        }}
      >
        {<JoinGroup {...profile} />}
        <Divider>
          <Chip label="or" />
        </Divider>
        {<CreateGroup {...profile} />}
      </Box>
    </>
  );
}
