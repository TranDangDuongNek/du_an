import { getFirestore, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { app } from "./firebase-config.js";

const db = getFirestore(app);

async function loadPending() {
    let container = document.getElementById("pendingList");
    container.innerHTML = "";

    let querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach((docSnap) => {
        let data = docSnap.data();
        if (data.status === "pending") {
            let div = document.createElement("div");
            div.innerHTML = `
                <h3>${data.name}</h3>
                <p>${data.price}</p>
                <p>${data.description}</p>
                <img src="${data.imageUrl}" width="150">
                <button onclick="approveProduct('${docSnap.id}')">Duyệt</button>
                <button onclick="rejectProduct('${docSnap.id}')">Xóa</button>
            `;
            container.appendChild(div);
        }
    });
}

window.approveProduct = async (id) => {
    await updateDoc(doc(db, "products", id), { status: "approved" });

    // xóa id khỏi localStorage
    let pending = JSON.parse(localStorage.getItem("pendingProducts")) || [];
    pending = pending.filter(pid => pid !== id);
    localStorage.setItem("pendingProducts", JSON.stringify(pending));

    loadPending();
};

window.rejectProduct = async (id) => {
    await updateDoc(doc(db, "products", id), { status: "rejected" });
    loadPending();
};

loadPending();
