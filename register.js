document.getElementById("register-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(u => u.username === username)) {
    alert("Tên đăng nhập đã tồn tại!");
    return;
  }

  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Đăng ký thành công! Hãy đăng nhập.");
  window.location.href = "login.html";
});
