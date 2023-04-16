import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/headers";
import LoginPage from "./login/page";
import Dashboard from "./dashboard/page";
import { useRouter } from "next/navigation";


// do not cache this page
export const revalidate = 120;

export default async function HomePage() {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  });


  const {data:sessionData, error:sessionError} = await supabase.auth.getSession();
  const user = await sessionData?.session?.user;

  // console.log(sessionData, "session");
  // console.log(user,"user")


  const { data,error } = await supabase
    .from("grocerystores")
    .select("*,grocerystoreitems(*)");



 
  return !user ? <LoginPage/> : <Dashboard data={data}/>;
}
