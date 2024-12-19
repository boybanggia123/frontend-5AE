"use client";

import React, { useState, useEffect } from "react";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setProducts([]);
      setError(null); // Reset error khi không có từ khóa
      return;
    }
    setLoading(true);
    setError(null); // Reset error khi bắt đầu tìm kiếm
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/search?key=${encodeURIComponent(keyword.trim())}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không tìm thấy sản phẩm");
      }
      const data = await response.json();
      if (data.length === 0) {
        setProducts([]); // Nếu không có sản phẩm, đảm bảo là mảng rỗng
        setError("Không có sản phẩm");
      } else {
        setProducts(data); // Cập nhật dữ liệu khi có sản phẩm
      }
    } catch (err) {
      console.error("Có lỗi xảy ra", err);
      setError("Không có sản phẩm");
      setProducts([]); // Đảm bảo xóa danh sách sản phẩm khi có lỗi
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keyword.trim()) {
        handleSearch();
      }
    }, 600); // Tăng độ trễ debounce để tối ưu hiệu suất

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      window.location.href = `/sanpham?key=${encodeURIComponent(keyword)}`;
    }
  };

  return (
    <div className="flex-column" style={{ position: "relative" }}>
      <form
        className="d-flex gap-3 border search_p"
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="input-group">
          <span className="input-group-text search-icon-left">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tên sản phẩm..."
            className="form-control search-input"
          />
          <span className="input-group-text search-icon-right">
            <i className="fa-solid fa-camera"></i>
          </span>
        </div>
      </form>

      {loading && <p className="mb-0">Đang tìm kiếm...</p>}

      {!loading && error && keyword && (
        <div className="no-results-message">
          <i className="fa-solid fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {products.length > 0 && !error && keyword ? (
        <div
          className="card mt-2 rounded p-2"
          style={{
            maxHeight: "300px",
            overflowY: "scroll",
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 10,
          }}
        >
          {products.slice(0, 10).map((product) => (
            <a
              key={product._id}
              href={`/chitiet/${product._id}`}
              className="timkiem d-flex justify-content-start align-items-center gap-3 p-2"
              style={{
                borderBottom: "1px solid #f0f0f0",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div className="product-image">
                <img
                  className="img-fluid"
                  src={product.image}
                  alt={product.name}
                  style={{
                    maxWidth: "60px",
                    height: "60px",
                    objectFit: "cover",
                  }}
                  loading="lazy"
                />
              </div>
              <div className="text_timkiem d-flex flex-column">
                <span className="mb-0">{product.name}</span>
                <span className="price-1">
                  {/* {product.discountedPrice ? (
                    <>
                      <p>{product.discountedPrice}₫</p>
                      <del>{product.price}₫</del>
                    </>
                  ) : ( */}
                  {/* <p>{product.price}₫</p> */}
                  {/* )} */}
                </span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        !loading &&
        !error &&
        keyword && (
          <p className="no-results-message">
            <i className="fa-solid fa-exclamation-circle"></i> Không có sản phẩm
            nào
          </p>
        )
      )}
    </div>
  );
};

export default Search;
