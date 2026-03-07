
const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

// Login Function
function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin123") {

        document.getElementById("loginPage").style.display = "none";
        document.getElementById("mainPage").classList.remove("hidden");

        loadIssues(); // load issues after login
    }

    else {
        alert("Invalid credentials");
    }

}

// Load Issues

async function loadIssues(filter = "all") {
    const response = await fetch(API_URL);
    const data = await response.json();

    let issues = data.data;

    if (filter === "open") {
        issues = issues.filter(issues => issues.status === "open");

    }

    if (filter === "closed") {
        issues = issues.filter(issues => issues.status === "closed");
    }

    renderIssues(issues);
}

// Render Issues
function renderIssues(issues) {

    const container = document.getElementById("issuesContainer");

    container.innerHTML = "";

    issues.forEach(issue => {

        const card = document.createElement("div");

        let borderColor = "border-blue-500";
        if (issue.status === "open") {
            borderColor = "border-green-500";
        }

        if (issue.status === "closed") {
            borderColor = "border-purple-500";
        }

        card.className = "bg-white shadow-md rounded p-4 hover:shadow-lg transition";

        /* Status Icon */
        let statusIcon = "";

        if (issue.status === "open") {
            statusIcon = `<img src="assets/open-status.png" class="w-5 h-5">`;
        }

        if (issue.status === "closed") {
            statusIcon = `<img src="assets/closed-status.png" class="w-5 h-5">`;
        }

        /* Label Badge */
        let labelsHTML = "";

        if (issue.labels) {
            issue.labels.forEach(label => {
                let icon = "";
                let badgeStyle = "";

                if (label === "bug") {
                    icon = `<i class="fa-solid fa-bug mr-1"></i>`;
                    badgeStyle = "text-red-700 bg-red-200";
                }

                else if (label === "help wanted") {
                    icon = `<i class="fa-solid fa-hand mr-1"></i>`;
                    badgeStyle = "text-yellow-700 bg-yellow-200";
                }

                else if (label === "enhancement") {
                    icon = `<i class="fa-solid fa-arrow-up mr-1"></i>`;
                    badgeStyle = "text-white-700 bg-green-200";
                }

                else if (label === "good first issue") {
                    icon = `<i class="fa-solid fa-seedling" mr-1"></i>`;
                    badgeStyle = "text-white-700 bg-blue-200";
                }

                else if (label === "documentation") {
                    icon = `<i class="fa-solid fa-book" mr-1"></i>`;
                    badgeStyle = "text-purple-700 bg-purple-200";
                }

                labelsHTML += `<span class="px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 whitespace-nowrap ${badgeStyle}">
                    ${icon} ${label.toUpperCase()}
                </span>
                `;
            });
        }

        let priorityBadge = "";

        if (issue.priority === "high") {
            priorityBadge = `<span class="px-2 py-1 rounded text-red-700 bg-red-200 text-xs font-semibold">HIGH</span>`;
        }

        if (issue.priority === "medium") {
            priorityBadge = `<span class="px-2 py-1 rounded text-yellow-700 bg-yellow-200 text-xs font-semibold">MEDIUM</span> `;
        }

        if (issue.priority === "low") {
            priorityBadge = `<span class="px-2 py-1 rounded text-gray-700 bg-gray-200 text-xs font-semibold">LOW</span>`;
        }

        /* Card HTML */

        card.innerHTML = `

        <!-- Upper Section -->

        <div class="flex justify-between items-center mb-2">
            <span class="text-lg">
                ${statusIcon}
            </span>

            ${priorityBadge}
                
        </div>

        <h2 class="font-bold text-lg mb-2">
            ${issue.title}
        </h2>

        <p class="text-gray-600 text-sm mb-3">
            ${issue.description}
        </p>

        <div class="flex gap-2 flex-nowrap mb-4 overflow-x-auto">
            ${labelsHTML}
        </div>

        <hr class="mb-3">

        <!-- Lower Section -->

        <div class ="text-sm text-gray-500">
            <div class="flex justify-between">
                <span>
                    #${issue.id} by ${issue.author}
                </span>
                
                <span>
                    Issued: ${issue.createdAt.split("T")[0]}
                </span>
            </div>

            <div class="flex justify-between mt-1">
                <span>
                    Assignee: ${issue.assignee || "Unassigned"}
                </span>
                
                <span>
                    Updated: ${issue.updatedAt.split("T")[0]}
                </span>
            </div>
        </div>
        
        `;

        container.appendChild(card);

    });

}

// SEARCH FUNCTION

async function searchIssues() {

    const text = document.getElementById("searchInput").value;

    const response = await fetch(
        `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`
    );

    const data = await response.json();

    renderIssues(data.data);

}


// LOAD ISSUES WHEN PAGE STARTS
loadIssues();