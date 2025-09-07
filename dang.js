import { db, storage } from "./firebase-config.js";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

async function uploadImage(file, folder) {
  if (!file) return "";
  const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("productName").value;
  const desc = document.getElementById("productDesc").value;
  const detail = document.getElementById("productDetail").value;
  const link = document.getElementById("productLink").value;
  const author = document.getElementById("authorName").value;

  const imageFile = document.getElementById("productImage").files[0];
  const imageMainUrl = await uploadImage(imageFile, "products");

  const detailFiles = document.getElementById("productImages").files;
  const detailUrls = [];
  for (let file of detailFiles) {
    const url = await uploadImage(file, "details");
    if (url) detailUrls.push(url);
  }

  const authorFile = document.getElementById("authorImage").files[0];
  const authorUrl = await uploadImage(authorFile, "authors");

  await addDoc(collection(db, "chi_tiet"), {
    ten_san_pham: name,
    mo_ta_ngan: desc,
    chi_tiet: detail,
    link: link || "",
    tac_gia: author,
    anh_chinh: imageMainUrl,
    anh_chi_tiet: detailUrls,
    anh_tac_gia: authorUrl,
    ngay_tao: new Date().toISOString()
  });

  alert("✅Đăng sản phẩm thành công!");
  window.location.href = "san_pham.html";
});

