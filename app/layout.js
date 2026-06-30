import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata = {
  title: 'KYNAos — AI-Powered Business Solutions',
  description: 'Powerful, integrated AI solutions to elevate every aspect of your business operations.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}