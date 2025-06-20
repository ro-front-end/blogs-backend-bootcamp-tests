import { Orbitron, Roboto } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/store/ReduxProvider";
import NavBar from "@/components/topbar/navBar";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "900"],
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "900"],
});

export const metadata = {
  title: "Techy-Blog",
  description:
    "Keep updated with the tech world, AI, videoGames, gadgets and share ideas!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/cover-image.png" />
      </head>
      <body className={`${roboto.className} antialiased`}>
        <div className="p-4">
          <ReduxProvider>
            <NavBar className={`${orbitron.className}`} />
            <div className="mt-2">{children}</div>
          </ReduxProvider>
        </div>
      </body>
    </html>
  );
}
