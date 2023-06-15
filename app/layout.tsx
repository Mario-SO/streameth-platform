import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import GeneralContext from "@/components/context/GeneralContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GeneralContext>{children}</GeneralContext>
      </body>
    </html>
  );
}
