async function loadIssues(){
    const response = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const result = await response.json();
    showIssues(result.data);
}

loadIssues();

function showIssues(issues){

let container = document.getElementById("issues");

issues.forEach(issue => {

let labelsHTML = "";

// 🎨 Label color map
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


// 🎨 Priority color map
const priorityColors = {
high: "bg-red-200 text-red-600",
medium: "bg-yellow-200 text-yellow-700",
low: "bg-green-200 text-green-600"
};

let priorityColor = priorityColors[issue.priority] || "bg-gray-200";


// ✅ Status color map (ADDED)
const statusColors = {
open: "border-t-4 border-green-500",
closed: "border-t-4 border-blue-500"
};

let statusColor = statusColors[issue.status] || "";


let card = `
<div class="bg-[#EFEFEF] p-2 rounded-md ${statusColor}">

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

container.innerHTML += card;

});

}