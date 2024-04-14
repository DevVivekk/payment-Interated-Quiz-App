import { Inter } from "next/font/google";
import "./globals.scss";
import Mainredux from "@/redux/mainredux";
import Navbar from "@/Components/navbar/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Mainredux>
        <Navbar />
        {children}
        </Mainredux>
      </body>
    </html>
  );
}