import { Session } from "@supabase/supabase-js";
import "./globals.css";
import SupabaseListener from "@/components/supabase/supabase-listener";
import { createServerClient } from "@/helpers/supabase.server";
import SupabaseProvider from "@/components/supabase/supabase-provider";
import Header from "@/components/header/header";

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
