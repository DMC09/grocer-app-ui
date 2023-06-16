"use client";

import { Settings, Logout } from "@mui/icons-material";
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSupabase } from "./supabase/supabase-provider";
import { useRouter } from "next/navigation";
import { ProfileType } from "@/types";
import { User } from "@supabase/supabase-js";

export default function HeaderMenu() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<User | undefined>(session?.user);
  const open = Boolean(anchorEl);
  const [profile, setProfile] = useState<ProfileType | null>(null);



  useEffect(() => {
    const channel = supabase
      .channel("custom-profiles-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user?.id}`
        },
        getProfileData
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  async function getProfileData() {
    console.log("getting the profiles data");
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();
    if (error) {
      throw new Error(error.message);
    } else {
      profile && setProfile(profile as ProfileType);
    }
  }

  useEffect(() => {
    getProfileData();
  }, [supabase]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        {profile?.avatar_url && (
          <Avatar
            sx={{ width: 32, height: 32 }}
            src={`${process.env.NEXT_PUBLIC_SUPABASE_PROFILE}/${profile?.avatar_url}`}
          />
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem> */}
        <MenuItem onClick={() => router.push("/settings")}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
          {/* need to add the signout finctionliaty to the onClick handlers  */}
        </MenuItem>
      </Menu>
    </>
  );
}
