const input = document.querySelector('.search-input');
const search = document.querySelector('.search');
const repo = document.querySelector('.repo');

input.addEventListener("keyup", debounce(showRequest, 450));

function debounce(fn, ms) {
    let timer;

    return function () {
        const fnCall = () => {
            fn.apply(this, arguments);
        };

        clearTimeout(timer);
        timer = setTimeout(fnCall, ms);
    };
}

function searchData(data) {
    let link = document.createElement("div");

    link.insertAdjacentHTML("afterbegin",
        `<div class ='search-link'>${data}</div>`
    );

    return link;
}

function addRepoLIst(data) {
    let add = document.createElement("div");
    add.className = "repo-list";

    add.insertAdjacentHTML("afterbegin",
      `
        <div class='text'>Name: ${data.name}</div>
        <div class='text'>Owner: ${data.owner["login"]}</div>
        <div class='text'>Stars: ${data.stargazers_count}</div>
      `
    );
  
    add.append(delRepoList(add));

    searchClickHandler(add, data);
  
    return add;
}
  
function delRepoList(data) {
    const repoClose = document.createElement("div");
    repoClose.classList.add("repo-close");

    repoClose.addEventListener("click", () => {
        data.remove();
    });

    searchClickHandler(repoClose, data);
  
    return repoClose;
}

const searchClickHandler = () => {
    search.removeEventListener("click", (e) => {
        for (let i = 0; i < data.items.length; i++) {
            if (e.target.innerText == data.items[i].name) {
                repo.prepend(addRepoLIst(data.items[i]));

                e.target.innerText = "";
                search.textContent = "";
            }
        }

        input.value = "";
    });
}

async function showRequest(e) {
    input.value = input.value.trim();

    if (input.value.length === 0 && input.value === "") {
        return search.style.display = "none";
    }

    search.style.display = "block";
    search.textContent = "";

    try {
        const response = await fetch(
            `https://api.github.com/search/repositories?q=${input.value}&per_page=5`
        );

        const data = await response.json();

        data.hasOwnProperty('items') ? data.items.map((item) => {
            search.append(searchData(item.name));
        }) : null;

        search.addEventListener("click", (e) => {
            for (let i = 0; i < data.items.length; i++) {
                if (e.target.innerText == data.items[i].name) {
                    repo.prepend(addRepoLIst(data.items[i]));

                    e.target.innerText = "";
                    search.textContent = "";
                }
            }

            input.value = "";
        });
    } catch (err) {
        console.error('Ошибка:', err);
    }
}