"use client";

import {
  Box,
  Card,
  CardMedia,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import EditProfileSettings from "./editProfileSettings";
import GroupSettings from "./groupSettings";
import useStore from "@/app/hooks/useStore";
import { useProfileStore } from "@/state/store";

export default function ProfileSettings() {
  const profileData = useStore(useProfileStore, (state) => state?.data);

  return (
    profileData && (
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
              <EditProfileSettings {...profileData} />
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
                  value={profileData?.first_name}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  id="outlined-read-only-input"
                  label="Last name"
                  sx={{ height: "25%", maxHeight: 50 }}
                  value={profileData?.last_name}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  id="outlined-read-only-input"
                  label="Email"
                  sx={{ height: "25%", maxHeight: 50 }}
                  value={profileData?.email}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  id="outlined-read-only-input"
                  label="Phone"
                  sx={{ height: "25%", maxHeight: 50 }}
                  value={profileData?.phone}
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
            <GroupSettings {...profileData} />
          </Box>
        </Container>
      </>
    )
  );
}
