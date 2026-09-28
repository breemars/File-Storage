import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

//Website Font
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

import { Bangers } from "next/font/google";

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: "400",
});


//Website Title and Description
export const metadata: Metadata = {
  title: "File Storage",
  description: "Fast Online File Sharing",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={poppins.variable}
    >
      <body className="antialiased min-h-full flex flex-col">{children}</body>
    </html>
  );
}
