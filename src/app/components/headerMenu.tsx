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
import { getProfileData } from "../utils/client/profile";

export default function HeaderMenu() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<User | undefined>(session?.user);
  const open = Boolean(anchorEl);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  async function getData() {
    const data = await getProfileData(supabase, user?.id);
    data && setProfile(data as ProfileType);
  }

  useEffect(() => {
    const channel = supabase
      .channel("custom-profiles-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        (payload) => console.log(payload, "update")
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    if (user?.id) {
      getData();
    }
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
            src={
              `${process.env.NEXT_PUBLIC_SUPABASE_PROFILE}/${profile?.avatar_url}` ||
              ""
            }
          />
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
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
        </MenuItem>
      </Menu>
    </>
  );
}
