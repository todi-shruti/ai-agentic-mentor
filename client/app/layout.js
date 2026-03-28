import "./globals.css";

export const metadata = {
  title: "AI Coding Mentor",
  description: "AI assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
