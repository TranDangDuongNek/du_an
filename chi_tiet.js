// --- Helper: Lấy sản phẩm từ localStorage ---
function getProducts() {
  return JSON.parse(localStorage.getItem("products") || "[]");
}

// --- Render chi tiết sản phẩm ---
document.addEventListener("DOMContentLoaded", () => {
  const detailContainer = document.getElementById("detailContainer");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const products = getProducts();
  const product = products.find(p => p.id == id);

  if (!product) {
    detailContainer.innerHTML = "<p>Sản phẩm không tồn tại!</p>";
    return;
  }

  let currentSlide = 0;
  function renderSlideshow() {
    if (product.detailImages.length === 0) return "";
    return `
      <div class="slideshow">
        <img id="slideImage" src="${product.detailImages[currentSlide]}" alt="Ảnh chi tiết">
        <button class="prev">&lt;</button>
        <button class="next">&gt;</button>
      </div>
    `;
  }

  detailContainer.innerHTML = `
    <!-- Hàng 1 -->
    <div class="row">
      <div class="main-image">
        <img src="${product.imageMain}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h2>${product.name}</h2>
        <p>${product.desc}</p>
      </div>
    </div>

    <!-- Hàng 2 -->
    <div class="row">
      ${renderSlideshow()}
      <div class="detail-text">
        <p><b>Chi tiết:</b> ${product.detail || "Không có"}</p>
      </div>
    </div>

    <!-- Hàng 3 -->
    <div class="product-link">
      ${product.link ? `<a href="${product.link}" target="_blank">🔗 Xem sản phẩm</a>` : ""}
    </div>

    <!-- Hàng 4 -->
    <div class="author">
      ${product.authorImg ? `<img src="${product.authorImg}" alt="Tác giả">` : ""}
      <span>${product.author}</span>
    </div>
  `;

  // --- Slideshow controls ---
  if (product.detailImages.length > 0) {
    const slideImg = document.getElementById("slideImage");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    prevBtn.addEventListener("click", () => {
      currentSlide = (currentSlide - 1 + product.detailImages.length) % product.detailImages.length;
      slideImg.src = product.detailImages[currentSlide];
    });

    nextBtn.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % product.detailImages.length;
      slideImg.src = product.detailImages[currentSlide];
    });
  }
});

// --- Comment system ---
const commentList = document.getElementById("commentList");
const sendBtn = document.getElementById("sendComment");

if (commentList && sendBtn) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  function getComments() {
    return JSON.parse(localStorage.getItem("comments_" + id) || "[]");
  }
  function saveComments(comments) {
    localStorage.setItem("comments_" + id, JSON.stringify(comments));
  }

  function renderComments() {
    const comments = getComments();
    commentList.innerHTML = comments.map(c => `
      <div class="comment">
        <strong>${c.user}</strong>: ${c.text}
      </div>
    `).join("");
  }

  sendBtn.onclick = () => {
    const text = document.getElementById("commentInput").value.trim();
    if (!text) return alert("Vui lòng nhập bình luận!");

    // Lấy tên user từ localStorage (nếu có)
    let username = localStorage.getItem("username");
    if (!username) username = "Ẩn danh";

    const comments = getComments();
    comments.push({ user: username, text });
    saveComments(comments);

    document.getElementById("commentInput").value = "";
    renderComments();
  };

  renderComments();
}
