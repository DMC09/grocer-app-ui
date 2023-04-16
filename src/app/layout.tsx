import Header from './components/header'
import './globals.css'
import SupabaseProvider from './supabase-provider'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  
  return (
    <html lang="en">
      <body>        
      <SupabaseProvider>
        <Header />
        {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
