import Link from "next/link";

export default function Footer() {
  return (
    <div className="sup-footer">
      <div className="container-fluid">
        <footer className="pt-4 footer_form">
          <div className="row sup-footer2 d-flex justify-content-evenly">
            {/* Cột App Store */}
            <div className="col-12 col-md-3 mb-3">
              <h2>Liên hệ</h2>
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <span className="about">
                    Địa chỉ: Phần mêm Quang Trung <br />
                    Hotline:(+84) 123456789 <br />
                    Email: duanfashionverse@gmail.com
                  </span>
                </li>
                <Link className="dathongbao" href={""}>
                  <img src="/img/dathongbao.webp" alt="" />
                </Link>
              </ul>
            </div>

            {/* Cột Get Help */}
            <div className="col-6 col-md-2 mb-3">
              <h5>Xu hướng</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <Link href="#" className="nav-link p-0 ">
                    Sản phẩm khuyến mãi
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link href="#" className="nav-link p-0 ">
                    Sản phẩm nổi bật
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link href="#" className="nav-link p-0 ">
                    Sản phẩm nữ
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link href="#" className="nav-link p-0 ">
                    Sản phẩm nam
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link href="#" className="nav-link p-0 ">
                    Tất cả sản phẩm
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cột Company */}
            <div className="col-6 col-md-2 mb-3">
              <h5>Liên kết</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <Link href="#" className="nav-link p-0 ">
                    Bảo mật thông tin
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link href="#" className="nav-link p-0 ">
                    Chính sách đổi trả
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link href="#" className="nav-link p-0 ">
                    Chính sách giao hàng
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link href="#" className="nav-link p-0 ">
                    Chính sách kiểm hàng
                  </Link>
                </li>
              </ul>
            </div>
            {/* Đăng ký nhận email */}
            <div className="col-md-3 mb-3">
              <h5>Đăng ký để nhận khuyến mãi</h5>
              <form>
                <div className="input-group-input mt-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email Address"
                    aria-label="Email Address"
                  />
                </div>
                <p className="mt-3 small">
                  <Link href="#">Điều khoản dịch vụ</Link> <br />
                  <Link href="#">Chính sách bảo mật</Link>.
                </p>
              </form>
            </div>
          </div>

          {/* Biểu tượng mạng xã hội */}
          <div className="d-flex justify-content-between align-items-center py-4 my-4 border-top">
            <p className="small-text">
              © 2024 FashionVerse, Mọi quyền được bảo lưu
            </p>
            <ul className="list-unstyled d-flex">
              <li className="ms-3">
                <Link href="#">
                  <i className="bi bi-instagram"></i>
                </Link>
              </li>
              <li className="ms-3">
                <Link href="#">
                  <i className="bi bi-tiktok"></i>
                </Link>
              </li>
              <li className="ms-3">
                <Link href="#">
                  <i className="bi bi-youtube"></i>
                </Link>
              </li>
              <li className="ms-3">
                <Link href="#">
                  <i className="bi bi-facebook"></i>
                </Link>
              </li>
              <li className="ms-3">
                <Link href="#">
                  <i className="bi bi-pinterest"></i>
                </Link>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
}
