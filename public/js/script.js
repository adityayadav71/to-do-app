const toDoInput = document.querySelector(".to-do-input-box");
const toDoList = document.querySelector(".to-do");
const deleteBtn = document.querySelectorAll(".delete");
const toDo = document.getElementsByClassName("to-do-input");
const filterBtn = document.querySelectorAll(".filter");
const allBtn = document.querySelectorAll(".all-to-do");
const activeBtn = document.querySelectorAll(".active-to-do");
const completedBtn = document.querySelectorAll(".completed-to-do");
const clearBtn = document.querySelector(".clear-to-do");
const checkboxes = document.getElementsByClassName("checkbox");
const left = document.getElementsByClassName("left-to-do");
const themeSwitch = document.querySelector(".theme-btn");
const bgImage = document.querySelector(".background-image");
const themeIcon = document.querySelector(".theme-icon");
const logoutBtn = document.querySelector(".logout-btn");

logoutBtn.addEventListener("click", async function () {
  await fetch("/logout", {
    method: "POST",

    body: "",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  window.location.href = "../views/login.ejs";
});
allBtn.forEach((btn) => {
  btn.addEventListener("click", function () {
    Array.from(toDo).forEach((el) => {
      el.style.display = "flex";
    });
    updateCount();
  });
});

activeBtn.forEach((btn) => {
  btn.addEventListener("click", function () {
    Array.from(toDo).forEach((el) => {
      if (
        el.parentElement.classList.contains("to-do") &&
        el.children[0].checked
      )
        el.style.display = "none";
      else el.style.display = "flex";
    });
    updateCount();
  });
});

completedBtn.forEach((btn) => {
  btn.addEventListener("click", function () {
    Array.from(toDo).forEach((el) => {
      if (
        el.parentElement.classList.contains("to-do") &&
        !el.children[0].checked
      )
        el.style.display = "none";
      else el.style.display = "flex";
    });
    updateCount();
  });
});

themeSwitch.addEventListener("click", switchTheme);
function switchTheme() {
  if (!document.body.classList.contains("light-theme")) {
    // Change background image
    bgImage.src = "../images/bg-desktop-light.jpg";
    // Change Theme button icon
    themeIcon.src = "../images/icon-moon.svg";
    // Change body classList
    document.body.classList.add("light-theme");
  } else {
    // Change background image
    bgImage.src = "../images/bg-desktop-dark.jpg";
    // Change Theme button icon
    themeIcon.src = "../images/icon-sun.svg";
    // Change body classList
    document.body.classList.remove("light-theme");
  }
}

function updateCount() {
  Array.from(left).forEach((l) => {
    let items = 0;
    Array.from(toDo).forEach((t) => {
      if (t.parentElement.classList.contains("to-do")) items++;
    });
    l.textContent = `${items} items left`;
  });
}

function fillEmptyToDoList() {
  const html = `
    <div class="no-items">
        <p >Your to do list is empty...</p>
    </div>
  `;
  toDoList.insertAdjacentHTML("beforeend", html);
}

function emptyFilled() {
  const children = Array.from(toDoList.children);
  const filled = [...children].some((child) =>
    child.classList.contains("no-items")
  );
  return filled;
}

function checkEmptyList() {
  const children = Array.from(toDoList.children);
  const empty = ![...children].some((child) =>
    child.classList.contains("to-do-input")
  );
  if (empty) {
    fillEmptyToDoList();
    clearBtn.style.display = "none";
    filterBtn[0].style.display = "none";
    filterBtn[1].style.display = "none";
  } else {
    clearBtn.style.display = "flex";
    filterBtn[0].style.display = "flex";
    filterBtn[1].style.display = "flex";
    document.querySelector(".no-items")?.remove();
  }
}
checkEmptyList();

Array.from(filterBtn).forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const children = Array.from(e.target.closest(".filter").children);
    children.forEach((child) => {
      child.classList.remove("filter-active");
    });
    e.target.classList.add("filter-active");
  });
});

clearBtn.addEventListener("click", function () {
  Array.from(checkboxes).forEach(async (box) => {
    if (box.checked) await deleteToDo(box.parentElement.children[1]);
    if (box.checked && box.parentElement.classList.contains("to-do-input")) {
      box.parentElement.remove();
    }
  });
  checkEmptyList();
  updateCount();
});
function renderToDos() {
  [...toDo].forEach((el) => {
    if (el.parentElement.classList.contains("to-do")) el.remove();
  });
  fetch("/getToDo")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((entry) => {
        const html = `
            <div class="to-do-input">
              <input type="checkbox" id="checkbox-${
                toDo.length + 1
              }" class="checkbox" />
              <label for="checkbox-${toDo.length + 1}" class="checkbox-label">${
          entry.toDo
        }</label>
              <button class="delete">
                <img class="delete" src="/images/icon-cross.svg" alt="delete-this-to-do" />
              </button>
            </div>
          `;
        toDoList.insertAdjacentHTML("beforeend", html);
      });
      updateCount();
      checkEmptyList();
    });
}
renderToDos();

toDoInput.addEventListener("keypress", async function (e) {
  if (e.key === "Enter") {
    if (toDoInput.value === "") return;
    const input = this.value;
    const data = { input };
    await fetch("/addToDo", {
      method: "POST",

      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    renderToDos();
    toDoInput.value = "";
  }
});

toDoList.addEventListener("click", async function (e) {
  if (e.target.classList.contains("delete")) {
    const container = e.target.closest(".to-do-input") ?? undefined;
    if (container !== undefined) {
      await deleteToDo(container.children[1]);
      container.remove();
    }
    checkEmptyList();
    updateCount();
  }
});

async function deleteToDo(toDoEl) {
  const toDo = toDoEl.textContent;
  const data = { toDo };
  await fetch("/removeToDo", {
    method: "POST",

    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}
