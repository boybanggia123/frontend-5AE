// components/HomeContent.js
"use client";
import { useState, useEffect } from "react";
import ProductsHome from "./ProductsHome";

export default function HomeContent() {
  const [data, setData] = useState([]); // Khởi tạo state cho dữ liệu
  const [filter, setFilter] = useState("all"); // Quản lý bộ lọc

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_REACT}/products`, {
          cache: "no-store",
        });
        const result = await res.json();
        setData(result); // Cập nhật state với dữ liệu nhận được
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchData(); // Gọi hàm fetchData khi component mount
  }, []);

  // Hàm để thay đổi bộ lọc
  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  return (
    <>
      <div className="text_h2 text-uppercase mb-1">Sản phẩm mới</div>
      <div className="d-flex flex-wrap gap-2 mb-3 button_new">
        <button
          onClick={() => handleFilterChange("all")}
          className={`btn btn-outline-dark ${filter === "all" ? "active" : ""}`}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange("hot")}
          className={`btn btn-outline-dark ${filter === "hot" ? "active" : ""}`}
        >
          Hot
        </button>
        <button
          onClick={() => handleFilterChange("sale")}
          className={`btn btn-outline-dark ${
            filter === "sale" ? "active" : ""
          }`}
        >
          Sale
        </button>
      </div>

      <div className="row">
        <ProductsHome
          data={data.filter((product) =>
            filter === "hot"
              ? product.hot
              : filter === "sale"
              ? product.discountedPrice > 0
              : true
          )}
        />
      </div>
    </>
  );
}
