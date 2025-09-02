import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Retro Gaming Hub",
  description: "A forum for retro gaming enthusiasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-slate-100 flex flex-col min-h-screen`}>
        <AuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer /> 
        </AuthProvider>
      </body>
    </html>
  );
}
