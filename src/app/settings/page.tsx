"use client";
import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import SettingsHeader from "../components/settings/settingsHeader";
import ProfileSettings from "../components/settings/profileSettings";
import { useState, SetStateAction } from "react";
import GroupSettings from "../components/settings/groupSettings";
import useStore from "../hooks/useStore";
import { useProfileStore } from "@/state/ProfileStore";

export default function Settings() {
  const profileData = useStore(useProfileStore, (state) => state?.data);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const handleTabChange = (e: any, tabIndex: SetStateAction<number>) => {
    console.log(tabIndex);
    setCurrentTabIndex(tabIndex);
  };

  return (
    <>

      <Container
        sx={{
          height: "100%",
          display: "flex",
          flexFlow: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          backgroundColor: "primary.light",
          overflowY: "scroll",
        }}
        style={{ flexShrink: 0 }}
      >
        <Box sx={{ height: "fit-content",my:2 }}>
          <Typography align="center" color="primary.main" variant="h3">
            Settings
          </Typography>
        </Box>

        <Box sx={{}}>
          <Tabs value={currentTabIndex} onChange={handleTabChange}>
            <Tab label="Profile" />
            <Tab label="Group" />
          </Tabs>
        </Box>
        {currentTabIndex === 0 && <ProfileSettings />}
        {currentTabIndex === 1 && profileData && (
          <GroupSettings {...profileData} />
        )}
      </Container>
    </>
  );
}
