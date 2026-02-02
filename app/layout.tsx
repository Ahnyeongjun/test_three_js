import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "@/providers/StyledRegistry";
import ThemeProvider from "@/providers/ThemeProvider";
import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "3D Viewport Test",
  description: "Next.js + Three.js 3D Viewport Test Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
