let allIssues = [];

async function loadIssues(){

// show loader
document.getElementById("loader").classList.remove("hidden");

const response = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
const result = await response.json();

allIssues = result.data;
showIssues(allIssues);

// hide loader
document.getElementById("loader").classList.add("hidden");

}

loadIssues();

function showIssues(issues){

let container = document.getElementById("issues");
container.innerHTML = "";

// update issue count
updateIssueCount(issues);

issues.forEach(issue => {

let labelsHTML = "";

// label color map
const labelColors = {
bug: "bg-red-200 text-red-600",
"help wanted": "bg-yellow-200 text-yellow-700",
enhancement: "bg-purple-200 text-purple-700",
documentation: "bg-blue-200 text-blue-700"
};

issue.labels.forEach(label => {

let color = labelColors[label] || "bg-gray-200 text-gray-600";

labelsHTML += `<div class="badge ${color} font-semibold text-xs">${label.toUpperCase()}</div>`;

});

// priority colors
const priorityColors = {
high: "bg-red-200 text-red-600",
medium: "bg-yellow-200 text-yellow-700",
low: "bg-green-200 text-green-600"
};

let priorityColor = priorityColors[issue.priority] || "bg-gray-200";

// status colors
const statusColors = {
open: "border-t-4 border-green-500",
closed: "border-t-4 border-blue-500"
};

let statusColor = statusColors[issue.status] || "";

let card = `
<div onclick="openModal(${issue.id})" class="bg-[#EFEFEF] p-2 rounded-md ${statusColor} cursor-pointer">

<div class="flex justify-between">
<div>
<img src="assets/Open-Status.png" alt="">
</div>

<div>
<div class="badge ${priorityColor} font-semibold capitalize">${issue.priority}</div>
</div>
</div>

<h2 class="font-semibold pt-2">${issue.title}</h2>

<p class="text-[#64748B] line-clamp-2">${issue.description}</p>

<div class="flex gap-4 pt-2">
${labelsHTML}
</div>

<hr class="mt-2 text-gray-300">

<div class="text-gray-400">
<p>#${issue.id} by ${issue.author}</p>
</div>

<div class="text-gray-400">
<p>${new Date(issue.createdAt).toLocaleDateString()}</p>
</div>

</div>
`;

container.insertAdjacentHTML("beforeend", card);

});

}


// update issue count
function updateIssueCount(issues){
document.getElementById("issueCount").innerText = issues.length + " Issues";
}


// button active style
function setActiveButton(clickedBtn){

let buttons = document.querySelectorAll(".filterBtn");

buttons.forEach(btn => {
btn.classList.remove("bg-blue-600","text-white");
btn.classList.add("bg-white","text-blue-600");
});

clickedBtn.classList.remove("bg-white","text-blue-600");
clickedBtn.classList.add("bg-blue-600","text-white");

}


// filter buttons
document.getElementById("allBtn").addEventListener("click", function(){
setActiveButton(this);
showIssues(allIssues);
});

document.getElementById("openBtn").addEventListener("click", function(){
setActiveButton(this);
const openIssues = allIssues.filter(issue => issue.status === "open");
showIssues(openIssues);
});

document.getElementById("closedBtn").addEventListener("click", function(){
setActiveButton(this);
const closedIssues = allIssues.filter(issue => issue.status === "closed");
showIssues(closedIssues);
});


// search issues
async function searchIssues(searchText){

// show loader
document.getElementById("loader").classList.remove("hidden");

const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`);
const result = await response.json();

showIssues(result.data);

// hide loader
document.getElementById("loader").classList.add("hidden");

}


// search debounce
let timer;

document.getElementById("searchInput").addEventListener("input", function(){

clearTimeout(timer);

let searchText = this.value.trim();

timer = setTimeout(()=>{

if(searchText === ""){
showIssues(allIssues);
}
else{
searchIssues(searchText);
}

},300);

});


// open modal
function openModal(issueId){

let issue = allIssues.find(i => i.id === issueId);

document.getElementById("modalTitle").innerText = issue.title;
document.getElementById("modalDescription").innerText = issue.description;
document.getElementById("modalAuthor").innerText = issue.author;
document.getElementById("modalDate").innerText = new Date(issue.createdAt).toLocaleDateString();
document.getElementById("modalAssignee").innerText = issue.assignee;

// status badge
let status = document.getElementById("modalStatus");
status.innerText = issue.status.charAt(0).toUpperCase() + issue.status.slice(1);

if(issue.status === "open"){
status.className = "bg-green-500 text-white px-3 py-1 rounded-full text-xs";
}else{
status.className = "bg-gray-400 text-white px-3 py-1 rounded-full text-xs";
}


// priority badge
let priority = document.getElementById("modalPriority");
priority.innerText = issue.priority.toUpperCase();

if(issue.priority === "high"){
priority.className = "bg-red-500 text-white px-3 py-1 rounded-full text-xs";
}
else if(issue.priority === "medium"){
priority.className = "bg-yellow-400 text-black px-3 py-1 rounded-full text-xs";
}
else{
priority.className = "bg-green-500 text-white px-3 py-1 rounded-full text-xs";
}


// labels
let labelsContainer = document.getElementById("modalLabels");
labelsContainer.innerHTML = "";

issue.labels.forEach(label=>{
labelsContainer.innerHTML += `<span class="badge">${label.toUpperCase()}</span>`;
});


// show modal
let modal = document.getElementById("issueModal");
modal.classList.remove("hidden");
modal.classList.add("flex");

}


// close modal
function closeModal(){

let modal = document.getElementById("issueModal");

modal.classList.remove("flex");
modal.classList.add("hidden");

}


// close when clicking outside
document.getElementById("issueModal").addEventListener("click", function(e){

if(e.target.id === "issueModal"){
closeModal();
}

});