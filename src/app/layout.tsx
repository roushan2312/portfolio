import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roushan Barnwal | Backend Engineer",
  description:
    "Portfolio of Roushan Kumar Barnwal, a backend engineer working across APIs, AWS, Salesforce, and cloud systems.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
