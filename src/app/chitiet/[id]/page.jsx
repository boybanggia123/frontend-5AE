// "use client";
// import { useSelector, useDispatch } from "react-redux";
// import { addToCart, fetchCart } from "../../../redux/slices/cartslice";
// import CommentsSection from "@/app/components/CommentsSection";
// import RelatedProducts from "../../components/RelatedProducts";
// import SignInModal from "@/app/components/SignInModal";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import useSWR from "swr";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";

// const fetcher = (...args) => fetch(...args).then((res) => res.json());
// export default function Detail({ params }) {
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState("");
//   const [notification, setNotification] = useState("");
//   const [mainImage, setMainImage] = useState(""); // Thêm state để lưu hình ảnh chính
//   const cart = useSelector((state) => state.cart);
//   const [additionalImages, setAdditionalImages] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const dispatch = useDispatch();
//   const [currentIndex, setCurrentIndex] = useState(0); // Thêm state để theo dõi chỉ số sản phẩm hiện tại

//   const handleNext = () => {
//     if (currentIndex < relatedProducts.length - 4) {
//       setCurrentIndex(currentIndex + 1);
//     }
//   };
//   const handlePrev = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     }
//   };
//   const {
//     data: product,
//     error,
//     isLoading,
//   } = useSWR(`http://localhost:3000/productdetail/${params.id}`, fetcher, {
//     refreshInterval: 6000,
//   });

//   useEffect(() => {
//     if (product) {
//       setMainImage(product.image); // Gán ảnh chính là ảnh mặc định ban đầu
//       setAdditionalImages(product.additionalImages || []); // Lưu danh sách ảnh phụ
//     }
//   }, [product]);

//   const [relatedProducts, setRelatedProducts] = useState([]); // Khởi tạo state cho sản phẩm liên quan

//   useEffect(() => {
//     const fetchRelatedProducts = async () => {
//       if (product && product.categoryId) {
//         // Kiểm tra nếu product đã được khởi tạo và có categoryId
//         const res = await fetch(
//           `http://localhost:3000/products?categoryId=${product.categoryId}`
//         );
//         const result = await res.json();
//         setRelatedProducts(result.filter((item) => item._id !== product._id)); // Lọc bỏ sản phẩm hiện tại
//       }
//     };

//     fetchRelatedProducts(); // Gọi hàm fetchRelatedProducts khi sản phẩm thay đổi
//   }, [product]); // Chạy lại khi product thay đổi

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const token = Cookies.get("token");
//         if (token) {
//           const response = await axios.get("http://localhost:3000/detailuser", {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           const fetchedUserId = response.data._id;
//           if (fetchedUserId) {
//             setUserId(fetchedUserId);
//             dispatch(fetchCart(fetchedUserId));
//           }
//           setUser(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching user details:", error);
//       }
//     };
//     fetchUserDetails();
//   }, []);

//   if (error) return <div>Lỗi tải dữ liệu.</div>;
//   if (isLoading) return <div>Đang tải...</div>;

//   const handleSizeClick = (size) => {
//     setSelectedSize(selectedSize === size ? "" : size);
//   };

//   // Cập nhật logic khi nhấn vào ảnh phụ
//   const handleImageClick = (image) => {
//     if (image !== mainImage) {
//       // Đổi chỗ ảnh chính và ảnh phụ được nhấn
//       const updatedAdditionalImages = additionalImages.map((img) =>
//         img === image ? mainImage : img
//       );
//       setMainImage(image); // Gán ảnh vừa nhấn làm ảnh chính
//       setAdditionalImages(updatedAdditionalImages); // Cập nhật lại danh sách ảnh phụ
//     }
//   };

//   const handleAddToCart = async () => {
//     if (!user) {
//       alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
//       setShowModal(true);
//       return;
//     }
//     if (!selectedSize) {
//       alert("Vui lòng chọn kích thước trước khi thêm vào giỏ hàng.");
//       return;
//     }

//     try {
//       await dispatch(
//         addToCart({
//           userId,
//           productId: product._id,
//           quantity,
//           size: selectedSize,
//         })
//       );
//       dispatch(fetchCart(userId));
//       setNotification("Đã thêm sản phẩm vào giỏ hàng!");
//       setTimeout(() => setNotification(""), 3000);
//     } catch (err) {
//       console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", err);
//       alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
//     }
//   };

//   return (
//     <div className="container">
//       <div aria-label="breadcrumb" className="mt-3">
//         <ol className="breadcrumb">
//           <li className="Detail">
//             <Link href="/">Trang chủ</Link>
//           </li>
//           <li className="item_detail">
//             <i className="fa-solid fa-chevron-right"></i>
//           </li>
//           <li className="Detail">
//             <Link href="#">Chi tiết</Link>
//           </li>
//           <li className="item_detail">
//             <i className="fa-solid fa-chevron-right"></i>
//           </li>
//           <li className="Detail active" aria-current="page">
//             {product.name}
//           </li>
//         </ol>
//       </div>
//       <div className="row mb-4">
//         <div className="col-md-8">
//           <div className="product-container">
//             <div className="thumbnail-images m-1 d-flex flex-column">
//               {additionalImages.map((img, index) => (
//                 <img
//                   key={index}
//                   src={img}
//                   alt={`Hình thu nhỏ ${index + 1}`}
//                   className="mb-2 thumbnail-image"
//                   onClick={() => handleImageClick(img)} // Thêm sự kiện onClick
//                   style={{
//                     cursor: "pointer",
//                     border: mainImage === img ? "2px solid #000" : "none",
//                   }} // Thêm border cho ảnh đang hiển thị
//                 />
//               ))}
//             </div>
//             <div className="main-product-image m-1">
//               <img
//                 src={mainImage} // Hiển thị ảnh chính từ state
//                 alt="Hình sản phẩm chính"
//                 className="w-100"
//               />
//             </div>
//           </div>
//         </div>
//         <div className="col-md-4">
//           <div className="name_detail">{product.name}</div>
//           <p className="price_giam mb-2">
//             <div className="gia_detail">
//               {product.discountedPrice > 0 ? (
//                 <>
//                   $
//                   {product.price -
//                     (product.price * product.discountedPrice) / 100}{" "}
//                   <del className="price_goc">${product.price}</del>
//                 </>
//               ) : (
//                 <>${product.price}</>
//               )}
//             </div>
//             <div className="text-warning_1 fs-6">
//               ★★★★☆<span className="sl_ratings">(3)</span>
//             </div>
//           </p>

//           <div className="mb-3">
//             <h6 className="name_detail">Màu sắc</h6>
//             <div className="d-flex">
//               {product.color && product.color.length > 0 ? (
//                 product.color.map((color, index) => (
//                   <div
//                     key={index}
//                     className="color-btn"
//                     style={{
//                       backgroundColor: color.toLowerCase(), // Áp dụng màu sắc từ dữ liệu
//                       width: "20px",
//                       border: "1px solid #f1eeee",
//                       height: "20px",
//                       borderRadius: "50%",
//                       marginRight: "10px",
//                     }}
//                   ></div>
//                 ))
//               ) : (
//                 <p>Không có màu sắc nào</p>
//               )}
//             </div>
//           </div>
//           <div className="mb-3">
//             <h6 className="mb-2 name_detail">Kích thước</h6>
//             <div className="size_detail d-flex flex-wrap">
//               {product.size && product.size.length > 0 ? (
//                 product.size.map((size, index) => (
//                   <button
//                     key={index}
//                     className={`size_button ${
//                       selectedSize === size ? "active" : ""
//                     }`}
//                     onClick={() => handleSizeClick(size)}
//                   >
//                     {size}
//                   </button>
//                 ))
//               ) : (
//                 <p>Không có kích thước nào</p>
//               )}
//             </div>
//           </div>

//           <div className="mb-3">
//             <label className="name_detail" htmlFor="quantity">
//               Số lượng
//             </label>
//             <input
//               style={{ width: "75px", textAlign: "center", marginTop: "10px" }}
//               type="number"
//               id="quantity"
//               min="1"
//               value={quantity}
//               onChange={(e) => setQuantity(e.target.value)}
//               className="form-control"
//             />
//           </div>
//           {/* Hiển thị thông báo */}
//           {notification && (
//             <div className="alert alert-success mt-2" role="alert">
//               {notification}
//             </div>
//           )}
//           <button
//             className="button_detail"
//             onClick={() => handleAddToCart("M", 1)}
//           >
//             Thêm vào giỏ hàng
//           </button>

//           <div className="mt-4">
//             <h6>Thông tin sản phẩm</h6>
//             <p className="text-muted" style={{ fontSize: "0.9rem" }}>
//               {product.description}
//             </p>
//           </div>
//         </div>
//       </div>
//       <CommentsSection productId={params.id} user={user} userId={userId} />
//       <div className="recommended-section mt-5 mb-3 detail-page">
//         <p className="h5">Sản phẩm liên quan</p>
//         <div className="d-flex align-items-center gap-3">
//           {/* Mũi tên trái */}
//           <div className="row">
//             {relatedProducts
//               .slice(currentIndex, currentIndex + 4)
//               .map((product) => (
//                 <div
//                   className="col-12 p-1 col-sm-6 col-md-4 col-lg-3"
//                   key={product._id}
//                 >
//                   <RelatedProducts data={[product]} />{" "}
//                   {/* Hiển thị từng sản phẩm */}
//                 </div>
//               ))}
//           </div>
//         </div>
//       </div>
//       <SignInModal showModal={showModal} setShowModal={setShowModal} />
//     </div>
//   );
// }
"use client";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, fetchCart } from "../../../redux/slices/cartslice";
import CommentsSection from "@/app/components/CommentsSection";
import RelatedProducts from "../../components/RelatedProducts";
import SignInModal from "@/app/components/SignInModal";
import { useState, useEffect } from "react";
import Link from "next/link";
import useSWR from "swr";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Detail({ params }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [mainImage, setMainImage] = useState(""); // Thêm state để lưu hình ảnh chính
  const cart = useSelector((state) => state.cart);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0); // Thêm state để theo dõi chỉ số sản phẩm hiện tại

  const handleNext = () => {
    if (currentIndex < relatedProducts.length - 4) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const {
    data: product,
    error,
    isLoading,
  } = useSWR(`http://localhost:3000/productdetail/${params.id}`, fetcher, {
    refreshInterval: 6000,
  });

  useEffect(() => {
    if (product) {
      setMainImage(product.image); // Gán ảnh chính là ảnh mặc định ban đầu
      setAdditionalImages(product.additionalImages || []); // Lưu danh sách ảnh phụ
    }
  }, [product]);

  const [relatedProducts, setRelatedProducts] = useState([]); // Khởi tạo state cho sản phẩm liên quan

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product && product.categoryId) {
        // Kiểm tra nếu product đã được khởi tạo và có categoryId
        const res = await fetch(
          `http://localhost:3000/products?categoryId=${product.categoryId}`
        );
        const result = await res.json();
        setRelatedProducts(result.filter((item) => item._id !== product._id)); // Lọc bỏ sản phẩm hiện tại
      }
    };

    fetchRelatedProducts(); // Gọi hàm fetchRelatedProducts khi sản phẩm thay đổi
  }, [product]); // Chạy lại khi product thay đổi

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          const response = await axios.get("http://localhost:3000/detailuser", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const fetchedUserId = response.data._id;
          if (fetchedUserId) {
            setUserId(fetchedUserId);
            dispatch(fetchCart(fetchedUserId));
          }
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, []);

  if (error) return <div>Lỗi tải dữ liệu.</div>;
  if (isLoading) return <div>Đang tải...</div>;

  const handleSizeClick = (size) => {
    setSelectedSize(selectedSize === size ? "" : size);
  };

  // Cập nhật logic khi nhấn vào ảnh phụ
  const handleImageClick = (image) => {
    if (image !== mainImage) {
      // Đổi chỗ ảnh chính và ảnh phụ được nhấn
      const updatedAdditionalImages = additionalImages.map((img) =>
        img === image ? mainImage : img
      );
      setMainImage(image); // Gán ảnh vừa nhấn làm ảnh chính
      setAdditionalImages(updatedAdditionalImages); // Cập nhật lại danh sách ảnh phụ
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      Swal.fire({
        title: "Vui lòng đăng nhập",
        text: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.",
        icon: "warning",
        confirmButtonText: "Đăng nhập",
      });
      setShowModal(true);
      return;
    }

    if (!selectedSize) {
      Swal.fire({
        title: "Chọn kích thước",
        text: "Vui lòng chọn kích thước trước khi thêm vào giỏ hàng.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      await dispatch(
        addToCart({
          userId,
          productId: product._id,
          quantity,
          size: selectedSize,
        })
      );
      dispatch(fetchCart(userId));
      Swal.fire({
        title: "Thành công!",
        text: "Sản phẩm đã được thêm vào giỏ hàng.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", err);
      Swal.fire({
        title: "Lỗi!",
        text: "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.",
        icon: "error",
        confirmButtonText: "Thử lại",
      });
    }
  };

  return (
    <div className="container">
      <div aria-label="breadcrumb" className="mt-3">
        <ol className="breadcrumb">
          <li className="Detail">
            <Link href="/">Trang chủ</Link>
          </li>
          <li className="item_detail">
            <i className="fa-solid fa-chevron-right"></i>
          </li>
          <li className="Detail">
            <Link href="#">Chi tiết</Link>
          </li>
          <li className="item_detail">
            <i className="fa-solid fa-chevron-right"></i>
          </li>
          <li className="Detail active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </div>
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="product-container">
            <div className="thumbnail-images m-1 d-flex flex-column">
              {additionalImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Hình thu nhỏ ${index + 1}`}
                  className="mb-2 thumbnail-image"
                  onClick={() => handleImageClick(img)}
                  style={{
                    cursor: "pointer",
                    border: mainImage === img ? "2px solid #000" : "none",
                  }}
                />
              ))}
            </div>
            <div className="main-product-image m-1">
              <img
                src={mainImage}
                alt="Hình sản phẩm chính"
                className="w-100"
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="name_detail">{product.name}</div>
          <p className="price_giam mb-2">
            <div className="gia_detail">
              {product.discountedPrice > 0 ? (
                <>
                  $
                  {product.price -
                    (product.price * product.discountedPrice) / 100}{" "}
                  <del className="price_goc">${product.price}</del>
                </>
              ) : (
                <>${product.price}</>
              )}
            </div>
            <div className="text-warning_1 fs-6">
              ★★★★☆<span className="sl_ratings">(3)</span>
            </div>
          </p>

          <div className="mb-3">
            <h6 className="name_detail">Màu sắc</h6>
            <div className="d-flex">
              {product.color && product.color.length > 0 ? (
                product.color.map((color, index) => (
                  <div
                    key={index}
                    className="color-btn"
                    style={{
                      backgroundColor: color.toLowerCase(),
                      width: "20px",
                      border: "1px solid #f1eeee",
                      height: "20px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  ></div>
                ))
              ) : (
                <p>Không có màu sắc nào</p>
              )}
            </div>
          </div>

          <div className="mb-3">
            <h6 className="mb-2 name_detail">Kích thước</h6>
            <div className="size_detail d-flex flex-wrap">
              {product.size && product.size.length > 0 ? (
                product.size.map((size, index) => (
                  <button
                    key={index}
                    className={`size_button ${
                      selectedSize === size ? "active" : ""
                    }`}
                    onClick={() => handleSizeClick(size)}
                  >
                    {size}
                  </button>
                ))
              ) : (
                <p>Không có kích thước nào</p>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="name_detail" htmlFor="quantity">
              Số lượng
            </label>
            <input
              style={{ width: "75px", textAlign: "center", marginTop: "10px" }}
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="form-control"
            />
          </div>

          <button className="button_detail" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </button>

          <div className="mt-4">
            <h6>Thông tin sản phẩm</h6>
            <p className="text-muted" style={{ fontSize: "0.9rem" }}>
              {product.description}
            </p>
          </div>
        </div>
      </div>
      <CommentsSection productId={params.id} user={user} userId={userId} />
      <div className="recommended-section mt-5 mb-3 detail-page">
        <p className="h5">Sản phẩm liên quan</p>
        <div className="d-flex align-items-center gap-3">
          <div className="row">
            {relatedProducts
              .slice(currentIndex, currentIndex + 4)
              .map((product) => (
                <div
                  className="col-12 p-1 col-sm-6 col-md-4 col-lg-3"
                  key={product._id}
                >
                  <RelatedProducts data={[product]} />
                </div>
              ))}
          </div>
        </div>
      </div>
      <SignInModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}
