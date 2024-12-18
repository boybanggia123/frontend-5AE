"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux"; // Import useSelector để lấy dữ liệu từ Redux
import { toggleFavouriteAction } from "../../redux/slices/favouriteSlice"; // Import hành động toggleFavourite từ slice

export default function Favourite() {
  const dispatch = useDispatch(); // Khởi tạo dispatch
  const favouriteItems = useSelector((state) => state.favourites.items); // Lấy danh sách sản phẩm yêu thích từ Redux
  const [isClient, setIsClient] = useState(false);
  const toggleFavourite = (product) => {
    dispatch(toggleFavouriteAction(product)); // Gửi hành động để thêm hoặc xóa sản phẩm khỏi danh sách yêu thích
  };

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null; // Không render cho đến khi client sẵn sàng
  }

  return (
    <div className="container mt-3">
      <div aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="fav-fs">
            <Link href="/">Home</Link>
          </li>
          <li className="item-fav">
            <i className="fa-solid fa-chevron-right"></i>
          </li>
          <li className="fav-fs active" aria-current="page">
            Favourite
          </li>
        </ol>
      </div>

      <div className="product-favourite">
        {favouriteItems.length > 0 ? (
          favouriteItems.map((item) => {
            const isFavourite = true; // Tất cả các sản phẩm trong danh sách yêu thích đều là yêu thích

            return (
              <div
                id="favourite-item"
                className="rounded position-relative border"
                key={item._id}
              >
                <div className="sup-h">
                  <div className="w-img gray-background">
                    <Link href={`/chitiet/${item._id}`}>
                      <img
                        src={`${item.image}`}
                        // src={`img/${image}`}

                        alt={item.name}
                        className="img-fluid img-gray"
                      />
                    </Link>
                    <button className="sup-wimg fw-medium">Quick Add</button>
                  </div>
                  <div className="mt-2 fw-medium">
                    <div className="d-flex justify-content-between">
                      <Link href={""} className="namesup">
                        {item.name}
                      </Link>
                      <span
                        className="icon-favourite"
                        onClick={() => toggleFavourite(item)}
                      >
                        <svg
                          className={`icon-svg ${isFavourite ? "active" : ""}`} // Thêm lớp 'active' nếu sản phẩm được yêu thích
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c2.08 0 4.5 2.42 4.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </span>
                    </div>
                    <span className="price">
                      {item.discountedPrice > 0 ? (
                        <>
                          <p className="priceSale">
                            $
                            {item.price -
                              (item.price * item.discountedPrice) / 100}
                          </p>
                          <del>${item.price}</del>
                        </>
                      ) : (
                        <p className="priceSale">${item.price}</p>
                      )}
                    </span>
                  </div>
                </div>
                {item.discountedPrice > 0 && (
                  <p className="discount position-absolute">
                    {item.discountedPrice}% OFF
                  </p>
                )}
                {item.hot && <p className="hot position-absolute">HOT</p>}
              </div>
            );
          })
        ) : (
          <p>Không có sản phẩm nào trong danh sách yêu thích.</p> // Thông báo nếu không có sản phẩm yêu thích
        )}
      </div>
    </div>
  );
}
