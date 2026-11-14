
document.addEventListener("DOMContentLoaded", () => {
    const languageSelect = document.getElementById("languageSelect");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const currentYear = document.getElementById("currentYear");

    const LANGUAGE_STORAGE_KEY = "gsk-academy-language";

    // Update copyright year where the element exists.
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Apply translations to the current page.
    function applyLanguage(language) {
        const translations = window.SITE_TRANSLATIONS?.[language];

        if (!translations) {
            console.error("Language not found:", language);
            return;
        }

        // Set document language and text direction.
        document.documentElement.lang = language;
        document.documentElement.dir =
            language === "ar" ? "rtl" : "ltr";

        // Translate all elements with data-i18n.
        document.querySelectorAll("[data-i18n]").forEach(element => {
            const key = element.dataset.i18n;

            if (Object.prototype.hasOwnProperty.call(translations, key)) {
                element.textContent = translations[key];
            } else {
                console.warn("Missing translation:", language, key);
            }
        });

        // Synchronise the language selector if present.
        if (languageSelect) {
            languageSelect.value = language;
        }

        // Save the selected language.
        try {
            localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        } catch (error) {
            console.warn("Language preference could not be saved.", error);
        }

        // Close mobile navigation after changing language.
        if (mainNav) {
            mainNav.classList.remove("open");
        }

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
        }
    }

    // Read the user's previously selected language.
    let savedLanguage = "en";

    try {
        savedLanguage =
            localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";
    } catch (error) {
        console.warn("Could not read saved language preference.", error);
    }

    if (!window.SITE_TRANSLATIONS?.[savedLanguage]) {
        savedLanguage = "en";
    }

    // Apply language when the page loads.
    applyLanguage(savedLanguage);

    // Listen for language changes.
    if (languageSelect) {
        languageSelect.addEventListener("change", event => {
            applyLanguage(event.target.value);
        });
    }

    // Mobile navigation toggle.
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        // Close mobile navigation after clicking a link.
        mainNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }
});
