```javascript
// ==========================================
// API CONFIGURATION
// ==========================================

const API_BASE_URL = "https://notes-app-pi-smoky.vercel.app";


// ==========================================
// PAGE ELEMENTS
// ==========================================

const authPage = document.getElementById("authPage");
const dashboardPage = document.getElementById("dashboardPage");

const loginFormContainer =
    document.getElementById("loginFormContainer");

const registerFormContainer =
    document.getElementById("registerFormContainer");


// ==========================================
// AUTH SCREEN
// ==========================================

function showRegister() {
    loginFormContainer.classList.add("hidden");
    registerFormContainer.classList.remove("hidden");
}

function showLogin() {
    registerFormContainer.classList.add("hidden");
    loginFormContainer.classList.remove("hidden");
}


// ==========================================
// PASSWORD VISIBILITY
// ==========================================

function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (input.type === "password") {

        input.type = "text";

        button.innerHTML =
            '<i class="fa-regular fa-eye-slash"></i>';

    } else {

        input.type = "password";

        button.innerHTML =
            '<i class="fa-regular fa-eye"></i>';
    }
}


// ==========================================
// LOGIN
// ==========================================

document
    .getElementById("loginForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        try {

            const response = await fetch(
                API_BASE_URL + "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(data.message || "Login failed");

                return;
            }

            // Save JWT
            localStorage.setItem("token", data.token);

            // Save email for UI
            localStorage.setItem("userEmail", email);

            document.getElementById("userName").textContent =
                email.split("@")[0];

            authPage.classList.add("hidden");
            dashboardPage.classList.remove("hidden");

            await loadNotes();

        } catch (error) {

            console.error("Login error:", error);

            alert("Unable to connect to the server.");
        }

    });


// ==========================================
// REGISTER / SIGNUP
// ==========================================

document
    .getElementById("registerForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        try {

            const response = await fetch(
                API_BASE_URL + "/api/auth/signup",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Registration failed"
                );

                return;
            }

            alert(
                "Account created successfully. Please log in."
            );

            document
                .getElementById("registerForm")
                .reset();

            showLogin();

        } catch (error) {

            console.error(
                "Register error:",
                error
            );

            alert(
                "Unable to connect to the server."
            );
        }

    });


// ==========================================
// LOAD NOTES
// ==========================================

async function loadNotes() {

    const token =
        localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(
            API_BASE_URL + "/api/notes",
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(data);

            if (response.status === 401) {
                logoutUser();
            }

            return;
        }

        displayNotes(data.notes || []);

    } catch (error) {

        console.error(
            "Load notes error:",
            error
        );
    }
}


```javascript
// ==========================================
// DISPLAY NOTES
// ==========================================

function displayNotes(notes) {

    const notesGrid =
        document.getElementById("notesGrid");

    const emptyState =
        document.getElementById("emptyState");

    notesGrid.innerHTML = "";

    if (notes.length === 0) {

        notesGrid.classList.add("hidden");
        emptyState.classList.remove("hidden");

        return;
    }

    emptyState.classList.add("hidden");
    notesGrid.classList.remove("hidden");

    notes.forEach(function (note) {

        const noteCard =
            document.createElement("article");

        noteCard.className = "note-card";

        // Create card elements without template literals
        const noteTop = document.createElement("div");
        noteTop.className = "note-top";

        const noteDate = document.createElement("span");
        noteDate.className = "note-date";
        noteDate.textContent = formatDate(note.createdAt);

        const actionContainer = document.createElement("div");

        const editButton = document.createElement("button");
        editButton.className = "icon-btn";
        editButton.title = "Edit note";

        editButton.innerHTML =
            '<i class="fa-solid fa-pen"></i>';

        editButton.addEventListener("click", function () {
            editNote(note._id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "icon-btn";
        deleteButton.title = "Delete note";

        deleteButton.innerHTML =
            '<i class="fa-solid fa-trash"></i>';

        deleteButton.addEventListener("click", function () {
            deleteNote(note._id);
        });

        actionContainer.appendChild(editButton);
        actionContainer.appendChild(deleteButton);

        noteTop.appendChild(noteDate);
        noteTop.appendChild(actionContainer);


        const title = document.createElement("h3");

        title.textContent =
            note.title || "Untitled";


        const content = document.createElement("p");

        content.textContent =
            note.content || "";


        const noteFooter = document.createElement("div");
        noteFooter.className = "note-footer";

        const noteType = document.createElement("span");

        noteType.innerHTML =
            '<i class="fa-regular fa-clock"></i> Note';

        noteFooter.appendChild(noteType);


        noteCard.appendChild(noteTop);
        noteCard.appendChild(title);
        noteCard.appendChild(content);
        noteCard.appendChild(noteFooter);

        notesGrid.appendChild(noteCard);
    });
}
```


// ==========================================
// CREATE NOTE
// ==========================================

document
    .getElementById("noteForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const title =
            document.getElementById("noteTitle").value.trim();

        const content =
            document.getElementById("noteContent").value.trim();

        const token =
            localStorage.getItem("token");

        if (!token) {

            alert("Please log in first.");

            return;
        }

        if (!title || !content) {

            alert(
                "Please enter both title and note content."
            );

            return;
        }

        try {

            const response = await fetch(
                API_BASE_URL + "/api/notes",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },

                    body: JSON.stringify({
                        title: title,
                        content: content
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Could not create note"
                );

                return;
            }

            document
                .getElementById("noteForm")
                .reset();

            document
                .getElementById("noteModal")
                .classList.add("hidden");

            await loadNotes();

        } catch (error) {

            console.error(
                "Create note error:",
                error
            );

            alert(
                "Unable to connect to the server."
            );
        }

    });


// ==========================================
// EDIT NOTE
// ==========================================

async function editNote(noteId) {

    const token =
        localStorage.getItem("token");

    if (!token) {

        alert("Please log in first.");

        return;
    }

    try {

        // Get existing note
        const response = await fetch(
            API_BASE_URL + "/api/notes/" + noteId,
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Could not load note."
            );

            return;
        }

        const note =
            data.note || data;

        const newTitle =
            prompt(
                "Edit note title:",
                note.title || ""
            );

        if (newTitle === null) {
            return;
        }

        const newContent =
            prompt(
                "Edit note content:",
                note.content || ""
            );

        if (newContent === null) {
            return;
        }

        if (
            !newTitle.trim() ||
            !newContent.trim()
        ) {

            alert(
                "Title and content cannot be empty."
            );

            return;
        }

        // Update note
        const updateResponse =
            await fetch(
                API_BASE_URL + "/api/notes/" + noteId,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },

                    body: JSON.stringify({
                        title: newTitle.trim(),
                        content: newContent.trim()
                    })
                }
            );

        const updateData =
            await updateResponse.json();

        if (!updateResponse.ok) {

            alert(
                updateData.message ||
                "Could not update note."
            );

            return;
        }

        await loadNotes();

    } catch (error) {

        console.error(
            "Edit note error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );
    }
}


// ==========================================
// DELETE NOTE
// ==========================================

async function deleteNote(noteId) {

    const token =
        localStorage.getItem("token");

    if (!token) {
        return;
    }

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this note?"
        );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            API_BASE_URL + "/api/notes/" + noteId,
            {
                method: "DELETE",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Could not delete note"
            );

            return;
        }

        await loadNotes();

    } catch (error) {

        console.error(
            "Delete note error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );
    }
}


// ==========================================
// NEW NOTE MODAL
// ==========================================

const noteModal =
    document.getElementById("noteModal");

document
    .querySelectorAll(
        ".new-note-btn, .empty-btn"
    )
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                noteModal.classList.remove(
                    "hidden"
                );

            }
        );

    });


document
    .querySelector(".close-modal")
    .addEventListener(
        "click",
        function () {

            noteModal.classList.add(
                "hidden"
            );

        }
    );


document
    .querySelector(".modal-overlay")
    .addEventListener(
        "click",
        function () {

            noteModal.classList.add(
                "hidden"
            );

        }
    );


// ==========================================
// LOGOUT
// ==========================================

document
    .querySelector(".logout-btn")
    .addEventListener(
        "click",
        function () {

            logoutUser();

        }
    );


function logoutUser() {

    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    dashboardPage.classList.add("hidden");
    authPage.classList.remove("hidden");

    showLogin();
}


// ==========================================
// HELPERS
// ==========================================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


function formatDate(date) {

    if (!date) {
        return "Today";
    }

    return new Date(date).toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}
```
