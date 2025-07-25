(() => {
  const self = {
    PRODUCT_API:
      "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json",
    STORAGE_KEY: "carouselProducts",
    FAVORITES_KEY: "favoriteProducts",
    favorites: [],
    products: [],
    section: null,

    init: async () => {
      if (
        window.location.hostname !== "www.e-bebek.com" ||
        window.location.pathname !== "/"
      ) {
        console.log("wrong page");
        return;
      }

      self.favorites =
        JSON.parse(localStorage.getItem(self.FAVORITES_KEY)) || [];
      let storedProducts = JSON.parse(localStorage.getItem(self.STORAGE_KEY));

      if (!storedProducts) {
        try {
          const res = await fetch(self.PRODUCT_API);
          self.products = await res.json();
          localStorage.setItem(self.STORAGE_KEY, JSON.stringify(self.products));
        } catch (error) {
          console.error("Failed to fetch products:", error);
          return;
        }
      } else {
        self.products = storedProducts;
      }

      self.buildHTML();
      self.buildCSS();
      self.setEvents();
    },

    buildHTML: () => {
      self.section = document.createElement("section");
      self.section.className = "custom-carousel-wrapper";

      const html = `
        <div class="carousel-wrapper">
          <div class="carousel-title">Beğenebileceğinizi düşündüklerimiz</div>
          <div class="carousel-navigation">
            <button class="carousel-arrow left">❮</button>
            <div class="carousel-container">
              <div class="carousel" id="product-carousel"></div>
            </div>
            <button class="carousel-arrow right">❯</button>
          </div>
        </div>
      `;
      self.section.innerHTML = html;

      const carousel = self.section.querySelector("#product-carousel");

      self.products.forEach((p) => {
        const isFav = self.favorites.includes(String(p.id));
        const hasDiscount = p.price !== p.original_price;
        const discountAmount = hasDiscount
          ? (p.original_price - p.price).toFixed(2)
          : null;

        const card = document.createElement("div");
        card.className = "product-card";
        card.dataset.productId = p.id;
        card.innerHTML = `
          <span class="heart ${isFav ? "filled" : ""}">❤</span>
          <a href="${p.url}" target="_blank">
            <img src="${p.img}" alt="${p.name}" />
            <div class="product-brand">${p.brand}</div>
            <div class="product-name">${p.name}</div>
          </a>
          <div class="product-info">
            <div class="price-section">
              <div class="price">${p.price.toFixed(2)} ₺</div>
              ${
                hasDiscount
                  ? `<div class="original-price">${p.original_price.toFixed(
                      2
                    )} ₺</div>
                     <div class="discount">-${discountAmount} ₺</div>`
                  : ""
              }
            </div>
          </div>
          <button class="sepet-button">Sepete Ekle</button>
        `;
        carousel.appendChild(card);
      });

      const storySection = document.querySelector(
        '[class*="stories"], [class*="Stories"], [class*="slider"]'
      );
      if (storySection) {
        storySection.insertAdjacentElement("afterend", self.section);
      } else {
        document.body.appendChild(self.section);
      }
    },

    buildCSS: () => {
      const css = `
        .custom-carousel-wrapper .carousel-wrapper {
          margin: 2rem auto;
          max-width: 95%;
          min-width: 200px; 
          background-color: #fffaf4;
          padding-bottom: 1rem;
        }
        .custom-carousel-wrapper .carousel-title {
          font-size: 3rem;
          font-weight: 700;
          color: #cc6600;
          padding-left: 5rem;
          max-width: 95%;
          margin: 0;
        }
        .custom-carousel-wrapper .carousel-navigation {
          display: flex;
          align-items: center;
          max-width: 155rem;
          margin: 0 auto;
        }
        .custom-carousel-wrapper .carousel-container {
          overflow-x: auto;
          scroll-behavior: smooth;
          flex: 1;
          scrollbar-width: none;
        }
        .custom-carousel-wrapper .carousel {
          display: flex;
          gap: 1rem;
          width: auto;
        }
        .custom-carousel-wrapper .carousel-arrow {
          background-color: #fff7ed;
          border: 1px solid #ffe1bd;
          color: #cc6600;
          font-size: 2rem;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .custom-carousel-wrapper .carousel-arrow:hover {
          background-color: #ffe8cc;
        }
        .custom-carousel-wrapper .carousel-arrow.left {
          margin-right: 1rem;
        }
        .custom-carousel-wrapper .carousel-arrow.right {
          margin-left: 1rem;
        }
        .custom-carousel-wrapper .product-card {
          background: #fff;
          flex: 0 0 auto;
          width: 240px;
          height: 500px;
          border: 1px solid #eee;
          border-radius: 12px !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          padding: 1rem;
          position: relative;
          justify-content: space-between;
        }
        .custom-carousel-wrapper .product-card:hover {
          border: 2px solid #f59e0b;
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
        }
        .custom-carousel-wrapper .product-card img {
          width: 220px;
          height: 203px;
          object-fit: contain;
          margin-bottom: 0.75rem;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        .custom-carousel-wrapper .product-name {
          font-size: 1.4rem;
          font-weight: 500;
          line-height: 1.3;
          height: 2.4em;
          overflow: hidden;
          color: #7D7D7D;
        }
        .custom-carousel-wrapper .product-brand {
          font-size: 1.4rem;
          font-weight: 800;
          overflow: hidden;
          margin-bottom: 0.5rem;
          color: #7D7D7D;
        }
        .custom-carousel-wrapper .product-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .custom-carousel-wrapper .price-section {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-top: 40px;
        }
        .custom-carousel-wrapper .price {
          color: #7D7D7D;
          font-size: 2.2rem;
          font-weight: 600;
          margin-top: 0.25rem;
        }
        .custom-carousel-wrapper .original-price {
          text-decoration: line-through;
          color: #7D7D7D;
          font-size: 1.4rem;
          font-weight: 500;
        }
        .custom-carousel-wrapper .discount {
          background: #dcfce7;
          color: #15803d;
          padding: 0.25rem 0.5rem;
          font-size: 1.4rem;
          border-radius: 6px;
          margin-top: 0.3rem;
        }
        .custom-carousel-wrapper .product-card .heart {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 48px;
          height: 48px;
          font-size: 24px;
          color: #ccc;
          background-color: rgba(255, 255, 255, 0.85) !important;
          border-radius: 50% !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease;
          z-index: 10;
          backdrop-filter: blur(2px);
        }
        .custom-carousel-wrapper .heart.filled {
          color: #ff6b00;
        }
        .custom-carousel-wrapper .sepet-button {
          padding: 0.5rem;
          background-color: #fff7ed;
          border: 1px solid #ffe1bd;
          color: #cc6600;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1.4rem;
          cursor: pointer;
          margin-top: auto;
        }
        .custom-carousel-wrapper .sepet-button:hover {
          background-color: #ffe8cc;
        }

        @media (max-width: 1600px) {
          .custom-carousel-wrapper .carousel-wrapper {
            max-width: 1400px;
          }
        }
        @media (max-width: 1440px) {
          .custom-carousel-wrapper .carousel-wrapper {
            max-width: 1200px;
          }
        }
        @media (max-width: 1240px) {
          .custom-carousel-wrapper .carousel-wrapper {
            max-width: 980px;
          }
        }
        @media (max-width: 1024px) {
          .custom-carousel-wrapper .carousel-wrapper {
            max-width: 850px;
          }
           .custom-carousel-wrapper .carousel-title {
            font-size: 2.2rem;
            padding-left: 2rem;
          }
        }
        @media (max-width: 900px) {
          .custom-carousel-wrapper .carousel-wrapper {
            max-width: 700px;
          }
        }
        @media (max-width: 768px) {
          .custom-carousel-wrapper .carousel-wrapper {
            max-width: 600px;
          }
           .custom-carousel-wrapper .carousel-title {
            font-size: 2rem;
            padding-left: 1rem;
          }
        }
      `;
      const styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerText = css;
      document.head.appendChild(styleSheet);
    },

    setEvents: () => {
      const container = self.section.querySelector(".carousel-container");
      const scrollAmount = 249;

      self.section
        .querySelector(".carousel-arrow.left")
        .addEventListener("click", () => {
          container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        });

      self.section
        .querySelector(".carousel-arrow.right")
        .addEventListener("click", () => {
          container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });

      self.section.querySelectorAll(".heart").forEach((heart) => {
        heart.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const card = e.target.closest(".product-card");
          const productId = card.dataset.productId;
          const index = self.favorites.indexOf(productId);

          if (index === -1) {
            self.favorites.push(productId);
            e.target.classList.add("filled");
          } else {
            self.favorites.splice(index, 1);
            e.target.classList.remove("filled");
          }
          localStorage.setItem(
            self.FAVORITES_KEY,
            JSON.stringify(self.favorites)
          );
        });
      });
    },
  };

  self.init();
})();
