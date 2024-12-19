// src/app/layout.jsx
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { Inter } from "next/font/google";
import Providers from "../redux/Provider";

import "../../public/bootstrap/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../public/css/header.css";
import "../../public/css/footer.css";
import "../../public/css/cart.css";
import "../../public/css/style.css";
import "../../public/css/sanpham.css";
import "../../public/css/detail.css";
import "../../public/css/favourite.css";
import "../../public/css/style-dangnhap.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <Header />
          {children} {/* Đây là nơi các trang như Checkout sẽ được render */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
            integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          {/* <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          /> */}
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-pzjw8f+ua7Kw1TIq0GdD1rOOfWygHiJtqvR6VokzO5mTt6FgHiM6kS+VbInXJzIu"
            crossOrigin="anonymous"
          ></script>
          <Footer />
          <script src="/bootstrap/js/bootstrap.bundle.min.js"></script>
        </body>
      </Providers>
    </html>
  );
}
