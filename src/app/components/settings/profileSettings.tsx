"use client";

import {
  Box,
  Card,
  CardMedia,
  Container,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import EditProfileSettings from "./editProfileSettings";
import GroupSettings from "./groupSettings";
import useStore from "@/app/hooks/useStore";
import { useProfileStore } from "@/state/ProfileStore";
import { useSupabase } from "../supabase/supabase-provider";
import ReactPullToRefresh from "react-pull-to-refresh/dist/index";
import { getProfileData } from "@/app/utils/client/profile";
import { getGroupData } from "@/app/utils/client/group";
import { SetStateAction, useState } from "react";
import { BorderColor } from "@mui/icons-material";

export default function ProfileSettings() {
  const profileData = useStore(useProfileStore, (state) => state?.data);
  const { supabase, session } = useSupabase();

  async function handleRefresh(): Promise<void> {
    // throw new Error("Function not implemented.");
    console.log("refreshing data");
    await getProfileData(supabase, session?.user?.id);
    await getGroupData(supabase);
  }

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const handleTabChange = (e: any, tabIndex: SetStateAction<number>) => {
    console.log(tabIndex);
    setCurrentTabIndex(tabIndex);
  };

  return (
    <>
      <ReactPullToRefresh
        onRefresh={handleRefresh}
        style={{ textAlign: "center" }}
      >
        <Container sx={{ borderColor: "purple" }}>
          {currentTabIndex === 0 && (
            <Box
              id="edit-button-container"
              sx={{
                display: "flex",
                flexFlow: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                {profileData && <EditProfileSettings {...profileData} />}
              </Box>
              <Box
                id="settings-container"
                sx={{
                  display: "flex",
                  flexFlow: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Box
                  id="avatar-container"
                  sx={{
                    width: "30%",
                    display: "flex",
                    p: 2,
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
                    {profileData?.avatar_url && (
                      <CardMedia
                        component="img"
                        height={150}
                        width={150}
                        image={`${process.env.NEXT_PUBLIC_SUPABASE_PROFILE}/${profileData?.avatar_url}`}
                        alt={`Image of `}
                      />
                    )}
                  </Card>
                </Box>

                <Box
                  id="setting-fields"
                  sx={{
                    width: "70%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 4,
                    p: 1,
                  }}
                >
                  <TextField
                    id="outlined-read-only-input"
                    sx={{
                      height: "25%",
                      maxHeight: 50,
                      width: "75%",
                      maxWidth: 250,
                    }}
                    label="First name"
                    value={profileData?.first_name}
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    id="outlined-read-only-input"
                    label="Last name"
                    sx={{
                      height: "25%",
                      maxHeight: 50,
                      width: "75%",
                      maxWidth: 250,
                    }}
                    value={profileData?.last_name}
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    id="outlined-read-only-input"
                    label="Email"
                    sx={{
                      height: "25%",
                      maxHeight: 50,
                      width: "75%",
                      maxWidth: 250,
                    }}
                    value={profileData?.email}
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    id="outlined-read-only-input"
                    label="Phone"
                    sx={{
                      height: "25%",
                      maxHeight: 50,
                      width: "75%",
                      maxWidth: 250,
                    }}
                    value={profileData?.phone}
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </Container>
      </ReactPullToRefresh>
    </>
  );
}
