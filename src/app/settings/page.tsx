"use client";
import { useState, SetStateAction } from "react";

import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import GroupSettings from "@/components/settings/groupSettings";
import ProfileSettings from "@/components/settings/profileSettings";
import useZustandStore from "@/hooks/useZustandStore";
import { useProfileStore } from "@/stores/ProfileDataStore";

export default function Settings() {
  const profileData = useZustandStore(useProfileStore, (state) => state?.data);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const handleTabChange = (e: any, tabIndex: SetStateAction<number>) => {
    console.log(tabIndex);
    setCurrentTabIndex(tabIndex);
  };

  return (
    <>
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexFlow: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          backgroundColor: "background.default",
          overflowY: "scroll",
        }}
      >
        <Box sx={{ height: "fit-content", my: 2 }}>
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
