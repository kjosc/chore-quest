export const metadata = {
  title: 'Chore Chart',
  description: 'Family chore tracker',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFD43A',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='35' fill='%23FFD43A' stroke='%231a1a1a' stroke-width='6'/%3E%3Ctext x='50' y='62' text-anchor='middle' font-size='40' fill='%231a1a1a' font-family='cursive'%3E%24%3C/text%3E%3C/svg%3E" />
        <link rel="apple-touch-icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23FFD43A'/%3E%3Ccircle cx='50' cy='50' r='30' fill='%23fff' stroke='%231a1a1a' stroke-width='5'/%3E%3Ctext x='50' y='62' text-anchor='middle' font-size='35' fill='%231a1a1a' font-family='cursive'%3E%24%3C/text%3E%3C/svg%3E" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
