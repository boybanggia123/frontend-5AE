"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import FilterButtons from "./FilterButtons";
import { useDispatch, useSelector } from "react-redux";
import { addToFavourites, removeFromFavourites } from "../../redux/slices/favouriteSlice";

function ProductsHome() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  const dispatch = useDispatch();
  const favouriteItems = useSelector((state) => state.favourites.items);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:3000/products", { cache: "no-store" });
      const result = await res.json();
      setData(result);
    };

    fetchData();
  }, []);

  const filteredData = data.filter((product) =>
    filter === "hot" ? product.hot : filter === "sale" ? product.discountedPrice > 0 : true
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = filteredData.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const toggleFavourite = (product) => {
    const isFavourite = favouriteItems.some((item) => item._id === product._id);
    if (isFavourite) {
      dispatch(removeFromFavourites(product));
    } else {
      dispatch(addToFavourites(product));
    }
  };

  return (
    <>
      {/* Bộ lọc */}
      <FilterButtons currentFilter={filter} setFilter={setFilter} />

      {/* Sản phẩm */}
      <div className="row">
        {currentItems.map((product) => (
          <div
            className="position-relative p-1 col-6 col-sm-6 col-md-4 col-lg-3 products_Home"
            key={product._id}
          >
            <div className="sup-h">
              <div className="w-img gray-background">
                <Link href={`/chitiet/${product._id}`}>
                  <img src={product.image} alt={product.name} className="img-fluid img-gray" />
                </Link>
              </div>
              <div className="mt-2 fw-medium">
                <div className="d-flex justify-content-between">
                  <Link href={`/chitiet/${product._id}`} className="namesup">
                    {product.name}
                  </Link>
                  <span
                    className="icon-favourite"
                    onClick={() => toggleFavourite(product)}
                  >
                    <svg
                      className={`icon-svg ${
                        favouriteItems.some((item) => item._id === product._id) ? "active" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c2.08 0 4.5 2.42 4.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </span>
                </div>
                <span className="price">
                  {product.discountedPrice > 0 ? (
                    <>
                      <p className="priceSale">${product.price - product.discountedPrice}</p>
                      <del>${product.price}</del>
                    </>
                  ) : (
                    <p className="priceSale">${product.price}</p>
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      <div className="pagination">
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page}
            className={`btn ${currentPage === page + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(page + 1)}
          >
            {page + 1}
          </button>
        ))}
      </div>
    </>
  );
}

export default ProductsHome;
