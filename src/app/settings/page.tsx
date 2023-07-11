"use client";
import { Box, Container, Tab, Tabs } from "@mui/material";
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
      <SettingsHeader />
      <Container
        sx={{
          height: "85%",
          display: "flex",
          flexFlow: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          backgroundColor: "primary.light",
          overflowY: "scroll",
          gap: 3.5,
          py: 4,
        }}
        style={{ flexShrink: 0 }}
      >
        {/* put the pull to refresh here.? */}

        <Box
          sx={{
          }}
        >
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
