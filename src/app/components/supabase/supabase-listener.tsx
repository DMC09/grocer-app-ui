"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSupabase } from "./supabase-provider";
import { useGroceryStoreStore, useProfileStore } from "@/state/store";
import { GroceryStoreItemType, GroceryStoreWithItemsType, ProfileType } from "@/types";
import { getProfileData } from "@/app/utils/client/profile";
import useStore from "@/app/hooks/useStore";
import {
  deleteGroceryStore,
  getAllGroceryStoresalt,
} from "@/app/utils/client/groceryStore";

// this component handles refreshing server data when the user logs in or out
// this method avoids the need to pass a session down to child components
// in order to re-render when the user's session changes

// one channle per tings so just move them here.
// #elegant!
export default function SupabaseListener({
  serverAccessToken,
}: {
  serverAccessToken?: string;
}) {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const setProfileState = useProfileStore((state) => state.setProfileState);
  const resetStore = useProfileStore((state) => state.resetStore);

  const addNewGroceryStore = useGroceryStoreStore(
    (state) => state.addNewGroceryStore
  );
  const deleteGroceryStore = useGroceryStoreStore(
    (state) => state.deleteGroceryStore
  );
  const updatedGroceryStore = useGroceryStoreStore(
    (state) => state.updateGroceryStore
  );

  const addNewitem = useGroceryStoreStore((state) => state.insertGroceryItem);
  const selectId = useStore(useProfileStore, (state) => state?.data?.select_id);
  const MINUTE_MS = 60000 * 15; // every  5  minute

  async function getGroceryData() {
    await getAllGroceryStoresalt(supabase);
  }
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Fetching the data every minte?");
      getGroceryData();
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("alt-profiles-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${session?.user?.id}`,
        },
        (payload) => {
          console.log(payload, "updates in profile??");
          setProfileState(payload.new as ProfileType);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    const channel = supabase
      .channel("alt-grocerystore-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "grocerystores",
          filter: `select_id=eq.${selectId}`,
        },
        (payload) => {
          console.log(payload, "We just inserted a grocery store!");
          if (payload && payload?.new && payload?.new?.id)
            addNewGroceryStore(payload.new as GroceryStoreWithItemsType);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "grocerystores",
          filter: `select_id=eq.${selectId}`,
        },
        (payload) => {
          console.log(payload, "After an update");
          if (payload && payload?.new && payload?.new?.id) {
            updatedGroceryStore(payload.new as GroceryStoreWithItemsType);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "grocerystores",
          filter: `select_id=eq.${selectId}`,
        },
        (payload) => {
          console.log(payload, "After a deleted grocery store");
          if (payload && payload?.old && payload?.old.id) {
            const storeId = Number(payload?.old?.id);
            console.log(storeId, "store id ");
            deleteGroceryStore(storeId);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    addNewGroceryStore,
    deleteGroceryStore,
    selectId,
    supabase,
    updatedGroceryStore,
  ]);
  useEffect(() => {
    const channel = supabase
      .channel("alt-grocerystoreitems-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "grocerystoreitems" },
        (payload) => {
          console.log(payload, "After an insert")
          addNewitem(payload.new as GroceryStoreItemType)
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "grocerystoreitems" },
        (payload) => console.log(payload, "After an update")
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "grocerystoreitems" },
        (payload) => {
          console.log(payload, "After a delete an item!");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addNewitem, supabase]);

  useEffect(() => {
    // what there is no session, redirect to the login
    //because of this code block I am constantly getting the profile data and setting if I make a change...
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "SIGNED_IN" && session && session.user) {
        await getProfileData(supabase, session.user.id);
        router.push("/dashboard"); // this is cuainsg constant kickbacs to the dasbhaord.
      }
    });

    supabase.auth.onAuthStateChange((event, session) => {
      if (event == "SIGNED_OUT" || !session) {
        router.push("/login");
        console.log("Signed Out Event in the listener or no session detected ");
        resetStore();
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
  }, [serverAccessToken, router, supabase]);

  return null;
}
