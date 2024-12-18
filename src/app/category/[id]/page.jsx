"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import ProductsCategory from "../../components/ProductsCategory";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ProductByCategoryPage() {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortOption, setSortOption] = useState("asc");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const { data: categorie } = useSWR(
    `http://localhost:3000/products/${id}`,
    fetcher
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("http://localhost:3000/products", {
        cache: "no-store",
      });
      const newProducts = await res.json();
      setProducts(newProducts);
    }
    fetchProducts();
  }, [id]);

  const handleSortAndFilter = (products) => {
    let filteredProducts = products;

    // Lọc theo danh mục
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedCategories.includes(product.categoryId)
      );
    }

    // Lọc theo giá
    if (minPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= parseFloat(minPrice)
      );
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= parseFloat(maxPrice)
      );
    }

    // Lọc theo kích thước (kiểm tra dữ liệu)
    if (selectedSizes.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          Array.isArray(product.size) &&
          selectedSizes.some((size) => product.size.includes(size))
      );
    }

    // Lọc theo màu sắc (kiểm tra dữ liệu)
    if (selectedColors.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          Array.isArray(product.color) &&
          selectedColors.some((color) => product.color.includes(color))
      );
    }

    // Sắp xếp sản phẩm theo giá
    return filteredProducts.sort((a, b) =>
      sortOption === "asc" ? a.price - b.price : b.price - a.price
    );
  };

  // Sự kiện chọn danh mục
  const handleCategoryChange = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      ); // Bỏ chọn nếu đã chọn trước đó
    } else {
      setSelectedCategories([...selectedCategories, categoryId]); // Thêm vào danh mục đã chọn
    }
  };

  // Sự kiện chọn kích thước
  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Sự kiện chọn màu sắc
  const handleColorChange = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  // Sự kiện thay đổi giá
  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  // Sự kiện thay đổi sắp xếp
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div>
      <div className="container-fluid m-0">
        <div className="row">
          <button
            className="btn btn-primary m-0 d-md-none mb-3"
            onClick={toggleMenu}
          >
            {isMenuOpen ? "Close Filter" : "Open Filter"}
          </button>

          {/* Bộ lọc bên trái */}
          <div
            className={`col-md-2 custom-filter-section m-0 rounded-0 ${
              isMenuOpen ? "d-block" : "d-none"
            } d-md-block`}
          >
            <div className="Categories_phai">REFINE BY</div>
            {/* Danh mục */}
            <hr />

            {/* Kích thước */}
            <div className="custom-filter">
              <h6>Size</h6>
              <div className="row row-cols-1 row-cols-md-2">
                {["S", "39", "L", "41", "M", "40", "XL", "42"].map((size) => (
                  <div className="col mb-2" key={size}>
                    <div className="d-flex align-items-center">
                      <input
                        className="input_checkbox"
                        type="checkbox"
                        id={`size${size}`}
                        checked={selectedSizes.includes(size)}
                        onChange={() => handleSizeChange(size)}
                      />
                      <label
                        htmlFor={`size${size}`}
                        className="label_trai ms-2"
                      >
                        {size}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* màu sắc */}
            <div className="custom-filter">
              <hr />
              <h6>Colors</h6>
              <div className="row row-cols-2">
                {[
                  { color: "Black", code: "#000000" },
                  { color: "Brown", code: "#8B4513" },
                  { color: "Blue", code: "#0000FF" },
                  { color: "Grey", code: "#808080" },
                  { color: "Pink", code: "#FFC0CB" },
                  { color: "Red", code: "#FF0000" },
                  { color: "White", code: "#FFFFFF" },
                ].map(({ color, code }) => (
                  <div
                    key={color}
                    className="col d-flex align-items-center gap-2 mb-2"
                  >
                    <div
                      className="color-circle"
                      style={{
                        background: code,
                        border: color === "White" ? "1px solid #ddd" : "none",
                      }}
                    >
                      {selectedColors.includes(color) && (
                        <span className="check-mark">&#10003;</span>
                      )}
                    </div>
                    <label htmlFor={`color${color}`} className="label_trai m-0">
                      {color}
                    </label>
                    <input
                      className="input_checkbox ms-auto"
                      type="checkbox"
                      id={`color${color}`}
                      checked={selectedColors.includes(color)}
                      onChange={() => handleColorChange(color)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <hr />
          </div>

          {/* Lưới sản phẩm bên phải */}
          <div className="col-md-10 ">
            <div className="d-flex mt-3 justify-content-between align-items-center mb-4 flex-column flex-md-row gap-2">
              <div className="Products_show fw-bold">DANH SÁCH SẢN PHẨM</div>
              <div className="d-flex flex-column flex-md-row gap-2 align-items-center">
                <div className="price-filter d-flex align-items-center">
                  <label htmlFor="minPrice" className="me-2">
                    Khoảng giá:
                  </label>
                  <input
                    type="number"
                    id="minPrice"
                    className="form-control rounded-0"
                    placeholder="Min"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    style={{
                      width: "100px",
                      height: "28px",
                      fontSize: ".75rem",
                    }}
                  />
                  <span className="mx-2">-</span>
                  <input
                    type="number"
                    id="maxPrice"
                    className="form-control rounded-0"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    style={{
                      width: "100px",
                      height: "28px",
                      fontSize: ".75rem",
                    }}
                  />
                </div>
                <select
                  className="form-select form-select-sm custom-select rounded-0 m-0"
                  onChange={handleSortChange}
                >
                  <option value="asc">Giá tăng dần</option>
                  <option value="desc">Giá giảm dần</option>
                </select>
              </div>
            </div>

            {/* Lưới sản phẩm */}
            <div className="row g-3 custom-product-grid">
              <ProductsCategory data={handleSortAndFilter(categorie || [])} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
