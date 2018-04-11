'use strict';

const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

function fetchJSON(url){
    return new Promise((resolve,reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET",url);
    xhr.responseType = "json";
    xhr.onreadystatechange = ()=>{
        if (xhr.readyState === 4){
            if (xhr.status < 400 ){
                resolve(xhr.response);
            } else {
                reject(new Error(`Network error : ${xhr.status} - ${xhr.statusText}`));
            }
        }
    }
    xhr.send();
});
}

function createAndAppend(tagName,parent){
    const element = document.createElement(tagName);
    parent.appendChild(element);
    return element;
}

function renderRepos(repos){
    const root = document.getElementById("root");
    const header = createAndAppend("header",root);
    const head = createAndAppend("h1",header);
    head.innerHTML = "HYF Repositories";
    const select = createAndAppend("select",header);
    const info = createAndAppend("div",root);
    info.setAttribute("id","info");
    const contributors = createAndAppend("div",root);
    contributors.setAttribute("id","contributors");
    select.addEventListener("change",(event)=>{
        rendersAll(event.target.value)
    });
    
    repos.forEach(repo => {
        const listItem = createAndAppend("option",select);
        listItem.innerHTML = repo.name;
        listItem.setAttribute("value", repo.name);
    });
}

function renderCb (data) {
    document.getElementById("info").innerHTML = "";
    const infoList = createAndAppend("ul",info);
    infoList.setAttribute("class","info-list");
    const infoListItem1 = createAndAppend("li",infoList);
    infoListItem1.setAttribute("class","info-list-item");
    const infoListItem2 = createAndAppend("li",infoList);
    infoListItem2.setAttribute("class","info-list-item");
    const infoListItem3 = createAndAppend("li",infoList);
    infoListItem3.setAttribute("class","info-list-item");
    const infoListItem4 = createAndAppend("li",infoList);
    infoListItem4.setAttribute("class","info-list-item");
    infoListItem1.innerHTML = "Repository : "+"<a href = "+data.html_url+ ' target="_blank"'+ ">"+data.name+"</a>";
    infoListItem2.innerHTML = "Description : " + data.description;
    infoListItem3.innerHTML = "Forks : " + data.forks;
    infoListItem4.innerHTML = "Updated : " + data.updated_at;
    console.log(data);
}

function renderContributors (data) {
    document.getElementById("contributors").innerHTML = "";
    const contributorTitle = createAndAppend("h2",contributors);
    contributorTitle.setAttribute("id","contributor-title");
    contributorTitle.innerHTML = "Contributions";
    
    data.forEach(con => {
        const contributorList = createAndAppend("ul",contributors);
        contributorList.setAttribute("class","contributor-list");
        const contributorItemImg =  createAndAppend("li",contributorList);
        const contributorImg = createAndAppend("img",contributorItemImg);
        contributorImg.setAttribute("src",con.avatar_url);
        contributorImg.setAttribute("class","contributor-img");
        const contributorName = createAndAppend("li",contributorList);
        contributorName.setAttribute("class","contributor-name");
        const contributorContributions = createAndAppend("li",contributorList);
        contributorContributions.setAttribute("class","contributor-contributions");
        contributorName.innerHTML = con.login;
        contributorContributions.innerHTML = con.contributions;
    });   
}

function main(){
    fetchJSON(url)
        .then(data =>{
        renderRepos(data);
        })
        .catch(error => {
            const err = document.getElementById('root');
            err.innerHTML = error.message;
        });
}

function rendersAll(selectedRepo){
    const ur = 'https://api.github.com/repos/HackYourFuture/'+selectedRepo;
    const uc = 'https://api.github.com/repos/HackYourFuture/'+selectedRepo+'/contributors'
    fetchJSON(ur)
    .then(data =>{
        renderCb(data);
        })    
    .catch(error => {
        const err = document.getElementById('root');
        err.innerHTML = error.message;
        });
    fetchJSON(uc)
    .then(data =>{
        renderContributors(data);
        })    
    .catch(error => {
        const err = document.getElementById('root');
        err.innerHTML = error.message;
    });
}

window.onload = main();