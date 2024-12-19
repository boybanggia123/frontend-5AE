"use client";
import { fetchCart } from "../../redux/slices/cartslice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Search from "../components/Search";
import SignInModal from "../dangnhap/page";
import SignUpModal from "../dangky/page";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());
export default function Header() {
  const { items = [] } = useSelector((state) => state.cart || {});
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);
  const dispatch = useDispatch();
  const favouriteItems = useSelector((state) => state.favourites.items) || [];
  const [favouriteCount, setFavouriteCount] = useState(0);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollPos, setLastScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      if (currentScrollPos > lastScrollPos && currentScrollPos > 50) {
        setIsVisible(false); // Ẩn header khi cuộn xuống
      } else {
        setIsVisible(true); // Hiện header khi cuộn lên
      }

      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollPos]);

  useEffect(() => {
    setCartCount(items.length); // Cập nhật số lượng từ
  }, [items]);

  useEffect(() => {
    setFavouriteCount(favouriteItems.length); // Cập nhật số lượng yêu thích
  }, [favouriteItems]);

  const { data: categories } = useSWR(
    `${process.env.NEXT_PUBLIC_URL_REACT}/categories`,
    fetcher
  );

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      setIsLoggedIn(true);
      fetch(`${process.env.NEXT_PUBLIC_URL_REACT}/detailuser`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user info");
          }
          return response.json();
        })
        .then((data) => {
          if (data?.fullname) {
            setUserName(data.fullname);
            dispatch(fetchCart(data._id)); // Lấy giỏ hàng khi người dùng đăng nhập
            setCartCount(items.length); // Cập nhật số lượng từ
          }
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    }
  }, [dispatch]);

  return (
    <>
      <div
        className={`navbar-container ${isVisible ? "visible" : "hidden"}`}
        style={{
          transition: "top 0.3s ease-in-out",
          position: "fixed",
          top: isVisible ? 0 : "-80px", // Điều chỉnh giá trị `-80px` cho phù hợp với chiều cao header
          width: "100%",
          zIndex: 1000,
          background: "#fff",
        }}
      >
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid m-0  mx-md-5">
            <Link className="navbar-brand" href={"/"}>
              <img
                src="https://res.cloudinary.com/dwrp82bhy/image/upload/v1732089666/logo_fashion_guzen3.png"
                alt="logo"
              />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
              style={{
                outline: "none", // Xóa hiệu ứng khi nhấn
                transition: "none", // Xóa hiệu ứng chuyển động
              }}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav text-uppercase fw-bold list-h me-auto mb-2 mb-lg-0">
                <li className="nav-item dropdown">
                  <Link className="nav-link active " href={"/"}>
                    Trang chủ
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Danh mục
                  </Link>
                  <ul
                    className="dropdown-menu shadow-sm"
                    aria-labelledby="navbarDropdown"
                  >
                    {categories &&
                      categories.map((category) => (
                        <li key={category._id}>
                          <Link
                            className="dropdown-item"
                            href={`/category/${category._id}`}
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <Link className="nav-link" href={"/about"}>
                    Giới thiệu
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link className="nav-link" href={"/contact"}>
                    Liên hệ
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link className="nav-link" href="#">
                    Bài viết
                  </Link>
                </li>
              </ul>
              <Search setFavouriteCount={setFavouriteCount} />
              <div className="d-flex grid gap-3 ms-4 align-items-center">
                <div className="position-relative user-icon-container">
                  <Link
                    href={"/appinfo/info"}
                    className="user_login text-decoration-none"
                  >
                    {isLoggedIn ? (
                      <Link href={"/appinfo/info"} className="ms-3">
                        {userName}
                      </Link>
                    ) : null}
                    <i className="bi bi-person-circle"></i>
                  </Link>
                  {!isLoggedIn && (
                    <div className="user-dropdown">
                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#signInModal"
                        onClick={() => true} // Mở modal khi nhấn Đăng nhập
                        className="user_dn"
                      >
                        Đăng nhập
                      </button>
                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#signUpModal"
                        onClick={() => true} // Mở modal khi nhấn Đăng nhập
                        className="user_dk "
                      >
                        Đăng ký
                      </button>
                    </div>
                  )}
                </div>
                <div className="fav-icon-container">
                  <Link
                    href={"/yeuthich"}
                    className="heart_item d-flex align-items-center"
                  >
                    <i className="bi bi-suit-heart "></i>
                    {favouriteCount > 0 && (
                      <span className="fav-quantity">{favouriteCount}</span>
                    )}
                  </Link>
                </div>
                <div className="cart-icon-container">
                  <Link
                    href={"/cart"}
                    className="cart_item d-flex align-items-center"
                  >
                    <i className="bi bi-basket "></i>
                    {cartCount > 0 && (
                      <span className="cart-quantity-badge">{cartCount}</span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <SignInModal />
      <SignUpModal />
    </>
  );
}
