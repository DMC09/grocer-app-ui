import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/headers";
import LoginPage from "./login/page";
import Dashboard from "./dashboard/page";
import { useRouter } from "next/navigation";
import { GroceryStoreType } from "@/types";

// do not cache this page
export const revalidate = 0;

export default async function HomePage() {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  });

  const { data: sessionData } = await supabase.auth.getSession();
  const user = await sessionData?.session?.user;

  return (
    <>
    
    {  user ? <Dashboard /> : <LoginPage />}
    </>
  );
}
