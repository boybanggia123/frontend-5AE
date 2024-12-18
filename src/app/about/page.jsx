"use client";

export default function About() {
  return (
    <div className="container-xxl my-3 position-relative">
      <div className="text-center mb-3">
        <h2 className="display-4 font-weight-bold">ABOUT US</h2>
        <p className="sub-header text-uppercase">
          Introduction | Fashion Verse | Who We Are
        </p>
        <div
          className="horizontal-line mx-auto bg-danger"
          style={{ width: "100px", height: "2px" }}
        ></div>
      </div>
      <div
        id="imageCarousel"
        className="carousel slide mt-4"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#imageCarousel"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#imageCarousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
        </div>

        <div className="carousel-inner">
          <div className="carousel-item active">
            <video
              className="d-block w-100 rounded"
              controls
              autoPlay
              muted
              loop
              style={{ maxHeight: "500px" }}
            >
              <source src="img/Fashion.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="carousel-item">
            <img
              src="img/Fashion Veser.png"
              className="d-block w-100 rounded"
              alt="Fashion Veser 2"
            />
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#imageCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#imageCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="text-center mt-4">
        <p>
          Fashion Verse 2024 not only includes highly practical clothing
          designs, from elegant bodycon dresses to professional suits, but also
          a range of accompanying accessories, such as handbags, shoes, jewelry,
          and scarves. Each product is carefully selected, ensuring quality and
          innovation, providing every woman with a perfect look from head to
          toe.
        </p>
      </div>

      <div className="mt-5">
        <h4 className="text-center font-weight-bold">ABOUT THE PRODUCT</h4>
        <div
          className="horizontal-line mx-auto bg-danger"
          style={{ width: "100px", height: "2px" }}
        ></div>
        <p className="text-center mt-3">
          Fashion Verse 2024 offers fashion products designed with meticulous
          attention to detail. From elegant, dynamic office wear to comfortable
          streetwear, we focus on precise tailoring, creative color
          combinations, and the selection of premium materials to ensure that
          each piece offers both comfort and style. Additionally, the
          accessories, such as handbags, shoes, and jewelry, are carefully
          crafted to elevate any outfit. Not only do we provide a wide range of
          products for women, but Fashion Verse also offers diverse fashion
          choices for men and children, catering to various styles and needs.
        </p>
      </div>

      <div className="mt-5">
        <h4 className="text-center font-weight-bold">ABOUT CUSTOMERS</h4>
        <div
          className="horizontal-line mx-auto bg-danger"
          style={{ width: "100px", height: "2px" }}
        ></div>
        <p className="text-center mt-3">
          Customers of Fashion Verse are not only fashion enthusiasts, but also
          those seeking innovation in every outfit, from professional office
          attire to comfortable streetwear. Whether male or female, adult or
          child, Fashion Verse is proud to be the ideal destination for those
          who want to express their personality and lifestyle through every
          fashion piece.
        </p>
      </div>

      <div className="container my-5 position-relative">
        <div className="text-center mb-4">
          <h4 className="text-center font-weight-bold">ABOUT THE COLLECTION</h4>
          <div
            className="horizontal-line mx-auto bg-danger"
            style={{ width: "100px", height: "2px" }}
          ></div>
        </div>

        <div className="row align-items-center featured">
          <div className="col-md-5 mb-3 mb-md-0">
            <img
              src="img/colection.webp"
              alt="Thong dong"
              className="img-fluid rounded"
              style={{ maxWidth: "100%", height: "300px" }}
            />
          </div>
          <div className="col-md-7">
            <div className="text-content text-start">
              <h2 className="mb-3 font-weight-bold">
                “Christmas Tribute” - Fashion Verse
              </h2>
              <p>
                In celebration of Christmas, Fashion Verse introduces the
                “Christmas Tribute” collection, featuring elegant and stylish
                designs that embody the festive spirit. These chic outfits,
                including shirts, skirts, and suits, are perfect for both
                professional settings and casual gatherings, allowing you to
                celebrate the season in style. With soft colors and high-quality
                fabrics, this collection ensures you feel confident and graceful
                during all your Christmas festivities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
