"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSupabase } from "./supabase-provider";
import {
  GroceryDataStore,
  findGroceryStoreIndex,
  findGroceryStoreItemIndexInStore,
} from "@/stores/GroceryDataStore";
import {
  CommonItemType,
  GroceryStoreItemType,
  GroceryStoreWithItemsType,
  ProfileType,
} from "@/types";
import { getProfileData } from "@/helpers/client/profile";

import {
  deleteGroceryStore,
  getAllGroceryStoresData,
} from "@/helpers/client/groceryStore";

import { getGroupData } from "@/helpers/client/group";
import useZustandStore from "@/hooks/useZustandStore";
import { ProfileDataStore } from "@/stores/ProfileDataStore";
import { CommonItemsDataStore } from "@/stores/CommonItemsDataStore";

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
  const GroceryStoreData = GroceryDataStore((state) => state.data);

  const addNewGroceryStore = GroceryDataStore(
    (state) => state.addNewGroceryStore
  );
  const deleteGroceryStore = GroceryDataStore(
    (state) => state.deleteGroceryStore
  );
  const updatedGroceryStore = GroceryDataStore(
    (state) => state.updateGroceryStore
  );

  // Grocery items

  const addNewitem = GroceryDataStore((state) => state.insertGroceryItem);
  const deleteItem = GroceryDataStore((state) => state.deleteGroceryItem);
  const updateItem = GroceryDataStore((state) => state.updateGroceryItem);
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
  const MINUTE_MS = 60000 * 10; // every  10  minutes

  async function getGroceryData() {
    await getAllGroceryStoresData(supabase);
  }

  // --------------------------------------------------- Select ID Water ---------------------------------------------------
  useEffect(() => {
    const selectIdWatcher = ProfileDataStore.subscribe(
      (state) => state.data.select_id,
      (value, oldValue) => {
        resetGroceryState();
        if (session?.user && session?.user && session?.user?.id) {
          getProfileData(supabase, session?.user?.id);
          //grab the ne wdata
        }
        console.log(value, oldValue, "Select Id changed!");
      }
    );

    return () => {
      selectIdWatcher();
    };
  }, [supabase]);

  // --------------------------------------------------- Polling Events ---------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Refreshing data!");
      getGroceryData();
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  // --------------------------------------------------- Profile Listeners Events ---------------------------------------------------
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
  }, [session?.user?.id, setProfileState, supabase]);

  // --------------------------------------------------- Grocery Store Listeners Events ---------------------------------------------------
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
          console.log(payload, "Insert for Grocery Store");

          if (payload && payload?.new && payload?.new?.id) {
            const addedToState = GroceryStoreData.some(
              (groceryStore) => groceryStore.id === payload?.new?.id
            );

            if (!addedToState) {
              console.log(
                addedToState,
                "Added the store to state via the listener since it's not there!"
              );
              addNewGroceryStore(payload.new as GroceryStoreWithItemsType);
            }
          }
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
            const currentGroceryStoreObjectIndex = GroceryStoreData.findIndex(
              (grocerystore) => grocerystore.id == payload.new.id
            );
            console.log(currentGroceryStoreObjectIndex, "index");

            //compoare the payload.new to the current object with that ide
            const currentGroceryStoreObject =
              GroceryStoreData[currentGroceryStoreObjectIndex];

            console.log(currentGroceryStoreObject, "current object");
            console.log(payload.new, "payload object object");

            const areObjectsEqual = Object.is(
              currentGroceryStoreObject,
              payload.new
            );

            if (!areObjectsEqual) {
              console.log(
                areObjectsEqual,
                "Welp looks like we need to update the state in the listner"
              );

              updatedGroceryStore(payload.new as GroceryStoreWithItemsType);
            }
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
          if (payload && payload?.old && payload?.old.id) {
            const storeId = Number(payload?.old?.id);
            console.log(storeId, "in the listenre");

            const inGroceryStoreData = GroceryStoreData.some(
              (groceryStore) => groceryStore.id === storeId
            );

            console.log(inGroceryStoreData, "in the state stiillp");
            if (inGroceryStoreData) {
              console.log(storeId, "Deleting Store in listener");
              deleteGroceryStore(storeId);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    GroceryStoreData,
    addNewGroceryStore,
    deleteGroceryStore,
    selectId,
    supabase,
    updatedGroceryStore,
  ]);

  // --------------------------------------------------- Grocery Store Item Events ---------------------------------------------------

  useEffect(() => {
    const channel = supabase
      .channel("alt-grocerystoreitems-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "grocerystoreitems" },
        (payload) => {
          console.log(payload, "After inserting a grocery store item");

          const groceryStoreIndex = findGroceryStoreIndex(
            GroceryStoreData,
            payload.new.id
          );

          if (payload && payload?.new && payload?.new?.id) {
            const itemFoundInState = GroceryStoreData[
              groceryStoreIndex
            ].grocerystoreitems.some((item) => item.id === payload?.new?.id);

            if (!itemFoundInState) {
              console.log(
                "Well it look like we have to add the item via the listener"
              );
              addNewitem(payload.new as GroceryStoreItemType);
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "grocerystoreitems" },
        (payload) => {
          console.log(payload, "After an update");

          const groceryStoreIndex = findGroceryStoreIndex(
            GroceryStoreData,
            payload.old.id
          );

          const groceryStoreItemIndex = findGroceryStoreItemIndexInStore(
            GroceryStoreData,
            groceryStoreIndex,
            payload.old.id
          );

          const currentObject =
            GroceryStoreData[groceryStoreIndex].grocerystoreitems[
              groceryStoreItemIndex
            ];

          const isObjectTheSame = Object.is(currentObject, payload.new);

          if (!isObjectTheSame) {
            console.log("updating the item in the listner");
            updateItem(payload.new as GroceryStoreItemType);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "grocerystoreitems" },
        (payload) => {
          console.log(payload, "After a delete an item!");

          const groceryStoreIndex = findGroceryStoreIndex(
            GroceryStoreData,
            payload.old.id
          );

          const isDeletedIdInState = GroceryStoreData[
            groceryStoreIndex
          ].grocerystoreitems.some((item) => item.id === payload.old.id);
          // tricky becase we only have the id of the item?

          if (isDeletedIdInState) {
            console.log("well we gotta delete this in the listern");
            deleteItem(payload.old.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [GroceryStoreData, addNewitem, deleteItem, supabase, updateItem]);

  // --------------------------------------------------- Common Item Listeners Events ---------------------------------------------------

  useEffect(() => {
    const channel = supabase
      .channel("alt-commonitems-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "commonitems" },
        (payload) => {
          console.log(payload, "After an insert to the commonitems tables");
          addToCatalog(payload.new as CommonItemType);
          // TODO: function
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "commonitems" },
        (payload) => {
          console.log(payload, "After an update to the commonitems tables");
          updateToCatalog(payload.new as CommonItemType);
          // TODO: function
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "commonitems" },
        (payload) => {
          console.log(
            payload,
            "After a delete an item to the commonitems tables"
          );
          removeFromCatalog(payload.old.id);

          // TODO: function
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addNewitem, deleteItem, supabase, updateItem]);

  // --------------------------------------------------- Group Listeners Events ---------------------------------------------------

  useEffect(() => {
    const channel = supabase
      .channel("custom-grouping-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "groups",
        },
        () => {
          getGroupData(supabase);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "groups",
        },
        () => {
          getGroupData(supabase);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "groups",
        },
        () => {
          getGroupData(supabase);
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // --------------------------------------------------- Auth Listeners Events ---------------------------------------------------
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
        resetGroceryState();
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
  ]);

  return null;
}
