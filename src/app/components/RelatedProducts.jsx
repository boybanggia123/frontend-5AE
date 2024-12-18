"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFavourites,
  removeFromFavourites,
} from "../../redux/slices/favouriteSlice";
import "../../../public/css/loading.css";

function ProductsHome(props) {
  const dispatch = useDispatch();
  const favouriteItems = useSelector((state) => state.favourites.items);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  const [favouriteIds, setFavouriteIds] = useState(new Set());
  const [notification, setNotification] = useState({ message: "", type: "" });
  const { setFavouriteCount } = props;

  useEffect(() => {
    const ids = new Set(favouriteItems.map((item) => item._id));
    setFavouriteIds(ids);
  }, [favouriteItems]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = props.data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(props.data.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const toggleFavourite = (product) => {
    setFavouriteIds((prev) => {
      const newFavourites = new Set(prev);
      if (newFavourites.has(product._id)) {
        newFavourites.delete(product._id);
        dispatch(removeFromFavourites(product));
        setNotification({
          message: "Đã xóa khỏi mục yêu thích!",
          type: "error",
        });
      } else {
        newFavourites.add(product._id);
        dispatch(addToFavourites(product));
        setNotification({
          message: "Đã thêm vào mục yêu thích!",
          type: "success",
        });
      }
      return newFavourites;
    });

    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 1000);
  };

  return (
    <>
      {currentItems.map((product) => {
        const { _id, name, image, price, discountedPrice, hot } = product;
        const isFavourite = favouriteIds.has(_id);
        return (
          <div key={_id}>
            <div className="sup-h">
              <div className="w-img gray-background">
                <Link href={`/chitiet/${_id}`}>
                  <img
                    src={`${image}`}
                    alt={name}
                    className="img-fluid img-gray"
                  />
                </Link>
                {/* <button className="sup-wimg fw-medium">Quick Add</button> */}
              </div>
              <div className="mt-2 fw-medium">
                <div className="d-flex justify-content-between">
                  <Link href={""} className="namesup">
                    {name}
                  </Link>
                  <span
                    className="icon-favourite"
                    onClick={() => toggleFavourite(product)}
                  >
                    <svg
                      className={`icon-svg ${isFavourite ? "active" : ""}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c2.08 0 4.5 2.42 4.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </span>
                </div>
                <span className="price">
                  {discountedPrice > 0 ? (
                    <>
                      <p className="priceSale">
                        ${price - (price * discountedPrice) / 100}
                      </p>
                      <del>${price}</del>
                    </>
                  ) : (
                    <p className="priceSale">${price}</p>
                  )}
                </span>
              </div>
            </div>
            {discountedPrice > 0 && (
              <p className="discount position-absolute">
                {discountedPrice}% OFF
              </p>
            )}
            {hot && <p className="hot position-absolute">HOT</p>}
          </div>
        );
      })}
    </>
  );
}

export default ProductsHome;
