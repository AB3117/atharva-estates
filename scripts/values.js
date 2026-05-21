// Values mobile menu toggle (desktop nav behavior stays in home.js).
document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("values-mobile-menu-btn");
    const drawer = document.getElementById("values-mobile-drawer");
    const header = document.querySelector("header");

    if (!menuBtn || !drawer || !header) return;

    const isMobileViewport = () => window.matchMedia("(max-width: 940px)").matches;

    const closeDrawer = () => {
        drawer.hidden = true;
        menuBtn.setAttribute("aria-expanded", "false");
        header.classList.remove("values-mobile-menu-open");
    };

    const openDrawer = () => {
        if (!isMobileViewport()) return;
        drawer.hidden = false;
        menuBtn.setAttribute("aria-expanded", "true");
        header.classList.add("values-mobile-menu-open");
    };

    menuBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (drawer.hidden) {
            openDrawer();
        } else {
            closeDrawer();
        }
    });

    drawer.addEventListener("click", (event) => {
        const target = event.target;
        if (target instanceof HTMLAnchorElement) {
            closeDrawer();
        }
    });

    document.addEventListener("click", (event) => {
        if (drawer.hidden) return;
        if (!header.contains(event.target)) {
            closeDrawer();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeDrawer();
        }
    });

    window.addEventListener("resize", () => {
        if (!isMobileViewport()) {
            closeDrawer();
        }
    }, { passive: true });
});
