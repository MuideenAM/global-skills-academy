
document.addEventListener("DOMContentLoaded", () => {

    const languageSelect = document.getElementById("languageSelect");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    // Update copyright year
    document.getElementById("currentYear").textContent =
        new Date().getFullYear();

    // Apply a selected language
    function applyLanguage(language) {

        const translations = window.SITE_TRANSLATIONS[language];

        if (!translations) {
            console.error("Language not found:", language);
            return;
        }

        // Update HTML language and direction
        document.documentElement.lang = language;
        document.documentElement.dir =
            language === "ar" ? "rtl" : "ltr";

        // Update all translated elements
        document.querySelectorAll("[data-i18n]").forEach(element => {

            const key = element.dataset.i18n;

            if (translations[key]) {
                element.textContent = translations[key];
            }

        });

        // Remember language selection
        try {
            localStorage.setItem("gsk-academy-language", language);
        } catch (error) {
            console.warn("Language preference could not be saved.");
        }

        // Close mobile menu after switching
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    }

    // Load saved language preference
    let savedLanguage = "en";

    try {
        savedLanguage =
            localStorage.getItem("gsk-academy-language") || "en";
    } catch (error) {
        console.warn("Could not read saved language preference.");
    }

    if (!window.SITE_TRANSLATIONS[savedLanguage]) {
        savedLanguage = "en";
    }

    languageSelect.value = savedLanguage;
    applyLanguage(savedLanguage);

    // Language selector event
    languageSelect.addEventListener("change", event => {
        applyLanguage(event.target.value);
    });

    // Mobile navigation
    menuToggle.addEventListener("click", () => {

        const isOpen = mainNav.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });

    // Close mobile menu after navigation
    mainNav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {
            mainNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });

    });

});
