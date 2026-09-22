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
                `${API_BASE_URL}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
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

            // Save email temporarily for UI
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
// REGISTER
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
                `${API_BASE_URL}/api/auth/signup`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(data.message || "Registration failed");

                return;
            }

            alert("Account created successfully. Please log in.");

            document.getElementById("registerForm").reset();

            showLogin();

        } catch (error) {

            console.error("Register error:", error);

            alert("Unable to connect to the server.");
        }

    });


// ==========================================
// LOAD NOTES
// ==========================================

async function loadNotes() {

    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/notes`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(data);

            return;
        }

        displayNotes(data.notes || []);

    } catch (error) {

        console.error("Load notes error:", error);
    }
}


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

    notes.forEach(note => {

        const noteCard =
            document.createElement("article");

        noteCard.className = "note-card";

        noteCard.innerHTML = `
            <div class="note-top">

                <span class="note-date">
                    ${formatDate(note.createdAt)}
                </span>

                <button
                    class="icon-btn"
                    onclick="deleteNote('${note._id}')"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>

            <h3>${escapeHtml(note.title || "Untitled")}</h3>

            <p>${escapeHtml(note.content || "")}</p>

            <div class="note-footer">

                <span>
                    <i class="fa-regular fa-clock"></i>
                    Note
                </span>

            </div>
        `;

        notesGrid.appendChild(noteCard);

    });
}


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

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/notes`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        title,
                        content
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(data.message || "Could not create note");

                return;
            }

            document.getElementById("noteForm").reset();

            document
                .getElementById("noteModal")
                .classList.add("hidden");

            await loadNotes();

        } catch (error) {

            console.error("Create note error:", error);

            alert("Unable to connect to the server.");
        }

    });


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
        confirm("Are you sure you want to delete this note?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/notes/${noteId}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(data.message || "Could not delete note");

            return;
        }

        await loadNotes();

    } catch (error) {

        console.error("Delete note error:", error);

        alert("Unable to connect to the server.");
    }
}


// ==========================================
// NEW NOTE MODAL
// ==========================================

const noteModal =
    document.getElementById("noteModal");

document
    .querySelectorAll(".new-note-btn, .empty-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            noteModal.classList.remove("hidden");

        });

    });


document
    .querySelector(".close-modal")
    .addEventListener("click", () => {

        noteModal.classList.add("hidden");

    });


document
    .querySelector(".modal-overlay")
    .addEventListener("click", () => {

        noteModal.classList.add("hidden");

    });


// ==========================================
// LOGOUT
// ==========================================

document
    .querySelector(".logout-btn")
    .addEventListener("click", () => {

        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");

        dashboardPage.classList.add("hidden");
        authPage.classList.remove("hidden");

        showLogin();

    });


// ==========================================
// HELPERS
// ==========================================

function escapeHtml(value) {

    const div = document.createElement("div");

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