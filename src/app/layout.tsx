import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "D3.js",
  description: "D3.js implemetaion with next.js TS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
