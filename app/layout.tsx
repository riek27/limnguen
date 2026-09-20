import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';
import Scripts from '@/components/layout/Scripts';

export const metadata: Metadata = {
  title: 'Lim Nguen Foundation (LNF) | Locally Led Humanitarian Action in South Sudan',
  description:
    'Lim Nguen Foundation is a youth-led National NGO in South Sudan empowering displaced and vulnerable communities through education, WASH, protection, climate resilience, and locally led development.',
  icons: {
    icon: '/images/limlogo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
        <Scripts />
      </body>
    </html>
  );
}