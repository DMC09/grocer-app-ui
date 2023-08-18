"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSupabase } from "./supabase-provider";
import {
  GroceryDataStore,
  findGroceryStoreIndex,
  getGroceryStoreItemIndex,
} from "@/stores/GroceryDataStore";
import {
  CommonItemType,
  GroceryStoreItemType,
  GroceryStoreWithItemsType,
  ProfileType,
} from "@/types";

import useZustandStore from "@/hooks/useZustandStore";
import { ProfileDataStore } from "@/stores/ProfileDataStore";
import { CommonItemsDataStore } from "@/stores/CommonItemsDataStore";
import { getAllGroceryStoresData } from "@/helpers/groceryStore";
import { getGroupData } from "@/helpers/group";
import { getProfileData } from "@/helpers/profile";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";

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
  const CommonItemCatalog = CommonItemsDataStore((state) => state.catalog);

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
  const MINUTE_MS = 60000 * 1; // every  1  minute

  async function getGroceryData() {
    await getAllGroceryStoresData(supabase);
  }

  // --------------------------------------------------- Select ID Watcher ---------------------------------------------------
  useEffect(() => {
    const selectIdWatcher = ProfileDataStore.subscribe(
      (state) => state.data.select_id,
      (value, oldValue) => {
        resetGroceryState();
        if (session?.user && session?.user && session?.user?.id) {
          getProfileData(supabase, session?.user?.id);
        }
        console.log(
          ` Old Select Id ending in  ${oldValue?.slice(-6)} is now ${value?.slice(
            -6
          )}`
        );
      }
    );

    return () => {
      selectIdWatcher();
    };
  }, [supabase]);

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
            event: "INSERT",
            schema: "public",
            table: "grocerystores",
            filter: `select_id=eq.${selectId}`,
          },
          (payload) => {
            if (payload && payload?.new && payload?.new?.id) {
              const addedToState = GroceryStoreData.some(
                (groceryStore) => groceryStore.id === payload?.new?.id
              );

              if (!addedToState) {
                console.log(
                  `%cListener: - Adding new store ${payload.new.name} `,
                  "color: white; background-color: #AB7D00;",
                  payload.new
                );
                // ! Fetch Data Again
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
          },
          (payload) => {

            if (payload && payload?.new && payload?.new?.id) {
              const currentGroceryStoreObjectIndex = GroceryStoreData.findIndex(
                (grocerystore) => grocerystore.id == payload.new.id
              );
              const currentGroceryStoreObject =
                GroceryStoreData[currentGroceryStoreObjectIndex];

              const areObjectsEqual = Object.is(
                currentGroceryStoreObject,
                payload.new
              );

              if (!areObjectsEqual) {
                console.log(
                  `%cListener: - Updating Store ${currentGroceryStoreObject?.name} `,
                  "color: white; background-color: #AB7D00;",
                  payload.new
                );
                // ! Fetch Data Again
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

              const storeToBeRemoved = GroceryStoreData.filter(
                (store) => store.id === payload?.old.id
              )?.[0];

              const inGroceryStoreData = GroceryStoreData.some(
                (groceryStore) => groceryStore.id === storeId
              );

              if (inGroceryStoreData) {
                console.log(
                  `%cListener: - Deleting store ${storeToBeRemoved.name} `,
                  "color: white; background-color: #AB7D00;",
                  storeToBeRemoved
                );
                // ! Fetch Data Again

                deleteGroceryStore(storeId);
              }
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
            console.log("bad state");
          }
        });

      return () => {
        console.log(storeChannel, "Store Channel");
        supabase.removeChannel(storeChannel);
      };
    }
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
    if (selectId) {
      const itemChannel = supabase
        .channel(`Item - ${selectId?.slice(-4)}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "grocerystoreitems",
            filter: `select_id=eq.${selectId}`,
          },
          (payload) => {
            console.log(payload, "After inserting a grocery store item");

            const groceryStoreIndex = findGroceryStoreIndex(
              GroceryStoreData,
              payload.new.id
            );

            if (payload && payload?.new && payload?.new?.id) {
              const itemAddedToState = GroceryStoreData[
                groceryStoreIndex
              ]?.grocerystoreitems?.some(
                (item) => item?.id === payload?.new?.id
              );

              console.log(itemAddedToState, "Item Added to State?");

              if (!itemAddedToState) {
                console.log(
                  `%cListener: - Adding new item ${payload.new.name} `,
                  "color: white; background-color: #AB7D00;",
                  payload.new
                );
                // ! Fetch Data Again
                addNewitem(payload.new as GroceryStoreItemType);
              }
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "grocerystoreitems",
            filter: `select_id=eq.${selectId}`,
          },
          (payload) => {
            console.log(payload, "After an update");

            const groceryStoreIndex = findGroceryStoreIndex(
              GroceryStoreData,
              payload.old.id
            );

            const groceryStoreItemIndex = getGroceryStoreItemIndex(
              GroceryStoreData,
              groceryStoreIndex,
              payload.old.id
            );

            const currentObject =
              GroceryStoreData[groceryStoreIndex]?.grocerystoreitems[
                groceryStoreItemIndex
              ];

            const isObjectTheSame = Object.is(currentObject, payload.new);

            if (!isObjectTheSame) {
              // ! Fetch Data Again
              console.log("updating the item in the listner");
              updateItem(payload.new as GroceryStoreItemType);
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "grocerystoreitems",
            filter: `select_id=eq.${selectId}`,
          },
          (payload) => {
            console.log(payload, "Delete item payload");
            if (payload && payload?.old && payload?.old?.id) {
              const storeIndex = findGroceryStoreIndex(
                GroceryStoreData,
                payload.old.id
              );

              const itemIndex = getGroceryStoreItemIndex(
                GroceryStoreData,
                storeIndex,
                payload.old.id
              );

              // const itemToBeDeleted =
              const isDeletedIdInState = GroceryStoreData[
                storeIndex
              ]?.grocerystoreitems.some((item) => item.id === payload.old.id);

              console.log(isDeletedIdInState, "In the listenr!");
              if (isDeletedIdInState) {
                // ! Fetch Data Again
                console.log(
                  `%cListener: - Deleting item from store ${GroceryStoreData[storeIndex].name} `,
                  "color: white; background-color: #AB7D00;",
                  GroceryStoreData[storeIndex]?.grocerystoreitems[itemIndex]
                );

                deleteItem(payload.old.id);
              }
            }
          }
        )
        .subscribe((status, err) => {
          console.log(status, err, "item channel");
          if (
            status === REALTIME_SUBSCRIBE_STATES.CLOSED ||
            status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR ||
            status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT
          ) {
            console.log("Bad Status");
          }
          console.log(status, err, "item channel");
        });

      return () => {
        console.log(itemChannel, "item channel");
        supabase.removeChannel(itemChannel);
      };
    }
  }, [
    GroceryStoreData,
    addNewitem,
    deleteItem,
    selectId,
    supabase,
    updateItem,
  ]);

  // --------------------------------------------------- Common Item Listeners Events ---------------------------------------------------

  useEffect(() => {
    if (selectId) {
      const commonItemChannel = supabase
        .channel(`Common Item: ${selectId?.slice(-4)}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "commonitems" },
          (payload) => {
            console.log(payload, "After an insert to the commonitems tables");
            // ! Fetch Data Again
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
            // ! Fetch Data Again
            removeFromCatalog(payload.old.id);

            // TODO: function
          }
        )
        .subscribe((status, err) =>
          console.log(status, err, "commonItemChannel")
        );

      return () => {
        supabase.removeChannel(commonItemChannel);
      };
    }
  }, []);

  // --------------------------------------------------- Group Listeners Events ---------------------------------------------------

  useEffect(() => {
    const groupChannel = supabase
      .channel(`Group - ${selectId?.slice(-4)}`)
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
      .subscribe((status, err) => console.log(status, err, "group channel"));

    return () => {
      supabase.removeChannel(groupChannel);
    };
  }, [selectId, supabase]);

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

  // useEffect(() => {
  //   const channelA = supabase.channel("room-1");

  //   channelA
  //     .on("presence", { event: "sync" }, () => {
  //       const newState = channelA.presenceState();
  //       console.log("Sync Event", newState);
  //     })
  //     .on("presence", { event: "join" }, ({ key, newPresences }) => {
  //       console.log("Join Event", key, newPresences);
  //     })
  //     .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
  //       console.log("Leave Event", key, leftPresences);
  //     })
  //     .subscribe(async (status) => {
  //       console.log(status, "Status?");
  //       //we need to check if we are the only ones otherwise normal trakcpfor
  //       if (status === "SUBSCRIBED") {
  //         setTimeout(async () => {
  //           //so this works wee need to see the length, then determine if we need to track data.
  //           const syncedState = channelA.presenceState();
  //           console.log(syncedState, "state in callback!");

  //           const clone = structuredClone(syncedState);

  //           const length = Object.keys(clone);
  //           console.log(length, "keys in callback!");
  //           console.log(
  //             JSON.stringify(syncedState),
  //             "STRINGIGYPFOR in callback!"
  //           );

  //           if (length.length === 1) {
  //             const presenceTrackStatus = await channelA.track({
  //               groceryData: GroceryStoreData,
  //               commonItemsData: CommonItemCatalog,
  //             });
  //           }
  //         }, 3000);

  //         // set the state from what I get from here.
  //       }
  //     });

  //   return () => {
  //     supabase.removeChannel(channelA);
  //   };
  // }, [CommonItemCatalog, GroceryStoreData, supabase]);
}
