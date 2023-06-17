"use client";

import {
  Box,
  Card,
  CardMedia,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSupabase } from "../supabase/supabase-provider";
import {  ProfileType } from "@/types";
import EditProfileSettings from "./editProfileSettings";
import GroupSettings from "./groupSettings";


export default function ProfileSettings() {
  const { supabase, session } = useSupabase();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [user, setUser] = useState(session?.user);

  //need realtime for this

  useEffect(() => {
    const channel = supabase
      .channel("custom-profiles-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user?.id}`,
        },
        getProfileData
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

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
    profile && (
      <>
        <Container
          disableGutters
          maxWidth={false}
          sx={{ borderColor: "green" }}
        >
          <Box
            sx={{
              height: "60%",

              display: "flex",
              flexFlow: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                height: "15%",
              }}
            >
              <Typography align="center" variant="h6">
                Profile Settings
              </Typography>
              <EditProfileSettings {...profile} />
            </Box>
            <Box
              sx={{
                height: "85%",
                display: "flex",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: "30%",
                  display: "flex",
                  flexFlow: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Card
                  sx={{
                    height: 125,
                    width: 125,
                    borderRadius: 15,
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

              <Box
                sx={{
                  borderColor: "purple",
                  width: "70%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                  p: 1,
                }}
              >
                <TextField
                  id="outlined-read-only-input"
                  sx={{ height: "25%", maxHeight: 50 }}
                  label="First name"
                  value={profile?.first_name}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  id="outlined-read-only-input"
                  label="Last name"
                  sx={{ height: "25%", maxHeight: 50 }}
                  value={profile?.last_name}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  id="outlined-read-only-input"
                  label="Email"
                  sx={{ height: "25%", maxHeight: 50 }}
                  value={profile?.email}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  id="outlined-read-only-input"
                  label="Phone"
                  sx={{ height: "25%", maxHeight: 50 }}
                  value={profile?.phone}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              height: "40%",
            }}
          >
            <GroupSettings {...profile} />
          </Box>
        </Container>
      </>
    )
  );
}
