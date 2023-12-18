"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSupabase } from "./supabase-provider";
import { GroceryDataStore } from "@/stores/GroceryDataStore";
import { ProfileType } from "@/types";
import useZustandStore from "@/hooks/useZustandStore";
import { ProfileDataStore } from "@/stores/ProfileDataStore";
import { CommonItemsDataStore } from "@/stores/CommonItemsDataStore";
import { fetchAllItems, getAllGroceryStoresData } from "@/helpers/groceryStore";
import { getGroupData } from "@/helpers/group";
import { getProfileData } from "@/helpers/profile";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";
import { fetchAllCommonItems } from "@/helpers/commonItem";
import { ItemDataStore } from "@/stores/ItemStore";

// this component handles refreshing server data when the user logs in or out
// this method avoids the need to pass a session down to child components
// in order to re-render when the user's session changes
// #elegant!
export default function SupabaseListener({
  serverAccessToken,
}: {
  serverAccessToken?: string;
}) {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  //Profile
  const setProfileState = ProfileDataStore((state) => state.setProfileState);
  const resetProfileState = ProfileDataStore((state) => state.resetStore);

  // Grocery store
  const resetGroceryState = GroceryDataStore((state) => state.resetStore);
  const resetItemState = ItemDataStore((state) => state.resetStore);
  const GroceryStoreData = GroceryDataStore((state) => state.data);
  const CommonItemCatalog = CommonItemsDataStore((state) => state.catalog);

  // Grocery items
  // commonItems items

  const addToCatalog = CommonItemsDataStore((state) => state.addToCatalog);
  const removeFromCatalog = CommonItemsDataStore(
    (state) => state.removeFromCatalog
  );
  const updateToCatalog = CommonItemsDataStore(
    (state) => state.updateToCatalog
  );

  const selectId = useZustandStore(
    ProfileDataStore,
    (state) => state?.data?.select_id
  );
  const MINUTE_MS = 60000 * 1; // every  1  minute

  async function getGroceryData() {
    await getAllGroceryStoresData(supabase);
  }
  async function getAllItems() {
    await fetchAllItems(supabase);
  }

  // --------------------------------------------------- Select ID Watcher ---------------------------------------------------
  useEffect(() => {
    const selectIdWatcher = ProfileDataStore.subscribe(
      (state) => state.data.select_id,
      (value, oldValue) => {
        // resetGroceryState();
        if (session?.user && session?.user && session?.user?.id) {
          getProfileData(supabase, session?.user?.id);
          // fetch Grocery Store Data and common Item Data
          getAllGroceryStoresData(supabase);
          getAllItems();
          fetchAllCommonItems(supabase);
        }

        console.log(
          ` Old Select Id ending in  ${oldValue?.slice(
            -6
          )} is now ${value?.slice(-6)}`
        );
      }
    );

    return () => {
      selectIdWatcher();
    };
  }, [session?.user, supabase, selectId]);

  // --------------------------------------------------- Polling Events ---------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Refecthing Datat!");
      getGroceryData();
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  // --------------------------------------------------- Profile Listeners Events ---------------------------------------------------
  useEffect(() => {
    if (selectId) {
      const profileChannel = supabase
        .channel(`Profile - ${selectId?.slice(-4)}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${session?.user?.id}`,
          },
          (payload) => {
            console.log(payload, "New Update to Profile");
            setProfileState(payload.new as ProfileType);
          }
        )
        .subscribe();
      return () => {
        supabase.removeChannel(profileChannel);
      };
    }
  }, [selectId, session?.user?.id, setProfileState, supabase]);

  // --------------------------------------------------- Grocery Store Listeners Events ---------------------------------------------------
  useEffect(() => {
    if (selectId) {
      const storeChannel = supabase
        .channel(`Store - ${selectId?.slice(-4)}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "grocerystores",
            filter: `select_id=eq.${selectId}`,
          },
          (payload) => {
            if (payload) {
              getAllGroceryStoresData(supabase); //Change to only the store data
            }
          }
        )
        .subscribe((status, err) => {
          console.log(status, err?.message, "Store channel");
          if (
            status === REALTIME_SUBSCRIBE_STATES.CLOSED ||
            status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR ||
            status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT
          ) {
          }
        });

      return () => {
        console.log(storeChannel, "Store Channel");
        supabase.removeChannel(storeChannel);
      };
    }
  }, [GroceryStoreData, selectId, supabase]);

  // --------------------------------------------------- Grocery Store Item Events ---------------------------------------------------

  useEffect(() => {
    if (selectId) {
      const itemChannel = supabase
        .channel(`Item - ${selectId?.slice(-4)}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "grocerystoreitems",
            filter: `select_id=eq.${selectId}`,
          },
          (payload) => {
            if (payload) {
              getAllGroceryStoresData(supabase);
              getAllItems();
            }
          }
        )
        .subscribe((status, err) => {
          if (
            status === REALTIME_SUBSCRIBE_STATES.CLOSED ||
            status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR ||
            status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT
          ) {
          }
        });

      return () => {
        supabase.removeChannel(itemChannel);
      };
    }
  }, [GroceryStoreData, selectId, supabase]);

  // --------------------------------------------------- Common Item Listeners Events ---------------------------------------------------

  useEffect(() => {
    if (selectId) {
      const commonItemChannel = supabase
        .channel(`Common Item: ${selectId?.slice(-4)}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "commonitems" },
          (payload) => {
            console.log(payload, "Event happened on commonitems tables");
            fetchAllCommonItems(supabase);
          }
        )
        .subscribe((status, err) =>
          console.log(status, err, "commonItemChannel")
        );

      return () => {
        supabase.removeChannel(commonItemChannel);
      };
    }
  }, [selectId, supabase]);

  // --------------------------------------------------- Group Listeners Events ---------------------------------------------------

  useEffect(() => {
    const groupChannel = supabase
      .channel(`Group - ${selectId?.slice(-4)}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "groups",
        },
        (payload) => {
          console.log(payload, "group data changed?");
          getGroupData(supabase);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(groupChannel);
    };
  }, [selectId, supabase]);

  // --------------------------------------------------- Auth Listeners Events ---------------------------------------------------
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "SIGNED_IN" && session && session.user) {
        const profile = await getProfileData(supabase, session.user.id);
        if (profile) {
          await fetchAllItems(supabase);
          await getAllGroceryStoresData(supabase);
          router.push("/dashboard");
          if (profile.in_group) {
            await getGroupData(supabase);
          }
          
        } else {
          throw new Error("No Profile found");
        }
      }
    });

    supabase.auth.onAuthStateChange((event, session) => {
      if (event == "SIGNED_OUT" || !session) {
        router.push("/login");
        console.log("Signed Out Event in the listener or no session detected ");
        resetGroceryState();
        resetItemState();
        resetProfileState();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverAccessToken) {
        // server and client are out of sync
        // reload the page to fetch fresh server data
        // https://beta.nextjs.org/docs/data-fetching/mutating
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [
    serverAccessToken,
    router,
    supabase,
    resetProfileState,
    resetGroceryState,
    resetItemState,
  ]);
  return null;
}
