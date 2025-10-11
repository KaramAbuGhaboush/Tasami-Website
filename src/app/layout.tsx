import { LanguageProvider } from '../context/LanguageContext';
import ConditionalNavbar, { ConditionalFooter } from '../components/ConditionalNavbar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Tasami - AI, Automation, Design & Marketing Solutions</title>
        <meta name="description" content="Leading tech company specializing in AI, automation, design, UX/UI, and marketing solutions." />
      </head>
      <body>
        <LanguageProvider>
          <ConditionalNavbar />
          {children}
          <ConditionalFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
