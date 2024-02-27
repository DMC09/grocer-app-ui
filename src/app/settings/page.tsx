"use client";
import { useState, SetStateAction } from "react";

import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import GroupSettings from "@/components/settings/groupSettings";
import ProfileSettings from "@/components/settings/profileSettings";
import useZustandStore from "@/hooks/useZustandStore";
import { ProfileDataStore } from "@/stores/ProfileDataStore";
import CommonItemsSettings from "@/components/settings/commonItemsSettings";
import CategoriesSettings from "@/components/settings/categoriesSettings";

export default function Settings() {
  const profileData = useZustandStore(ProfileDataStore, (state) => state?.data);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const handleTabChange = (e: any, tabIndex: SetStateAction<number>) => {
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flexStart",
          }}
        >
          <Tabs
            value={currentTabIndex}

            variant="scrollable"
            onChange={handleTabChange}
            allowScrollButtonsMobile
            sx={{
              width: "90%",
            }}
          >
            <Tab sx={{}} label="Profile" />
            <Tab sx={{}} label="Group" />
            <Tab sx={{}} label="Categories" />
            <Tab sx={{}} label="Common Items" />
          </Tabs>
        </Box>
        {currentTabIndex === 0 && <ProfileSettings />}
        {currentTabIndex === 1 && profileData && (
          <GroupSettings {...profileData} />
        )}
        {currentTabIndex === 3 && <CommonItemsSettings />}
        {currentTabIndex === 2 && <CategoriesSettings />}
      </Container>
    </>
  );
}
