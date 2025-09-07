// Convert ảnh sang base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

// ---------------- STORAGE ----------------
function getProducts() {
  return JSON.parse(localStorage.getItem("products") || "[]");
}
function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

function getPendingProducts() {
  return JSON.parse(localStorage.getItem("pendingProducts") || "[]");
}
function savePendingProducts(products) {
  localStorage.setItem("pendingProducts", JSON.stringify(products));
}

// ---------------- FORM ĐĂNG ----------------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("productName").value;
      const desc = document.getElementById("productDesc").value;
      const detail = document.getElementById("productDetail").value;
      const link = document.getElementById("productLink").value;
      const author = document.getElementById("authorName").value;

      const imageFile = document.getElementById("productImage").files[0];
      const imageMain = imageFile ? await toBase64(imageFile) : "";

      const detailFiles = document.getElementById("productImages").files;
      const detailImages = [];
      for (let file of detailFiles) {
        detailImages.push(await toBase64(file));
      }

      const authorFile = document.getElementById("authorImage").files[0];
      const authorImg = authorFile ? await toBase64(authorFile) : "";

      const pending = getPendingProducts();
      pending.push({
        id: Date.now(),
        name,
        desc,
        detail,
        link,
        imageMain,
        detailImages,
        author,
        authorImg
      });
      savePendingProducts(pending);

      alert("✅ Gửi sản phẩm thành công, chờ duyệt!");
      window.location.href = "duyet.html";
    });
  }

  // ---------------- HIỂN THỊ SẢN PHẨM ----------------
  const productList = document.getElementById("productList");
  if (productList) {
    const products = getProducts();
    products.forEach(p => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="${p.imageMain}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <small><b>Tác giả:</b> ${p.author}</small>
      `;
      div.onclick = () => {
        window.location.href = `chi_tiet.html?id=${p.id}`;
      };
      productList.appendChild(div);
    });
  }

  // ---------------- HIỂN THỊ PENDING (DUYỆT) ----------------
  const pendingList = document.getElementById("pendingList");
  if (pendingList) {
    const pending = getPendingProducts();
    pending.forEach((p, index) => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="${p.imageMain}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <button class="btn-duyet">✅ Duyệt</button>
      `;
      div.querySelector(".btn-duyet").onclick = () => {
        const products = getProducts();
        products.push(p);
        saveProducts(products);

        pending.splice(index, 1);
        savePendingProducts(pending);

        alert("✔ Duyệt thành công!");
        window.location.reload();
      };
      pendingList.appendChild(div);
    });
  }

// ---------------- HIỂN THỊ CHI TIẾT ----------------
const detailContainer = document.getElementById("detailContainer");
if (detailContainer) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const product = products.find(p => p.id == id);

  if (!product) {
    detailContainer.innerHTML = "<p>Sản phẩm không tồn tại!</p>";
  } else {
    let currentIndex = 0;

    function renderSlideshow() {
      return `
        <div class="slideshow">
          <img src="${product.detailImages[currentIndex]}" alt="Ảnh chi tiết">
          <button class="prev">←</button>
          <button class="next">→</button>
        </div>
      `;
    }

    detailContainer.innerHTML = `
      <!-- Hàng 1 -->
      <div class="row">
        <div class="left">
          <img src="${product.imageMain}" alt="${product.name}" style="width:100%; max-height:250px; object-fit:cover;">
        </div>
        <div class="right">
          <h2>${product.name}</h2>
          <p><b>Mô tả ngắn:</b> ${product.desc}</p>
        </div>
      </div>

      <!-- Hàng 2 -->
      <div class="row">
        <div class="left" id="slideshowBox">
          ${product.detailImages.length ? renderSlideshow() : "<p>Không có ảnh chi tiết</p>"}
        </div>
        <div class="right">
          <p><b>Chi tiết:</b> ${product.detail || "Không có"}</p>
        </div>
      </div>

      <!-- Hàng 3 -->
      <div class="row">
        <div class="left">
          ${product.link ? `<a href="${product.link}" target="_blank">🔗 Xem sản phẩm tại đây</a>` : "Không có link"}
        </div>
      </div>

      <!-- Hàng 4 -->
      <div class="row">
        <div class="author-box">
          ${product.authorImg ? `<img src="${product.authorImg}" alt="${product.author}">` : ""}
          <p><b>Tác giả:</b> ${product.author}</p>
        </div>
      </div>
    `;

    // Slideshow logic
    if (product.detailImages.length) {
      const slideshowBox = document.getElementById("slideshowBox");
      slideshowBox.addEventListener("click", (e) => {
        if (e.target.classList.contains("prev")) {
          currentIndex = (currentIndex - 1 + product.detailImages.length) % product.detailImages.length;
        } else if (e.target.classList.contains("next")) {
          currentIndex = (currentIndex + 1) % product.detailImages.length;
        }
        slideshowBox.innerHTML = renderSlideshow();
      });
    }
  }
}
// ---------------- COMMENT ----------------
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
    const username = document.getElementById("username").value.trim() || "Ẩn danh";
    const text = document.getElementById("commentInput").value.trim();
    if (!text) return alert("Vui lòng nhập bình luận!");

    const comments = getComments();
    comments.push({ user: username, text });
    saveComments(comments);

    document.getElementById("commentInput").value = "";
    renderComments();
  };

  renderComments();
}


});
