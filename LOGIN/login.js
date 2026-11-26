// Sign-in for both customers (login.html) and labs (lab-login.html).
// The form's data-role attribute says which kind of account it's for.
//
// This is a stand-in until the Flask back end exists. Checking passwords
// in the browser is not real security: the server must do it. What carries
// over is the page itself: the form, the messages and where you go next.

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("sign-in");
    const role = form.dataset.role; // "customer" or "lab"
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const formError = document.getElementById("form-error");
    const showButton = form.querySelector(".show-password");

    // ---------- Show / hide password ----------
    showButton.addEventListener("click", () => {
        const showing = password.type === "text";
        password.type = showing ? "password" : "text";
        showButton.textContent = showing ? "SHOW" : "HIDE";
        // aria-pressed tells screen readers whether the toggle is on
        showButton.setAttribute("aria-pressed", String(!showing));
        password.focus();
    });

    // ---------- Messages ----------
    function setFieldError(input, message) {
        const slot = document.getElementById(`${input.id}-error`);
        slot.textContent = message;
        slot.hidden = !message;
        input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function showFormError(message) {
        formError.textContent = message;
        formError.hidden = !message;
    }

    // Clear a field's message as soon as someone starts fixing it.
    [email, password].forEach((input) => {
        input.addEventListener("input", () => setFieldError(input, ""));
    });

    // ---------- Sign in ----------
    form.addEventListener("submit", (event) => {
        // Stops the browser sending the form and reloading the page
        event.preventDefault();
        showFormError("");

        const emailValue = email.value.trim().toLowerCase();
        let valid = true;

        if (!emailValue) {
            setFieldError(email, "Enter your email.");
            valid = false;
        } else if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(emailValue)) {
            // A regular expression: one or more characters, an @, more
            // characters, a dot, then at least two letters
            setFieldError(email, "Enter a valid email address.");
            valid = false;
        }
        if (!password.value) {
            setFieldError(password, "Enter your password.");
            valid = false;
        }
        if (!valid) {
            // Puts the cursor in the first field with a problem
            form.querySelector('[aria-invalid="true"]').focus();
            return;
        }

        const account = DEMO_ACCOUNTS.find((item) => item.email === emailValue && item.password === password.value);

        // The same message for a wrong email and a wrong password, so the
        // page doesn't reveal which email addresses have accounts
        if (!account) {
            showFormError("Email or password is incorrect.");
            password.value = "";
            password.focus();
            return;
        }
        if (account.role !== role) {
            showFormError(role === "lab"
                ? "This is a customer account. Sign in on the customer page."
                : "This is a lab account. Sign in through the lab portal.");
            return;
        }

        // localStorage keeps small pieces of text in this browser, even after
        // it's closed. It can only store text, so the object is turned into
        // JSON text first.
        if (role === "lab") {
            localStorage.setItem("openlabLab", JSON.stringify({ name: account.name, labId: account.labId }));
            window.location.href = "lab-portal.html";
        } else {
            localStorage.setItem("openlabUser", JSON.stringify({ name: account.name, email: account.email }));
            // Pages that need a signed-in customer send people here with
            // ?next=... so they can be taken back afterwards
            const next = new URLSearchParams(window.location.search).get("next");
            window.location.href = next || "labs.html";
        }
    });
});
