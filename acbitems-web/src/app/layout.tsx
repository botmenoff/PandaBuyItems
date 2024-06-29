import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Home } from "@/pages/home";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ACBItems",
  description: "ACB items but beautifully displayed",
  icons: "../../public/TNlogo.png"
};

export default function RootLayout({
children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Home></Home>
      </body>
    </html>
  );
}
