"use client";

import Banner from "./components/Banner";
import ProductsHome from "./components/ProductsHome";

export default function Home() {
  return (
    <>
      <div>
        {/* Banner */}
        <Banner />

        {/* Body */}
        <div className=".container-xxl custom-margin">
          {/* Các dịch vụ */}
          <div className="my-3">
            <div className="row justify-content-center g-4">
              {["MIỄN PHÍ VẬN CHUYỂN", "HỖ TRỢ KHÁCH HÀNG 24/7", "HOÀN TIỀN 100%", "BẢO MẬT THÔNG TIN"].map((text, index) => (
                <div className="col-12 col-sm-6 col-md-3" key={index}>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className={`fas ${["fa-plane", "fa-headset", "fa-sync-alt", "fa-shield-alt"][index]}`}></i>
                    </div>
                    <div className="feature-text text_dichvu">{text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sản phẩm mới */}
          <ProductsHome />
        </div>
      </div>
    </>
  );
}
