"use client";
import { Container } from "@mui/material";
import SettingsHeader from "../components/settings/settingsHeader";
import ProfileSettings from "../components/settings/profileSettings";

export default function Settings() {
  return (
    <>
      <SettingsHeader />
      <Container
        maxWidth={false}
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
          border: 2,
        }}
        style={{ flexShrink: 0 }}
      >
<ProfileSettings/>
      </Container>
    </>
  );
}
