import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "@/config/redux/store";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <div className={`${displayFont.variable} ${bodyFont.variable} font-body`}>
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

