import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from '@/context/AuthContext'
import ClientLayout from './client-layout'
import { metadata } from './metadata'
import PixelCursor from "@/components/PixelCursor";
import StarTrail from "@/components/StarTrail";

const inter = Inter({ subsets: ["latin"] });

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} dark:bg-[#0A0A0A] dark:text-white bg-white text-gray-900 transition-colors select-none`}>
        <PixelCursor />
        <StarTrail />
        <ClientLayout>
          <ThemeProvider>
            <AuthProvider>
              <Header />
              {children}
            </AuthProvider>
          </ThemeProvider>
        </ClientLayout>
      </body>
    </html>
  );
}
