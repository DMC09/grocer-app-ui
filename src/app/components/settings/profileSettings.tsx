"use client";

import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  IconButton,
  TextField,
  Typography,
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
    profile && (
      <>
        <Container
          disableGutters
          maxWidth={false}
          sx={{ border: 1, borderColor: "green" }}
        >
          <Box
            sx={{
              height: "50%",
              borderColor: "red",
              border: 1,
              display: "flex",
              flexFlow: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                border: 1,
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
                border: 1,
                borderColor: "green",
                height: "85%",
                display: "flex",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  border: 1,
                  borderColor: "orange",
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
                  border: 1,
                  borderColor: "purple",
                  width: "70%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                  p: 1,
                }}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="First name"
                  defaultValue={profile?.first_name}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  id="outlined-read-only-input"
                  label="Last name"
                  defaultValue={profile?.last_name}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  id="outlined-read-only-input"
                  label="Email"
                  defaultValue={profile?.email}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  id="outlined-read-only-input"
                  label="Phone"
                  defaultValue={profile?.phone}
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
              height: "50%",
              borderColor: "red",
              border: 1,
            }}
          >
            <GroupSettings {...profile} />
          </Box>
        </Container>
      </>
    )
  );
}
