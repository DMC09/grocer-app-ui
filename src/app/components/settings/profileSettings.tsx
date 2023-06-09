"use client";

import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  IconButton,
} from "@mui/material";

import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { useSupabase } from "../supabase/supabase-provider";
import { GroupType, ProfileType } from "@/types";
import EditProfileSettings from "./editProfileSettings";
import GroupSettings from "./groupSettings";
import { Divider } from "@supabase/ui";

export default function ProfileSettings() {
  const { supabase, session } = useSupabase();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [user, setUser] = useState(session?.user);

  async function getProfileData() {
    let { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    profile && setProfile(profile as ProfileType);
  }

  useEffect(() => {
    getProfileData();
  }, [supabase]);

  //need to also grab the group Data

  // need to get the stuff from profile

  return (
    <>
      <Container
        sx={{
          border: 2,
        }}
      >
        <Box
          sx={{
            height: "fit-content",
            display: "flex",
            flexFlow: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            sx={{
              height: 150,
              width: 150,
              borderRadius: 20,
              mb: -5.5,
            }}
          >
            {profile?.avatar_url && (
              <CardMedia
                component="img"
                height={150}
                width={150}
                image={`${process.env.NEXT_PUBLIC_SUPABASE_PROFILE}/${profile?.avatar_url}`}
                alt={`Image of `}
              />
            )}
          </Card>
        </Box>
        <p>Profile Settings</p>
        <p>{profile?.first_name}</p>
        <p>{profile?.last_name}</p>
        <p>{profile?.email}</p>
        <p>{profile?.phone}</p>
        {profile && <EditProfileSettings {...profile} />}
        <Divider />
        {profile && <GroupSettings {...profile} />}
      </Container>
    </>
  );
}
