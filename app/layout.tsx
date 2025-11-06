import { Navigation } from "./_components/navigation";
import "./globals.css";

export const metadata = {
  title: "Moja Aplikacija",
  description: "Opis aplikacije",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
