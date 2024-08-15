import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
          </AuthProvider>
        </ChakraProvider>
      </body>
    </html >
  );
}
