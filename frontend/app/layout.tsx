import Navbar from "@/components/Navbar";
import Providers from "./_providers/Providers";
import "./globals.css";
import { Inter } from "next/font/google";

import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SpiralDAO",
  description: "SpiralDAO website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ToastContainer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
