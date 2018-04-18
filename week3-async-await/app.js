'use strict';

const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "json";
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status < 400) {
                    resolve(xhr.response);
                } else {
                    reject(new Error(`Network error : ${xhr.status} - ${xhr.statusText}`));
                }
            }
        }
        xhr.send();
    });
}

function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
        const value = options[key];
        if (key === 'html') {
            elem.innerHTML = value;
        } else {
            elem.setAttribute(key, value);
        }
    });
    return elem;
}

function renderRepos(repos) {
    const root = document.getElementById("root");
    const header = createAndAppend("header", root);
    const head = createAndAppend("h1", header, { html: "HYF Repositories" });
    const select = createAndAppend("select", header);
    const info = createAndAppend("div", root, { id: "info" });
    const contributors = createAndAppend("div", root, { id: "contributors" });
    select.addEventListener("change", (event) => {
        rendersAll(event.target.value)
    });

    repos.forEach(repo => {
        const listItem = createAndAppend("option", select, { html: repo.name, value: repo.name });
    });
    rendersAll(repos[0].name);
}

function renderRepository(data) {
    document.getElementById("info").innerHTML = "";
    const infoList = createAndAppend("ul", info, { class: "info-list" });
    const infoListItem1 = createAndAppend("li", infoList, { html: "Repository : " + "<a href = " + data.html_url + ' target="_blank"' + ">" + data.name + "</a>", class: "info-list-item" });
    const infoListItem2 = createAndAppend("li", infoList, { html: "Description : " + data.description, class: "info-list-item" });
    const infoListItem3 = createAndAppend("li", infoList, { html: "Forks : " + data.forks, class: "info-list-item" });
    const infoListItem4 = createAndAppend("li", infoList, { html: "Updated : " + data.updated_at, class: "info-list-item" });
}

function renderContributors(data) {
    document.getElementById("contributors").innerHTML = "";
    const contributorTitle = createAndAppend("h2", contributors, { html: "Contributions", id: "contributor-title" });

    data.forEach(con => {
        const contributorList = createAndAppend("ul", contributors, { class: "contributor-list" });
        const contributorListUrl = createAndAppend("a", contributorList, { href: con.html_url, target: "_blank" });
        const contributorItemImg = createAndAppend("li", contributorListUrl);
        const contributorImg = createAndAppend("img", contributorItemImg, { src: con.avatar_url, class: "contributor-img" });
        const contributorName = createAndAppend("li", contributorList, { html: con.login, class: "contributor-name" });
        const contributorContributions = createAndAppend("li", contributorList, { html: con.contributions, class: "contributor-contributions" });
    });
}

async function main() {
    try {
        const data = await fetchJSON(url);
        renderRepos(data);
    }
    catch (error) {
        const err = document.getElementById('root');
        err.innerHTML = error.message;
    }
}

async function rendersAll(selectedRepo) {
    const ur = 'https://api.github.com/repos/HackYourFuture/' + selectedRepo;
    try {
        const dataRepo = await fetchJSON(ur);
        const dataCon = await fetchJSON(dataRepo.contributors_url);
        renderRepository(dataRepo);
        renderContributors(dataCon);
    }
    catch (error) {
        const err = document.getElementById('root');
        err.innerHTML = error.message;
    }
}

window.onload = main;