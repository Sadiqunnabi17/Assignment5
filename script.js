
const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

async function loadIssues(filter = "all") {
    const response =await fetch(API_URL);
    const data = await response.json();

    let issues = data.data;

    if (filter === "open") {
        issues =issues.filter(issues => issues.status === "open");

    }

    if (filter === "closed") {
        issues =issues.filter(issues => issues.status === "closed");
    }

    renderIssues(issues);
}

function renderIssues(issues) {

    const container = document.getElementById("issuesContainer");

    container.innerHTML = "";

    issues.forEach(issue => {

        const card = document.createElement("div");

        card.className = "bg-white shadow-md rounded p-4 border-t-4";

        card.innerHTML = `
            <h2 class="font-bold text-lg mb-2">${issue.title}</h2>

            <p class="text-gray-600 text-sm mb-2">
            ${issue.description}
            </p>

            <p class="text-sm"><b>Status:</b> ${issue.status}</p>
            <p class="text-sm"><b>Category:</b> ${issue.category}</p>
            <p class="text-sm"><b>Author:</b> ${issue.author}</p>
        `;

        container.appendChild(card);

    });

}

function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin123") {

        document.querySelector(".bg-white").style.display = "none";
        document.getElementById("mainPage").classList.remove("hidden");

        loadIssues(); // load issues after login
    }

    else {
        alert("Invalid credentials");
    }

}

// LOAD ISSUES WHEN PAGE STARTS
loadIssues();