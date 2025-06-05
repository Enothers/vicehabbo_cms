import "./css/global.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <title>ViceHabbo</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
