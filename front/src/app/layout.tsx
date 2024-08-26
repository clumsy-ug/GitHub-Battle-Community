// footerとかheaderとかを共通化するためのファイル？

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";  // 最初は、これ読み込むと変になった

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GitHub Battle",
  description: "GitHub開発者のプラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
