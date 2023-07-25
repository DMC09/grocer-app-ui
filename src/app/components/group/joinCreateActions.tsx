"use client";

import { Divider, Chip } from "@mui/material";
import { profile } from "console";
import CreateGroup from "../utils/createGroup";
import JoinGroup from "../utils/joinGroup";
import { ProfileType } from "@/types";

export default function JoinCreateActions(profile: ProfileType) {
  return (
    <>
      {<JoinGroup {...profile} />}
      <Divider>
        <Chip label="or" />
      </Divider>
      {<CreateGroup {...profile} />}
    </>
  );
}
