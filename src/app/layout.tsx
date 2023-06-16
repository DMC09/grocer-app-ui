import { Session } from "@supabase/supabase-js";
import Header from "./components/header";
import "./globals.css";
import SupabaseProvider from "./components/supabase/supabase-provider";
import { createServerClient } from "./utils/supabase.server";
import SupabaseListener from "./components/supabase/supabase-listener";

export const metadata = {
  title: "Grocer App",
  description: "Keep track of your groceries with ease!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        <div id="app">
          <SupabaseProvider session={session}>
            <SupabaseListener serverAccessToken={session?.access_token} />

            <Header />
            {children}
          </SupabaseProvider>
        </div>
      </body>
    </html>
  );
}
