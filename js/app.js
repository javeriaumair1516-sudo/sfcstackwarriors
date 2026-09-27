$(document).ready(function () {

    const routes = {
        "home": "home",
        "markets": "marketdirectory",
        "marketDetail": "marketdetails",
        "produce": "produceguide",
        "bookmarks": "bookmarks",
        "about": "about",
        "contact": "contact",
        "sitemap": "sitemap"
    };

    let currentPage = "";

    function getPageFromUrl() {
        const hash = window.location.hash.replace(/^#/, "");
        if (hash && routes[hash]) {
            return hash;
        }

        let path = window.location.pathname.replace(/\/$/, "");
        const lastPart = path.split("/").pop();

        const pathMap = {
            "marketdirectory": "markets",
            "marketdetails": "marketDetail",
            "produceguide": "produce",
            "bookmarks": "bookmarks",
            "about": "about",
            "contact": "contact",
            "sitemap": "sitemap",
            "home": "home"
        };

        return pathMap[lastPart] || "home";
    }

    function hashForPage(page) {
        return page === "home" ? "#home" : "#" + page;
    }

    function injectPageBanner(page) {
        if (page === "home") return;
        const labels = {
            markets: ["MARKET DIRECTORY", "Discover local farmers markets and fresh neighborhood finds.", "assests/market9.jpg"],
            marketDetail: ["MARKET DETAILS", "Explore the details, timings and produce available at this market.", "assests/market10.jpg"],
            produce: ["PRODUCE GUIDE", "Explore seasonal fruits, vegetables, herbs, dairy and pantry goods.", "assests/market4.jpg"],
            bookmarks: ["BOOKMARKS", "Keep your favourite markets and produce close at hand.", "assests/market14.jpg"],
            about: ["ABOUT US", "Meet FreshFind and the people behind the platform.", "assests/market6.jpg"],
            contact: ["CONTACT US", "Have a question? We are here to help.", "assests/market12.jpg"],
            sitemap: ["SITE MAP", "Explore every section of FreshFind from one place.", "assests/market9.jpg"]
        };
        const item = labels[page];
        if (!item || document.querySelector("#content > .ff-page-banner")) return;
        const banner = document.createElement("section");
        banner.className = `ff-page-banner ${page === "sitemap" ? "sitemap-banner" : ""} wow animate__animated animate__fadeIn`;
        banner.innerHTML = `<img src="${item[2]}" alt="${item[0]} banner"><div class="ff-page-banner-overlay"></div><div class="ff-page-banner-content"><span>FRESHFIND</span><h1>${item[0]}</h1><p>${item[1]}</p></div>`;
        document.getElementById("content")?.prepend(banner);
        if (typeof window.initFreshFindAnimations === "function") window.initFreshFindAnimations();
    }

    function loadPage(page, addToHistory = false, state = {}) {
        if (!routes[page]) page = "home";

        $.ajax({
            url: "pages/" + routes[page] + ".html",
            type: "GET",
            cache: false,

            success: function (response) {
                $("#content").html(response);
                currentPage = page;
                injectPageBanner(page);

                if (addToHistory) {
                    history.pushState(
                        { page: page, ...state },
                        "",
                        hashForPage(page)
                    );
                }

                if (typeof window.initFreshFindPage === "function") {
                    window.initFreshFindPage(state);
                }
            },

            error: function (xhr, status, error) {
                console.error("Page load error:", status, error);

                $("#content").html(`
                    <section class="content-section">
                        <div class="page-heading">
                            <span>ERROR</span>
                            <h1>Page could not be loaded</h1>
                            <p>Please check the page file and try again.</p>
                        </div>
                    </section>
                `);
            }
        });
    }

    window.loadFreshFindPage = loadPage;

    $(document).on("click", 'a[href^="#"]', function (e) {
        const href = $(this).attr("href");
        if (!href || href === "#") return;

        const target = href.substring(1);

        if (!routes[target]) return;

        e.preventDefault();

        if (target === currentPage) {
            const section = document.getElementById(target);
            if (section) {
                section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            return;
        }

        loadPage(target, true);

        if ($("#mainNav").hasClass("open")) {
            $("#mainNav").removeClass("open");
        }
    });

    window.addEventListener("popstate", function (e) {
        const page = e.state && e.state.page
            ? e.state.page
            : getPageFromUrl();

        loadPage(page, false, e.state || {});
    });

    window.addEventListener("hashchange", function () {
        const page = getPageFromUrl();

        if (page !== currentPage) {
            loadPage(page, false);
        }
    });

    const initialPage = getPageFromUrl();
    const initialState = history.state || {};

    loadPage(initialPage, false, initialState);
});
