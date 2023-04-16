"use client";

import { useEffect } from "react";
import { useSupabase } from "../supabase-provider";

export default function GroceryStoreItem(data: any) {
  const { supabase } = useSupabase();

  useEffect(() => {
    const channel = supabase.channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'grocerystores' },
      (payload) => {
        console.log('Change received!', payload)
      }
    )
    .subscribe()

    return () => {
        supabase.removeChannel(channel)
    };
  }, [supabase]);

  return <p>{data.name}</p>;
}
