import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AgroCredit - Plataforma de Crédito Verde",
  description: "Conectamos agricultores con instituciones financieras mediante la mitigación de riesgo climático",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#16a34a" />
      </head>
      <body
        className={`${inter.variable} antialiased bg-gray-50 font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
