
function showSpinner() {
    document.getElementById("spinner").classList.remove("hidden");
}

function hideSpinner() {
    document.getElementById("spinner").classList.add("hidden");
}

const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

// Login Function
function login(event) {

    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        return; // do nothing if fields empty
    }

    if (username === "admin" && password === "admin123") {

        document.getElementById("loginPage").style.display = "none";
        document.getElementById("mainPage").classList.remove("hidden");

        loadIssues();

    }
    else {
        alert("Invalid Credentials");
    }

}

function formatName(name) {
    return name
        .replace(/_/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
}

// Counter Section
function setActiveButton(type, button) {

    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(btn => {
        btn.classList.remove(
            "bg-blue-600", "bg-green-600", "bg-purple-600",
            "text-white"
        );

        if (btn !== button) {
            if (btn.dataset.type === "all") {
                btn.classList.add("hover:bg-blue-100", "text-blue-500", "border-blue-500");
            }

            if (btn.dataset.type === "open") {
                btn.classList.add("hover:bg-green-100", "text-green-500", "border-green-500");
            }

            if (btn.dataset.type === "closed") {
                btn.classList.add("hover:bg-purple-100", "text-purple-500", "border-purple-500");
            }

        }

        if (btn === button) {
            btn.classList.remove(
                "hover:bg-blue-100",
                "hover:bg-green-100",
                "hover:bg-purple-100"
            );
        }

    });

    if (type === "all") {
        button.classList.add("bg-blue-600", "text-white");
    }

    if (type === "open") {
        button.classList.add("bg-green-600", "text-white");
    }

    if (type === "closed") {
        button.classList.add("bg-purple-600", "text-white");
    }
}

function updateCounter(type, issues) {
    let count = 0;
    let title = "";
    let colorClass = "";

    if (type === "all") {
        count = issues.length;
        title = "All Issues";
        colorClass = "text-blue-600";

    }

    if (type === "open") {
        count = issues.filter(i => i.status === "open").length;
        title = "Open Issues";
        colorClass = "text-green-600";

    }

    if (type === "closed") {
        count = issues.filter(i => i.status === "closed").length;
        title = "Closed Issues";
        colorClass = "text-purple-600";

    }

    const titleElement = document.getElementById("issueTitle");
    const countElement = document.getElementById("issueCount");

    // update number
    countElement.textContent = count;

    // update title text
    titleElement.textContent = title;

    // remove previous colors
    titleElement.classList.remove("text-blue-600", "text-green-600", "text-purple-600");
    countElement.classList.remove("text-blue-600", "text-green-600", "text-purple-600");

    // apply new color
    titleElement.classList.add(colorClass);
    countElement.classList.add(colorClass);

}

// Load Issues
async function loadIssues(filter = "all", button = null) {
    showSpinner();

    if (button) {
        setActiveButton(filter, button); // Highlight the clicked button
    }

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        await new Promise(resolve => setTimeout(resolve, 400)); // simulate loading

        let issues = data.data;

        // Filter issues based on type
        if (filter === "open") {
            issues = issues.filter(issue => issue.status === "open");
        } else if (filter === "closed") {
            issues = issues.filter(issue => issue.status === "closed");
        }

        // Render the filtered issues
        renderIssues(issues);

        // Update counter info
        updateCounter(filter, data.data);

        // Update Open/Closed indicators
        const openInd = document.getElementById("openIndicator");
        const openLbl = document.getElementById("openLabel");
        const closedInd = document.getElementById("closedIndicator");
        const closedLbl = document.getElementById("closedLabel");

        if (filter === "all") {
            openInd.style.display = "inline-block";
            openLbl.style.display = "inline-block";
            closedInd.style.display = "inline-block";
            closedLbl.style.display = "inline-block";
        } else if (filter === "open") {
            openInd.style.display = "inline-block";
            openLbl.style.display = "inline-block";
            closedInd.style.display = "none";
            closedLbl.style.display = "none";
        } else if (filter === "closed") {
            openInd.style.display = "none";
            openLbl.style.display = "none";
            closedInd.style.display = "inline-block";
            closedLbl.style.display = "inline-block";
        }

    } catch (err) {
        console.error("Error loading issues:", err);
        alert("Failed to load issues. Please try again.");
    }

    hideSpinner();
}

async function searchIssues() {
    const input = document.getElementById("searchInput");
    const searchText = input.value.trim();

    if (!searchText) {
        // If empty search, load all issues
        const allBtn = document.querySelector('[data-type="all"]');
        loadIssues("all", allBtn);
        input.value = "";
        return;
    }

    showSpinner();

    try {
        const response = await fetch(
            `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`
        );
        const data = await response.json();

        renderIssues(data.data);
        updateCounter("all", data.data);

        // Show both indicators for search results
        const openInd = document.getElementById("openIndicator");
        const openLbl = document.getElementById("openLabel");
        const closedInd = document.getElementById("closedIndicator");
        const closedLbl = document.getElementById("closedLabel");

        openInd.style.display = "inline-block";
        openLbl.style.display = "inline-block";
        closedInd.style.display = "inline-block";
        closedLbl.style.display = "inline-block";

        input.value = ""; // Clear search input

    } catch (err) {
        console.error("Search failed:", err);
        alert("Search failed. Please try again.");
    }

    hideSpinner();
}

// Render Issues
function renderIssues(issues) {

    const container = document.getElementById("issuesContainer");

    container.innerHTML = "";

    issues.forEach(issue => {

        const card = document.createElement("div");

        let borderColor = "border-t-blue-500";
        if (issue.status === "open") {
            borderColor = "border-t-green-500";
        }

        if (issue.status === "closed") {
            borderColor = "border-t-purple-500";
        }

        card.className = `relative bg-white border-t-4 ${borderColor} rounded-lg p-4 shadow-md cursor-pointer hover:shadow-lg transition`;
        card.onclick = () => openIssueModal(issue.id);


        /* Status Icon */
        let statusIcon = "";

        if (issue.status === "open") {
            statusIcon = `<img src="open-status.png" class="w-5 h-5">`;
        }

        if (issue.status === "closed") {
            statusIcon = `<img src="closed-status.png" class="w-5 h-5">`;
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
            priorityBadge = `<span class="px-2 py-1 rounded text-gray-800 bg-gray-200 text-xs font-semibold">LOW</span>`;
        }

        /* Card HTML */

        card.innerHTML = `

        <!-- Upper Section -->

        <div class="flex items-center justify-between mb-2">
            <span class="text-lg">
                ${statusIcon}
            </span>

            <span class="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-blue-600">
                Issue #${issue.id}
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
                <span><strong>
                    Author:</strong> ${formatName(issue.author)}
                </span>
                
                <span><strong>
                    Issued:</strong> ${new Date(issue.createdAt).toLocaleDateString()}
                </span>
            </div>

            <div class="flex justify-between mt-1">
                <span><strong>
                    Assignee:</strong> ${formatName(issue.assignee) || "Unassigned"}
                </span>
                
                <span><strong>
                    Updated:</strong> ${new Date(issue.createdAt).toLocaleDateString()}
                </span>
            </div>
        </div>
        
        `;

        container.appendChild(card);

    });

}

// Issues Modal

async function openIssueModal(id) {

    showSpinner();

    const response = await fetch(
        `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
    );

    const data = await response.json();

    await new Promise(resolve => setTimeout(resolve, 400));


    const issue = data.data;

    document.getElementById("modalTitle").innerText = issue.title;

    const statusEl = document.getElementById("modalStatus");
    statusEl.innerText = issue.status.toUpperCase();

    if (issue.status === "open") {
        statusEl.className = "bg-green-600 text-white px-3 py-1 text-sm rounded";
    } else {
        statusEl.className = "bg-purple-600 text-white px-3 py-1 text-sm rounded";
    }

    document.getElementById("modalAuthor").innerHTML =
        "<strong>Author:</strong> " + formatName(issue.author);

    document.getElementById("modalDate").innerHTML =
        "<strong>Issue Date:</strong> " + new Date(issue.createdAt).toLocaleDateString();

    document.getElementById("modalDescription").innerHTML =
        issue.description;

    const tagsContainer = document.getElementById("modalTags");
    tagsContainer.innerHTML = "";

    issue.labels.forEach(label => {

        let badgeStyle = "";
        let icon = "";

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
            badgeStyle = "text-green-700 bg-green-200";
        }

        else if (label === "good first issue") {
            icon = `<i class="fa-solid fa-seedling mr-1"></i>`;
            badgeStyle = "text-blue-700 bg-blue-200";
        }

        else if (label === "documentation") {
            icon = `<i class="fa-solid fa-book mr-1"></i>`;
            badgeStyle = "text-purple-700 bg-purple-200";
        }

        tagsContainer.innerHTML += `
        <span class="px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${badgeStyle}">
            ${icon} ${label.toUpperCase()}
        </span>
    `;
    });

    document.getElementById("modalAssignee").innerText =
        formatName(issue.assignee) || "Unassigned";

    const priorityEl = document.getElementById("modalPriority");

    if (issue.priority === "high") {
        priorityEl.className = "px-2 py-1 rounded text-red-700 bg-red-200 text-xs font-semibold";
        priorityEl.innerText = "HIGH";
    }

    if (issue.priority === "medium") {
        priorityEl.className = "px-2 py-1 rounded text-yellow-700 bg-yellow-200 text-xs font-semibold";
        priorityEl.innerText = "MEDIUM";
    }

    if (issue.priority === "low") {
        priorityEl.className = "px-2 py-1 rounded text-gray-700 bg-gray-200 text-xs font-semibold";
        priorityEl.innerText = "LOW";
    }

    document.getElementById("issueModal").classList.remove("hidden");
    document.getElementById("issueModal").classList.add("flex");

    hideSpinner();
}

// Close Modal
function closeModal() {
    const modal = document.getElementById("issueModal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}


// Load Issues When Page Starts
window.onload = () => {
    const allBtn = document.querySelector('[data-type="all"]');
    loadIssues("all", allBtn);

    document.getElementById("searchInput")
        .addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                searchIssues();

            }
        });
}

document.getElementById("username").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("password").focus();
    }
});