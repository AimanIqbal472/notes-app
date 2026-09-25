// ==========================================
// API CONFIGURATION
// ==========================================

const API_BASE_URL = "https://notes-app-pi-smoky.vercel.app";

// ==========================================
// DOM ELEMENTS
// ==========================================

const authPage = document.getElementById("authPage");
const dashboardPage = document.getElementById("dashboardPage");

const loginFormContainer =
    document.getElementById("loginFormContainer");

const registerFormContainer =
    document.getElementById("registerFormContainer");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const noteModal =
    document.getElementById("noteModal");

const noteForm =
    document.getElementById("noteForm");

const notesGrid =
    document.getElementById("notesGrid");

const emptyState =
    document.getElementById("emptyState");

const loadingState =
    document.getElementById("loadingState");

const searchInput =
    document.getElementById("searchInput");

const clearSearchBtn =
    document.getElementById("clearSearchBtn");

const clearSearchBtnEmpty =
    document.getElementById("clearSearchBtnEmpty");

const modalLabel =
    document.getElementById("modalLabel");

const modalTitle =
    document.getElementById("modalTitle");

const modalSubtitle =
    document.getElementById("modalSubtitle");

const modalButtonText =
    document.getElementById("modalButtonText");

const modalButtonIcon =
    document.getElementById("modalButtonIcon");

const notesCount =
    document.getElementById("notesCount");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const toastIcon =
    document.getElementById("toastIcon");

let allNotes = [];

let toastTimer = null;


// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        setupEventListeners();

        // Restore the login session after a page refresh.
        await restoreSession();

    }
);


// ==========================================
// RESTORE LOGIN SESSION
// ==========================================

async function restoreSession() {

    const token =
        sessionStorage.getItem(
            "token"
        );

    const email =
        sessionStorage.getItem(
            "userEmail"
        );

    // No active session: show login page.
    if (!token || !email) {

        showAuthPage();
        showLogin();

        return;
    }

    // Active session found: restore dashboard
    // and load notes for the logged-in user.
    showDashboard(
        email
    );

    await loadNotes();
}


// ==========================================
// EVENT LISTENERS
// ==========================================

function setupEventListeners() {

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            handleLogin
        );

    }


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            handleSignup
        );

    }


    if (noteForm) {

        noteForm.addEventListener(
            "submit",
            handleNoteSubmit
        );

    }


    const showRegisterBtn =
        document.getElementById("showRegisterBtn");

    if (showRegisterBtn) {

        showRegisterBtn.addEventListener(
            "click",
            showRegister
        );

    }


    const showLoginBtn =
        document.getElementById("showLoginBtn");

    if (showLoginBtn) {

        showLoginBtn.addEventListener(
            "click",
            showLogin
        );

    }


    document
        .querySelectorAll(
            "[data-password-toggle]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        togglePassword(
                            button.getAttribute(
                                "data-password-toggle"
                            ),
                            button
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".new-note-btn, .empty-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    openCreateModal
                );

            }
        );


    const closeModalButton =
        document.querySelector(
            ".close-modal"
        );

    if (closeModalButton) {

        closeModalButton.addEventListener(
            "click",
            closeNoteModal
        );

    }


    const modalOverlay =
        document.querySelector(
            ".modal-overlay"
        );

    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeNoteModal
        );

    }


    const logoutButton =
        document.querySelector(
            ".logout-btn"
        );

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                logoutUser(true);

            }
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            handleSearch
        );

    }


    if (clearSearchBtn) {

        clearSearchBtn.addEventListener(
            "click",
            clearSearch
        );

    }


    if (clearSearchBtnEmpty) {

        clearSearchBtnEmpty.addEventListener(
            "click",
            clearSearch
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                noteModal &&
                !noteModal.classList.contains(
                    "hidden"
                )
            ) {

                closeNoteModal();

            }

        }
    );

}


// ==========================================
// AUTH PAGE
// ==========================================

function showAuthPage() {

    authPage.classList.remove(
        "hidden"
    );

    dashboardPage.classList.add(
        "hidden"
    );
}


function showDashboard(email) {

    authPage.classList.add(
        "hidden"
    );

    dashboardPage.classList.remove(
        "hidden"
    );


    const accountEmail =
        email || "User";


    const rawName =
        accountEmail.split("@")[0] ||
        "User";


    const name =
        rawName.charAt(0).toUpperCase() +
        rawName.slice(1);


    const userName =
        document.getElementById(
            "userName"
        );


    const userEmail =
        document.getElementById(
            "userEmail"
        );


    const userAvatar =
        document.getElementById(
            "userAvatar"
        );


    if (userName) {

        userName.textContent =
            name;

    }


    if (userEmail) {

        userEmail.textContent =
            accountEmail;

    }


    if (userAvatar) {

        userAvatar.textContent =
            name.charAt(0).toUpperCase();

    }
}


// ==========================================
// AUTH SWITCHING
// ==========================================

function showRegister() {

    loginFormContainer.classList.add(
        "hidden"
    );

    registerFormContainer.classList.remove(
        "hidden"
    );
}


function showLogin() {

    registerFormContainer.classList.add(
        "hidden"
    );

    loginFormContainer.classList.remove(
        "hidden"
    );
}


// ==========================================
// PASSWORD VISIBILITY
// ==========================================

function togglePassword(
    inputId,
    button
) {

    const input =
        document.getElementById(
            inputId
        );


    const icon =
        button
            ? button.querySelector("i")
            : null;


    if (!input) {
        return;
    }


    if (
        input.type ===
        "password"
    ) {

        input.type =
            "text";


        if (icon) {

            icon.className =
                "fa-regular fa-eye-slash";

        }


        if (button) {

            button.setAttribute(
                "aria-label",
                "Hide password"
            );

        }

    } else {

        input.type =
            "password";


        if (icon) {

            icon.className =
                "fa-regular fa-eye";

        }


        if (button) {

            button.setAttribute(
                "aria-label",
                "Show password"
            );

        }
    }
}


// ==========================================
// API RESPONSE HELPER
// ==========================================

async function readResponse(
    response
) {

    const text =
        await response.text();


    if (!text) {
        return {};
    }


    try {

        return JSON.parse(
            text
        );

    } catch (error) {

        console.error(
            "Non-JSON response:",
            text
        );


        return {
            message:
                "The server returned an unexpected response."
        };
    }
}


// ==========================================
// EXTRACT NOTES FROM API RESPONSE
// ==========================================

function extractNotes(
    data
) {

    // API returns an array directly
    if (Array.isArray(data)) {

        return data;

    }


    // { notes: [...] }
    if (
        data &&
        Array.isArray(data.notes)
    ) {

        return data.notes;

    }


    // { data: [...] }
    if (
        data &&
        Array.isArray(data.data)
    ) {

        return data.data;

    }


    // { data: { notes: [...] } }
    if (
        data &&
        data.data &&
        Array.isArray(data.data.notes)
    ) {

        return data.data.notes;

    }


    return [];
}


// ==========================================
// SIGN UP
// ==========================================

async function handleSignup(
    event
) {

    event.preventDefault();


    const name =
        document
            .getElementById(
                "registerName"
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                "registerEmail"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "registerPassword"
            )
            .value;


    if (
        !name ||
        !email ||
        !password
    ) {

        showToast(
            "Please complete all fields.",
            "error"
        );

        return;
    }


    const submitButton =
        registerForm.querySelector(
            "button[type='submit']"
        );


    setButtonLoading(
        submitButton,
        true,
        "Creating account..."
    );


    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/api/auth/signup",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


        const data =
            await readResponse(
                response
            );


        if (!response.ok) {

            showToast(
                data.message ||
                "Registration failed.",
                "error"
            );

            return;
        }


        registerForm.reset();


        document.getElementById(
            "loginEmail"
        ).value =
            email;


        showLogin();


        showToast(
            "Account created successfully. Please sign in.",
            "success"
        );

    } catch (error) {

        console.error(
            "Signup error:",
            error
        );


        showToast(
            "Unable to connect to the server.",
            "error"
        );

    } finally {

        setButtonLoading(
            submitButton,
            false,
            "Create Account"
        );
    }
}


// ==========================================
// LOGIN
// ==========================================

async function handleLogin(
    event
) {

    event.preventDefault();


    const email =
        document
            .getElementById(
                "loginEmail"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "loginPassword"
            )
            .value;


    if (
        !email ||
        !password
    ) {

        showToast(
            "Please enter your email and password.",
            "error"
        );

        return;
    }


    const submitButton =
        loginForm.querySelector(
            "button[type='submit']"
        );


    setButtonLoading(
        submitButton,
        true,
        "Signing in..."
    );


    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


        const data =
            await readResponse(
                response
            );


        if (!response.ok) {

            showToast(
                data.message ||
                "Login failed.",
                "error"
            );

            return;
        }


        if (!data.token) {

            showToast(
                "Login succeeded, but no token was returned.",
                "error"
            );

            return;
        }


        // Store login session
        sessionStorage.setItem(
            "token",
            data.token
        );


        sessionStorage.setItem(
            "userEmail",
            email
        );


        loginForm.reset();


        showDashboard(
            email
        );


        await loadNotes();


        showToast(
            "Signed in successfully.",
            "success"
        );

    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        showToast(
            "Unable to connect to the server.",
            "error"
        );

    } finally {

        setButtonLoading(
            submitButton,
            false,
            "Sign In"
        );
    }
}


// ==========================================
// LOAD NOTES
// ==========================================

async function loadNotes() {

    const token =
        sessionStorage.getItem(
            "token"
        );


    if (!token) {

        showAuthPage();
        showLogin();

        return;
    }


    loadingState.classList.remove(
        "hidden"
    );

    emptyState.classList.add(
        "hidden"
    );

    notesGrid.classList.add(
        "hidden"
    );


    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/api/notes",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " +
                            token,

                        "Accept":
                            "application/json"
                    }
                }
            );


        const data =
            await readResponse(
                response
            );


        if (
            response.status ===
            401
        ) {

            logoutUser(false);


            showToast(
                "Your session has expired. Please sign in again.",
                "error"
            );

            return;
        }


        if (!response.ok) {

            showToast(
                data.message ||
                "Could not load notes.",
                "error"
            );

            return;
        }


        // Get all notes returned for
        // the authenticated user.
        allNotes =
            extractNotes(data);


        renderNotes(
            allNotes
        );

    } catch (error) {

        console.error(
            "Load notes error:",
            error
        );


        showToast(
            "Unable to load your notes.",
            "error"
        );

    } finally {

        loadingState.classList.add(
            "hidden"
        );
    }
}


// ==========================================
// RENDER NOTES
// ==========================================

function renderNotes(
    notes
) {

    const query =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const filteredNotes =
        notes.filter(
            function (note) {

                const title =
                    String(
                        note.title ||
                        ""
                    ).toLowerCase();


                const content =
                    String(
                        note.content ||
                        ""
                    ).toLowerCase();


                return (
                    !query ||
                    title.includes(query) ||
                    content.includes(query)
                );

            }
        );


    notesGrid.innerHTML =
        "";


    if (notesCount) {

        notesCount.textContent =
            String(
                filteredNotes.length
            );

    }


    if (clearSearchBtn) {

        clearSearchBtn.classList.toggle(
            "hidden",
            !query
        );

    }


    // --------------------------------------
    // NO NOTES / NO SEARCH RESULTS
    // --------------------------------------

    if (
        filteredNotes.length ===
        0
    ) {

        notesGrid.classList.add(
            "hidden"
        );

        emptyState.classList.remove(
            "hidden"
        );


        const emptyTitle =
            document.getElementById(
                "emptyTitle"
            );


        const emptyText =
            document.getElementById(
                "emptyText"
            );


        const createButton =
            document.getElementById(
                "emptyCreateButton"
            );


        if (query) {

            if (emptyTitle) {

                emptyTitle.textContent =
                    "No notes found";

            }


            if (emptyText) {

                emptyText.textContent =
                    "Try a different search term.";

            }


            if (createButton) {

                createButton.classList.add(
                    "hidden"
                );

            }


            if (clearSearchBtnEmpty) {

                clearSearchBtnEmpty.classList.remove(
                    "hidden"
                );

            }

        } else {

            if (emptyTitle) {

                emptyTitle.textContent =
                    "No notes yet";

            }


            if (emptyText) {

                emptyText.textContent =
                    "Create your first note and keep your ideas organized.";

            }


            if (createButton) {

                createButton.classList.remove(
                    "hidden"
                );

            }


            if (clearSearchBtnEmpty) {

                clearSearchBtnEmpty.classList.add(
                    "hidden"
                );

            }
        }


        return;
    }


    // --------------------------------------
    // SHOW NOTES
    // --------------------------------------

    emptyState.classList.add(
        "hidden"
    );

    notesGrid.classList.remove(
        "hidden"
    );


    filteredNotes.forEach(
        function (note) {

            notesGrid.appendChild(
                createNoteCard(note)
            );

        }
    );
}


// ==========================================
// CREATE NOTE CARD
// ==========================================

function createNoteCard(
    note
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "note-card";


    // --------------------------------------
    // TOP
    // --------------------------------------

    const top =
        document.createElement(
            "div"
        );


    top.className =
        "note-top";


    const date =
        document.createElement(
            "span"
        );


    date.className =
        "note-date";


    date.textContent =
        formatDate(
            note.updatedAt ||
            note.createdAt
        );


    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "note-actions";


    // --------------------------------------
    // EDIT BUTTON
    // --------------------------------------

    const editButton =
        document.createElement(
            "button"
        );


    editButton.type =
        "button";


    editButton.className =
        "icon-btn edit-btn";


    editButton.title =
        "Edit note";


    editButton.setAttribute(
        "aria-label",
        "Edit note"
    );


    editButton.innerHTML =
        "<i class='fa-solid fa-pen'></i>";


    editButton.addEventListener(
        "click",
        function () {

            openEditModal(note);

        }
    );


    // --------------------------------------
    // DELETE BUTTON
    // --------------------------------------

    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.type =
        "button";


    deleteButton.className =
        "icon-btn delete-btn";


    deleteButton.title =
        "Delete note";


    deleteButton.setAttribute(
        "aria-label",
        "Delete note"
    );


    deleteButton.innerHTML =
        "<i class='fa-regular fa-trash-can'></i>";


    deleteButton.addEventListener(
        "click",
        function () {

            deleteNote(
                note._id
            );

        }
    );


    actions.appendChild(
        editButton
    );


    actions.appendChild(
        deleteButton
    );


    top.appendChild(
        date
    );


    top.appendChild(
        actions
    );


    // --------------------------------------
    // TITLE
    // --------------------------------------

    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        note.title ||
        "Untitled";


    // --------------------------------------
    // CONTENT
    // --------------------------------------

    const content =
        document.createElement(
            "p"
        );


    content.textContent =
        note.content ||
        "";


    // --------------------------------------
    // FOOTER
    // --------------------------------------

    const footer =
        document.createElement(
            "div"
        );


    footer.className =
        "note-footer";


    const type =
        document.createElement(
            "span"
        );


    type.innerHTML =
        "<i class='fa-regular fa-note-sticky'></i> Note";


    const status =
        document.createElement(
            "span"
        );


    status.textContent =
        note.updatedAt
            ? "Updated"
            : "Created";


    footer.appendChild(
        type
    );


    footer.appendChild(
        status
    );


    // --------------------------------------
    // BUILD CARD
    // --------------------------------------

    card.appendChild(
        top
    );


    card.appendChild(
        title
    );


    card.appendChild(
        content
    );


    card.appendChild(
        footer
    );


    return card;
}


// ==========================================
// CREATE / UPDATE NOTE
// ==========================================

async function handleNoteSubmit(
    event
) {

    event.preventDefault();


    const token =
        sessionStorage.getItem(
            "token"
        );


    if (!token) {

        showAuthPage();
        showLogin();


        showToast(
            "Please sign in first.",
            "error"
        );


        return;
    }


    const editingId =
        noteModal.dataset.editingId ||
        "";


    const title =
        document
            .getElementById(
                "noteTitle"
            )
            .value
            .trim();


    const content =
        document
            .getElementById(
                "noteContent"
            )
            .value
            .trim();


    if (
        !title ||
        !content
    ) {

        showToast(
            "Please enter both title and content.",
            "error"
        );


        return;
    }


    const submitButton =
        noteForm.querySelector(
            "button[type='submit']"
        );


    const isEditing =
        Boolean(
            editingId
        );


    setButtonLoading(
        submitButton,
        true,
        isEditing
            ? "Updating note..."
            : "Saving note..."
    );


    try {

        let response;


        if (isEditing) {

            response =
                await fetch(
                    API_BASE_URL +
                    "/api/notes/" +
                    editingId,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " +
                                token
                        },

                        body: JSON.stringify({
                            title: title,
                            content: content
                        })
                    }
                );

        } else {

            response =
                await fetch(
                    API_BASE_URL +
                    "/api/notes",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " +
                                token
                        },

                        body: JSON.stringify({
                            title: title,
                            content: content
                        })
                    }
                );
        }


        const data =
            await readResponse(
                response
            );


        if (
            response.status ===
            401
        ) {

            logoutUser(false);


            showToast(
                "Your session has expired. Please sign in again.",
                "error"
            );


            return;
        }


        if (!response.ok) {

            showToast(
                data.message ||
                (
                    isEditing
                        ? "Could not update note."
                        : "Could not create note."
                ),
                "error"
            );


            return;
        }


        closeNoteModal();


        await loadNotes();


        showToast(
            isEditing
                ? "Note updated successfully."
                : "Note created successfully.",
            "success"
        );

    } catch (error) {

        console.error(
            "Save note error:",
            error
        );


        showToast(
            "Unable to connect to the server.",
            "error"
        );

    } finally {

        setButtonLoading(
            submitButton,
            false,
            "Save Note"
        );
    }
}


// ==========================================
// OPEN CREATE MODAL
// ==========================================

function openCreateModal() {

    noteForm.reset();


    delete noteModal.dataset.editingId;


    modalLabel.textContent =
        "NEW NOTE";


    modalTitle.textContent =
        "Create a note";


    modalSubtitle.textContent =
        "Add a title and write down what matters.";


    modalButtonText.textContent =
        "Save Note";


    modalButtonIcon.className =
        "fa-solid fa-check";


    noteModal.classList.remove(
        "hidden"
    );


    noteModal.setAttribute(
        "aria-hidden",
        "false"
    );


    setTimeout(
        function () {

            document
                .getElementById(
                    "noteTitle"
                )
                .focus();

        },
        50
    );
}


// ==========================================
// OPEN EDIT MODAL
// ==========================================

function openEditModal(
    note
) {

    noteForm.reset();


    noteModal.dataset.editingId =
        note._id;


    document.getElementById(
        "noteTitle"
    ).value =
        note.title ||
        "";


    document.getElementById(
        "noteContent"
    ).value =
        note.content ||
        "";


    modalLabel.textContent =
        "EDIT NOTE";


    modalTitle.textContent =
        "Update your note";


    modalSubtitle.textContent =
        "Make your changes and save the updated note.";


    modalButtonText.textContent =
        "Update Note";


    modalButtonIcon.className =
        "fa-solid fa-check";


    noteModal.classList.remove(
        "hidden"
    );


    noteModal.setAttribute(
        "aria-hidden",
        "false"
    );


    setTimeout(
        function () {

            document
                .getElementById(
                    "noteTitle"
                )
                .focus();

        },
        50
    );
}


// ==========================================
// CLOSE NOTE MODAL
// ==========================================

function closeNoteModal() {

    noteModal.classList.add(
        "hidden"
    );


    noteModal.setAttribute(
        "aria-hidden",
        "true"
    );


    noteForm.reset();


    delete noteModal.dataset.editingId;


    modalLabel.textContent =
        "NEW NOTE";


    modalTitle.textContent =
        "Create a note";


    modalSubtitle.textContent =
        "Add a title and write down what matters.";


    modalButtonText.textContent =
        "Save Note";


    modalButtonIcon.className =
        "fa-solid fa-check";
}


// ==========================================
// DELETE NOTE
// ==========================================

async function deleteNote(
    noteId
) {

    const token =
        sessionStorage.getItem(
            "token"
        );


    if (!token) {

        showAuthPage();
        showLogin();


        showToast(
            "Please sign in first.",
            "error"
        );


        return;
    }


    const shouldDelete =
        window.confirm(
            "Delete this note permanently?"
        );


    if (!shouldDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/api/notes/" +
                noteId,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            "Bearer " +
                            token
                    }
                }
            );


        const data =
            await readResponse(
                response
            );


        if (
            response.status ===
            401
        ) {

            logoutUser(false);


            showToast(
                "Your session has expired. Please sign in again.",
                "error"
            );


            return;
        }


        if (!response.ok) {

            showToast(
                data.message ||
                "Could not delete note.",
                "error"
            );


            return;
        }


        await loadNotes();


        showToast(
            "Note deleted successfully.",
            "success"
        );

    } catch (error) {

        console.error(
            "Delete note error:",
            error
        );


        showToast(
            "Unable to connect to the server.",
            "error"
        );
    }
}


// ==========================================
// SEARCH
// ==========================================

function handleSearch() {

    renderNotes(
        allNotes
    );
}


function clearSearch() {

    searchInput.value =
        "";


    renderNotes(
        allNotes
    );


    searchInput.focus();
}


// ==========================================
// LOGOUT
// ==========================================

function logoutUser(
    showMessage
) {

    sessionStorage.removeItem(
        "token"
    );


    sessionStorage.removeItem(
        "userEmail"
    );


    allNotes = [];


    closeNoteModal();


    showAuthPage();


    showLogin();


    loginForm.reset();


    registerForm.reset();


    searchInput.value =
        "";


    renderNotes(
        []
    );


    if (
        showMessage !==
        false
    ) {

        showToast(
            "You have been signed out.",
            "success"
        );
    }
}


// ==========================================
// BUTTON LOADING
// ==========================================

function setButtonLoading(
    button,
    loading,
    text
) {

    if (!button) {
        return;
    }


    if (loading) {

        if (
            !button.dataset.originalHtml
        ) {

            button.dataset.originalHtml =
                button.innerHTML;

        }


        button.disabled =
            true;


        button.innerHTML =
            "<span class='button-spinner'></span>" +
            "<span>" +
            text +
            "</span>";

    } else {

        button.disabled =
            false;


        if (
            button.dataset.originalHtml
        ) {

            button.innerHTML =
                button.dataset.originalHtml;


            delete button.dataset.originalHtml;

        }
    }
}


// ==========================================
// TOAST
// ==========================================

function showToast(
    message,
    type
) {

    if (
        !toast ||
        !toastMessage ||
        !toastIcon
    ) {
        return;
    }


    toastMessage.textContent =
        message;


    toast.className =
        "toast " +
        type;


    if (
        type ===
        "success"
    ) {

        toastIcon.className =
            "fa-solid fa-circle-check";

    } else {

        toastIcon.className =
            "fa-solid fa-circle-exclamation";
    }


    toast.classList.remove(
        "hidden"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function () {

                toast.classList.add(
                    "hidden"
                );

            },
            3500
        );
}


// ==========================================
// DATE FORMATTER
// ==========================================

function formatDate(
    date
) {

    if (!date) {

        return "Today";

    }


    const parsedDate =
        new Date(
            date
        );


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return "Today";

    }


    return parsedDate.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}
