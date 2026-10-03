import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Damacii Studios — Web Design, Interior 3D + Content Creation",
  description: "Damacii Studios creates websites, 3D interior designs, content, and advertising campaigns.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
