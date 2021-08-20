const modal = document.querySelector(".modal");
const form = document.getElementById("form");
const spinner = document.querySelector(".spinner-icon");
var isError = false;

const fileEl = document.querySelector("input[type=file]");
const userImageEl = document.querySelector(".userImage");
fileEl.addEventListener("change", (e) => {
  const [file] = fileEl.files;
  userImageEl.src = URL.createObjectURL(file);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  modal.classList.remove("hidden");
  const body = new FormData(event.target);
  fetch(event.target.action, {
    method: "POST",
    redirect: "follow",
    body,
  })
    .then((res) => {
      spinner.classList.add("orange");
      if (res.redirected) {
        window.location.href = res.url;
        return;
      } else {
        isError = true;
        return res.json();
      }
    })
    .then((body) => {
      if (isError === true) {
        var p = document.createElement("p");
        p.classList.add("error");
        p.innerText = body.error;
        modal.classList.add("hidden");
        document.body.appendChild(p);
        setTimeout(() => {
          p.remove();
        }, 5000);
      }
      isError = false;
    })
    .catch((error) => {
      var p = document.createElement("p");
      p.classList.add("error");
      p.innerText = error.message;
      modal.classList.add("hidden");
      document.body.appendChild(p);
      setTimeout(() => {
        p.remove();
      }, 5000);
    });
});
