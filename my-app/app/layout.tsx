import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

//Website Font
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],

  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

//Website Title and Description
export const metadata: Metadata = {
  title: "File Storage",
  description: "Fast Online File Sharing",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("font-sans", poppins.variable)}>
      <body className="flex font-poppins poppins antialiased min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}
