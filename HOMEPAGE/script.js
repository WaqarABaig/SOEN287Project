// OpenLab home page behaviour.
// The page still works without this file: the dropdown opens on hover with a
// mouse, and every link goes where it should. This adds clicking and tapping,
// the phone menu, and a few small touches.

document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("site-header");
    const nav = document.getElementById("main-nav");
    const menuToggle = document.getElementById("menu-toggle");
    const dropdown = document.querySelector(".dropdown");
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const video = document.getElementById("video");

    // Dropdown: open and close on click or tap
    function setDropdown(open) {
        dropdown.classList.toggle("open", open);
        dropdownToggle.setAttribute("aria-expanded", String(open));
    }

    dropdownToggle.addEventListener("click", (event) => {
        event.stopPropagation(); // don't let the "click outside" check below close it straight away
        setDropdown(!dropdown.classList.contains("open"));
    });

    // Clicking anywhere else closes it.
    document.addEventListener("click", (event) => {
        if (!dropdown.contains(event.target)) setDropdown(false);
    });

    // Phone menu (the ☰ button)
    function setMenu(open) {
        nav.classList.toggle("open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("menu-open", open); // stops the page scrolling behind the menu
    }

    menuToggle.addEventListener("click", () => {
        setMenu(!nav.classList.contains("open"));
    });

    // Following a link on this page (like "How it works") closes the phone menu.
    nav.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", () => {
            setMenu(false);
            setDropdown(false);
        });
    });

    // The Escape key closes whatever is open.
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        if (dropdown.classList.contains("open")) {
            setDropdown(false);
            dropdownToggle.focus();
        } else if (nav.classList.contains("open")) {
            setMenu(false);
            menuToggle.focus();
        }
    });

    // Going back to a wide screen resets the phone menu.
    window.matchMedia("(min-width: 861px)").addEventListener("change", (event) => {
        if (event.matches) setMenu(false);
    });

    // Header: more solid once you scroll past the video
    function updateHeader() {
        header.classList.toggle("scrolled", window.scrollY > window.innerHeight - 100);
    }
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    // Video: respect "reduce motion" in device settings
    if (video && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        video.removeAttribute("autoplay");
        video.pause();
    }
});