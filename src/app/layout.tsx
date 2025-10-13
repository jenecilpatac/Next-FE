import localFont from "next/font/local";
import "./assets/styles/globals.css";
import { AuthProvider } from "./context/AuthContext";
import BaseContent from "./components/BaseContent";
import "toastr/build/toastr.min.css";
import { Providers } from "./context/providers";

const geistSans = localFont({
  src: "./assets/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./assets/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: {
    default: "Blog App",
    template: "Blog App | %s",
  },
  description:
    "Allan Justine Mascariñas, Website, Blog App, Tallies, NBA Teams, NBA Schedules, NBA Games, Todo List, Todos, React, Next.js, Laravel, Livewire, Tailwind CSS, Bootstrap, Post a Blog, Postings, Post a content",
  keywords:
    "Allan Justine Mascariñas, Website, Blog App, Tallies, NBA Teams, NBA Schedules, NBA Games, Todo List, Todos, React, Next.js, Laravel, Livewire, Tailwind CSS, Bootstrap, Post a Blog, Postings, Post a content",
  openGraph: {
    title: "Blog App",
    description:
      "Allan Justine Mascariñas, Website, Blog App, Tallies, NBA Teams, NBA Schedules, NBA Games, Todo List, Todos, React, Next.js, Laravel, Livewire, Tailwind CSS, Bootstrap, Post a Blog, Postings, Post a content",
    images: [
      {
        url: "https://cdn-icons-png.flaticon.com/128/2065/2065254.png",
      },
    ],
    type: "website",
    siteName: "Blog App - Todos - NBA - Posts - Chats",
  },
  manifest: "manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressContentEditableWarning>
      <head>
        <meta name="author" content="Allan Justine Mascariñas" />

        <link
          rel="stylesheet"
          href="https://site-assets.fontawesome.com/releases/v6.6.0/css/all.css"
        />

        <link
          rel="stylesheet"
          href="https://site-assets.fontawesome.com/releases/v6.6.0/css/sharp-duotone-solid.css"
        />

        <link
          rel="stylesheet"
          href="https://site-assets.fontawesome.com/releases/v6.6.0/css/sharp-thin.css"
        />

        <link
          rel="stylesheet"
          href="https://site-assets.fontawesome.com/releases/v6.6.0/css/sharp-solid.css"
        />

        <link
          rel="stylesheet"
          href="https://site-assets.fontawesome.com/releases/v6.6.0/css/sharp-regular.css"
        />

        <link
          rel="stylesheet"
          href="https://site-assets.fontawesome.com/releases/v6.6.0/css/sharp-light.css"
        />

        <link
          rel="shortcut icon"
          href="https://cdn-icons-png.flaticon.com/128/2065/2065254.png"
          type="image/x-icon"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Providers>
            <BaseContent children={children} />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
