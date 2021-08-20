const user = document.querySelector(".userName").id;
const mainarea = document.getElementById("mainarea");
const insertForm = document.getElementById("insertForm");
const title = document.getElementById("title");
const description = document.getElementById("description");
const completed = document.getElementById("completed");
const logout = document.querySelector(".logout");
const logoutall = document.querySelector(".logoutall");
const modal = document.querySelector(".modal");

var taskToedit = null;

window.onload = async function () {
  history.pushState(null, "", location.href.split("?")[0]);
  title.value = "";
  description.value = "";
  pausedsystem();
  var url = `/task${user}`;
  try {
    var res = await fetch(url);
    var datas = await res.json();
    if (!datas.error) {
      return dataCreator(datas);
    } else {
      throw new Error(`${datas.error}`);
    }
  } catch (error) {
    resumesystem();
    errorcreator(error);
  }
};

function toggle() {
  document.querySelector(".settings").classList.toggle("show");
}

insertForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (completed.value !== "true" && completed.value !== "false") {
    return errorcreator("completederror");
  }
  var insertData = {
    title: title.value,
    description: description.value,
    completed: completed.value,
    owner: user,
  };
  title.value = "";
  description.value = "";
  completed.value = "None";

  if (!insertForm.childNodes[7].childNodes[3].className.includes("hidden")) {
    document.querySelector(".cancel").click();
    try {
      pausedsystem();
      var res = await fetch(`/task${taskToedit}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(insertData),
      });

      var datas = await res.json();
      if (!datas.error) {
        taskToedit = null;
        return dataCreator(datas);
      } else {
        taskToedit = null;
        throw new Error(`${datas.error}`);
      }
    } catch (error) {
      resumesystem();
      errorcreator(error);
    }
  } else {
    try {
      pausedsystem();
      var res = await fetch("/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(insertData),
      });

      var datas = await res.json();
      if (!datas.error) {
        return dataCreator(datas);
      } else {
        throw new Error(`${datas.error}`);
      }
    } catch (error) {
      resumesystem();
      errorcreator(error);
    }
  }
});

function dataCreator(datas) {
  if (!datas.length) {
    var para = document.createElement("p");
    para.innerHTML = "No task found.";
    para.classList.add("nodata");
    resumesystem();
    mainarea.innerHTML = "";
    return mainarea.appendChild(para);
  }
  mainarea.innerHTML = "";
  datas.forEach((data, idx) => {
    var div = document.createElement("div");
    div.id = data._id;
    div.classList.add("taskitem");
    div.innerHTML = `<div class="content">
    <div><b>Title:</b> ${data.title}</div>
    <div><b>Desc:</b> ${data.description}</div>
    <div><b>Status:</b> ${data.completed}</div></div>
    <div class="taskitembutton">
    <button class="edittask" onClick="editHandler(this)" >  <img
    src="https://img.icons8.com/glyph-neue/50/000000/edit.png"
  /></button>
    <button class="deletetask" onClick="deleteHandler(this)" class="delete"><img
    src="https://img.icons8.com/ios-glyphs/60/000000/delete-sign.png"
  /></button></div>
    `;
    mainarea.insertBefore(div, mainarea.childNodes[0]);
  });
  resumesystem();
}

const editHandler = async (event) => {
  var parent = document.getElementById(event.parentNode.parentNode.id);
  title.value = parent.childNodes[0].childNodes[1].innerText.replace(
    "Title: ",
    ""
  );
  description.value = parent.childNodes[0].childNodes[3].innerText.replace(
    "Desc: ",
    ""
  );
  completed.value = parent.childNodes[0].childNodes[5].innerText.includes(
    "true"
  )
    ? true
    : false;
  taskToedit = parent.id;
  document.querySelector(".submit").classList.add("hidden");
  document.querySelectorAll(".edit").forEach((element) => {
    element.classList.remove("hidden");
  });
};

document.querySelector(".cancel").addEventListener("click", () => {
  title.value = "";
  description.value = "";
  completed.value = "None";
  document.querySelector(".submit").classList.remove("hidden");
  document.querySelectorAll(".edit").forEach((element) => {
    element.classList.add("hidden");
  });
});

const deleteHandler = async (event) => {
  const taskid = event.parentNode.parentNode.id;
  document.querySelector(".cancel").click();
  try {
    pausedsystem();
    var res = await fetch(`/task${taskid}`, {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner: user }),
    });

    var datas = await res.json();

    if (!datas.error) {
      return dataCreator(datas);
    } else {
      throw new Error(`${datas.error}`);
    }
  } catch (error) {
    resumesystem();
    errorcreator(error);
  }
};

logout.addEventListener("click", async () => {
  try {
    document.body.style.filter = "blur(2px)";
    var res = await fetch("/logout", { method: "POST", redirect: "follow" });
    if (res.redirected) {
      window.location.href = res.url;
    }
  } catch (error) {
    document.body.style.filter = "blur(0px)";
    errorcreator(error);
  }
});

logoutall.addEventListener("click", async () => {
  try {
    document.body.style.filter = "blur(2px)";
    var res = await fetch("/logoutall", { method: "POST", redirect: "follow" });
    if (res.redirected) {
      window.location.href = res.url;
    }
  } catch (error) {
    document.body.style.filter = null;
    errorcreator(error);
  }
});

function errorcreator(error) {
  var p = document.createElement("p");
  p.classList.add("error");
  if (error === "completederror") {
    p.innerText = "Please Select Completed Status";
  } else {
    p.innerText = "Network Error, Kindly try again.";
  }
  document.body.appendChild(p);
  setTimeout(() => {
    p.remove();
  }, 2000);
}

function pausedsystem() {
  modal.classList.remove("hidden");
  mainarea.style.filter = "blur(2px)";
  document.querySelector(".submit").setAttribute("disabled", "disabled");
  document.querySelector("#edit").setAttribute("disabled", "disabled");
  document.querySelector("#cancel").setAttribute("disabled", "disabled");
  document
    .querySelectorAll(".edittask")
    .forEach((btn) => btn.setAttribute("disabled", "disabled"));
  document
    .querySelectorAll(".deletetask")
    .forEach((btn) => btn.setAttribute("disabled", "disabled"));
  logout.setAttribute("disabled", "disabled");
  logoutall.setAttribute("disabled", "disabled");
}

function resumesystem() {
  modal.classList.add("hidden");
  mainarea.style.filter = null;
  document.querySelector(".submit").removeAttribute("disabled");
  document.querySelector("#edit").removeAttribute("disabled");
  document.querySelector("#cancel").removeAttribute("disabled");
  document
    .querySelectorAll(".edittask")
    .forEach((btn) => btn.removeAttribute("disabled"));
  document
    .querySelectorAll(".deletetask")
    .forEach((btn) => btn.removeAttribute("disabled"));
  logout.removeAttribute("disabled");
  logoutall.removeAttribute("disabled");
}
