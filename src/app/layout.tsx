import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/toast';
import { AlertProvider } from '@/components/ui/alert-dialog';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider>
            <AlertProvider>
              {children}
            </AlertProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
