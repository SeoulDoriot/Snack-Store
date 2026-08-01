// App providers and global styles entry point.
import type { AppProps } from "next/app";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NotificationProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </NotificationProvider>
  );
}
