const resetPasswordForm = document.getElementById("resetPasswordForm");

resetPasswordForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(resetPasswordForm);
  const payload = {};

  data.forEach((value, key) => (payload[key] = value));

  fetch("/api/sessions/resetPassword", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status == 200) {
      console.log("password reset succesfully");
      setTimeout(() => {
        window.location.href = "/login"; // <- redirección desde el front
      }, 2000);
    }
  });
});
