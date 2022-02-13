function upload() {
    window.location.href = "/dashboard#upload";
}

function githubLogin() {
    window.location.href = "/auth/github";
}

function logout() {
    window.location.href = "/auth/logout";
}

// Account Delete Alert
document.getElementById("delete").addEventListener("click", function (e) {
    e.preventDefault();
    if (
        confirm(
            "⚠ Are you sure you want to delete your account? \n ⛔ Once deleted, you will not be able to recover your account!"
        )
    ) {
        window.location.href = this.href;
    }
});
