/* ============================================================
   Sofie Riisgaard — site interactions
   Sticky nav, mobile menu, scroll reveal, and photo lightbox.
   ============================================================ */

(function () {
    "use strict";

    /* ---------- Footer year ---------- */
    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    /* ---------- Sticky header shadow ---------- */
    const header = document.getElementById("siteHeader");

    function updateHeader() {
        if (!header) return;
        header.classList.toggle("is-scrolled", window.scrollY > 24);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    /* ---------- Mobile menu ---------- */
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");

    function closeMenu() {
        if (!navMenu || !navToggle) return;
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", function () {
            const isOpen = navMenu.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
            navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
        });

        navMenu.addEventListener("click", function (event) {
            if (event.target.closest("a")) {
                closeMenu();
            }
        });

        document.addEventListener("click", function (event) {
            if (!navMenu.classList.contains("is-open")) return;
            if (navMenu.contains(event.target) || navToggle.contains(event.target)) return;
            closeMenu();
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 820) {
                closeMenu();
            }
        });
    }

    /* ---------- Scroll reveal ---------- */
    const revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -48px 0px" });

        revealItems.forEach(function (element, index) {
            element.style.transitionDelay = (index % 3) * 70 + "ms";
            observer.observe(element);
        });
    } else {
        revealItems.forEach(function (element) {
            element.classList.add("is-visible");
        });
    }

    /* ---------- Lightbox ---------- */
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");

    const galleryItems = Array.from(document.querySelectorAll(".gallery__item"));
    let currentIndex = 0;
    let lastFocused = null;

    function showPhoto(index) {
        if (!galleryItems.length) return;

        currentIndex = (index + galleryItems.length) % galleryItems.length;

        const item = galleryItems[currentIndex];
        const image = item.querySelector("img");

        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = item.dataset.caption || "";
    }

    function openLightbox(index) {
        if (!lightbox) return;

        lastFocused = document.activeElement;
        showPhoto(index);

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        lightboxClose.focus();
    }

    function closeLightbox() {
        if (!lightbox) return;

        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        if (lastFocused) {
            lastFocused.focus();
        }
    }

    if (lightbox) {
        galleryItems.forEach(function (item, index) {
            item.addEventListener("click", function () {
                openLightbox(index);
            });
        });

        lightboxClose.addEventListener("click", closeLightbox);
        lightboxPrev.addEventListener("click", function () { showPhoto(currentIndex - 1); });
        lightboxNext.addEventListener("click", function () { showPhoto(currentIndex + 1); });

        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (!lightbox.classList.contains("is-open")) return;

            if (event.key === "Escape") {
                closeLightbox();
            } else if (event.key === "ArrowLeft") {
                showPhoto(currentIndex - 1);
            } else if (event.key === "ArrowRight") {
                showPhoto(currentIndex + 1);
            }
        });
    }
})();
