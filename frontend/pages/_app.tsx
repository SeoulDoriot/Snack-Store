// App providers and global styles entry point.
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NotificationProvider>
      <AuthProvider>
        <CatalogProvider>
          <CartProvider>
            <Component {...pageProps} />
          </CartProvider>
        </CatalogProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
