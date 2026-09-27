(function () {
    function revealElements(scope) {
        const root = scope || document;
        const selectors = [
            ".about-page .about-section",
            ".about-page .section-title",
            ".about-page .team-card",
            ".about-page .about-vegetable-banner",
            ".about-page .about-vegetable-copy",
            "#directoryView .market-card",
            "#produce .produce-card",
            "#produce .produce-market-card"
        ];

        const items = root.querySelectorAll(selectors.join(","));
        if (!items.length) return;

        items.forEach((el, index) => {
            el.classList.add("ff-reveal");
            el.style.transitionDelay = `${Math.min(index % 8, 7) * 60}ms`;
        });

        if (!("IntersectionObserver" in window)) {
            items.forEach(el => el.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        items.forEach(el => observer.observe(el));
    }

    window.initFreshFindAnimations = revealElements;
    window.initAboutPage = function () {
        revealElements(document);
    };
})();
