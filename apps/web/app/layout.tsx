import './globals.css';
import { AuthProvider } from './auth-context';
import Navigation from './components/Navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>UFML - Un Fuck My Life</title>
        <meta name="description" content="UFML - Un Fuck My Life - Credit Repair & Financial Freedom" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/ufml-logo.svg" />
        <meta property="og:title" content="UFML - Un-Fuck My Life" />
        <meta
          property="og:description"
          content="UFML - Un-Fuck My Life | Elite credit repair intelligence for people ready to reclaim their story"
        />
        <meta property="og:image" content="/ufml-logo.svg" />
      </head>
      <body>
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
