import './globals.css';

export const metadata = {
  title: 'OrderiX — Restaurant Management',
  description: 'Restoran boshqaruv tizimi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
