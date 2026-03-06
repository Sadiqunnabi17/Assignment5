const issues = [
    {
        id: 1,
        title: "Login button not working",
        description: "User cannot login after clicking the login button",
        status: "open"
    },
    {
        id: 2,
        title: "Page layout broken",
        description: "Homepage layout breaks on mobile screen",
        status: "open"
    }
];

function renderIssues() {
    console.log(issues);
}

renderIssues();

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin123") {
        alert("login successful");
    }
    else {
        alert("Invalid credentials")
    }

}
