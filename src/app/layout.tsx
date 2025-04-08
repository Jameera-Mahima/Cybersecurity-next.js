import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CS Platform",
  description: "Computer Science Learning Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main style={styles.main}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

const styles = {
  main: {
    minHeight: 'calc(100vh - 80px)',
    padding: '2rem 0',
    backgroundColor: '#f5f5f5',
  } as React.CSSProperties,
};
