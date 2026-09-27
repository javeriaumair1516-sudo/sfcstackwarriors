const HEADER = {
    menuBtn: document.getElementById("menuBtn"),
    mainNav: document.getElementById("mainNav"),
    profileBtn: document.getElementById("profileBtn"),
    currentTime: document.getElementById("currentTime"),
    visitorCount: document.getElementById("visitorCount"),
    footerYear: document.getElementById("footerYear"),
    authOverlay: document.getElementById("authOverlay"),
    authClose: document.getElementById("authClose"),
    loginTab: document.getElementById("loginTab"),
    signupTab: document.getElementById("signupTab"),
    loginForm: document.getElementById("loginForm"),
    signupForm: document.getElementById("signupForm"),
    toast: document.getElementById("toast"),
    headerSearchBtn: document.getElementById("headerSearchBtn"),
    globalSearchPanel: document.getElementById("globalSearchPanel"),
    globalSearchForm: document.getElementById("globalSearchForm"),
    globalSearchInput: document.getElementById("globalSearchInput"),
    globalSearchClose: document.getElementById("globalSearchClose")
};

let toastTimer = null;
let marketsCache = [];
let marketsLoading = null;

const DAY_NAMES = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
];

const PRODUCE_INFO = {
    "Vegetables": { icon: "fa-solid fa-carrot", season: "Year-round" },
    "Fruits": { icon: "fa-solid fa-apple-whole", season: "Seasonal" },
    "Herbs": { icon: "fa-solid fa-seedling", season: "Seasonal" },
    "Dairy": { icon: "fa-solid fa-cheese", season: "Year-round" },
    "Pantry": { icon: "fa-solid fa-jar", season: "Year-round" }
};

const PRODUCE_CATALOG_DATA = [
    { id: "p1", name: "Organic Tomatoes", category: "Vegetables", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=700&q=85", season: "Summer & Autumn", description: "Juicy, vine-ripened organic tomatoes rich in lycopene and fresh flavor.", markets: ["Green Valley Market", "City Organic Hub"] },
    { id: "p2", name: "Honeycrisp Apples", category: "Fruits", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=700&q=85", season: "Autumn & Winter", description: "Crisp, sweet orchard apples harvested fresh from local high-altitude growers.", markets: ["Green Valley Market", "Riverside Market"] },
    { id: "p3", name: "Fresh Garden Mint", category: "Herbs", image: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=700&q=85", season: "Spring & Summer", description: "Aromatic green mint leaves grown organically for tea and seasoning.", markets: ["Riverside Market", "City Organic Hub"] },
    { id: "p4", name: "Artisanal Cheddar", category: "Dairy", image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=700&q=85", season: "All Year", description: "Traditional 12-month aged farm cheddar crafted from grass-fed whole milk.", markets: ["Highland Dairy Stand"] },
    { id: "p5", name: "Wild Mountain Honey", category: "Pantry", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=700&q=85", season: "All Year", description: "Pure, raw, unfiltered honey gathered from mountain flora.", markets: ["City Organic Hub", "Highland Dairy Stand"] },
    { id: "p6", name: "Baby Spinach", category: "Vegetables", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=700&q=85", season: "Spring & Autumn", description: "Tender, iron-rich organic baby spinach leaves picked fresh daily.", markets: ["City Organic Hub", "Riverside Market"] },
    { id: "p7", name: "Fresh Strawberries", category: "Fruits", image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=700&q=85", season: "Spring & Summer", description: "Sweet, bright red hand-picked strawberries bursting with natural juice.", markets: ["Green Valley Market"] },
    { id: "p8", name: "Organic Carrots", category: "Vegetables", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=700&q=85", season: "Autumn & Winter", description: "Crunchy, sweet beta-carotene rich root carrots from local fields.", markets: ["Green Valley Market", "City Organic Hub"] },
    { id: "p9", name: "Fresh Basil Leaves", category: "Herbs", image: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=700&q=85", season: "Summer", description: "Fragrant sweet Italian basil perfect for fresh pesto and cooking.", markets: ["Riverside Market"] },
    { id: "p10", name: "Farm Whole Milk", category: "Dairy", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=700&q=85", season: "All Year", description: "Pasteurized, non-homogenized natural milk rich in cream and nutrients.", markets: ["Highland Dairy Stand"] },
    { id: "p11", name: "Hass Avocados", category: "Fruits", image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=700&q=85", season: "Summer & Autumn", description: "Creamy Hass avocados packed with healthy fats and essential minerals.", markets: ["City Organic Hub"] },
    { id: "p12", name: "Cold Pressed Olive Oil", category: "Pantry", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=700&q=85", season: "All Year", description: "Cold-pressed artisanal olive oil crafted from sustainable groves.", markets: ["City Organic Hub"] }
];

const PRODUCE_MARKETS_DATA = [
    { name: "Green Valley Market", location: "742 Evergreen Terrace, Downtown", timing: "Sat & Sun: 8:00 AM - 2:00 PM", image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=700&q=85", description: "Open-air community market hosting local farmers offering organic items." },
    { name: "City Organic Hub", location: "101 Central Boulevard, Westside", timing: "Mon - Sat: 9:00 AM - 7:00 PM", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&q=85", description: "Eco-friendly store carrying fresh vegetables, fruits and organic herbs." },
    { name: "Riverside Farmers Market", location: "Pier 14, Riverside Park", timing: "Wednesday: 3:00 PM - 7:00 PM", image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=700&q=85", description: "Waterfront market specializing in fresh fruits, herbs and homemade goods." },
    { name: "Highland Dairy Stand", location: "Route 9 Farm District", timing: "Tue - Sun: 7:00 AM - 4:00 PM", image: "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=700&q=85", description: "Dedicated dairy outlet featuring aged cheese, raw honey and whole milk." },
    { name: "Sunrise Organic Bazaar", location: "45 Eastside Avenue", timing: "Daily: 7:00 AM - 1:00 PM", image: "https://images.unsplash.com/photo-1506484381205-f7945653044d?w=700&q=85", description: "Morning market known for fresh leafy greens, roots and berries." }
];

const PRODUCE_BOOKMARK_KEY = "freshfind_produce_bookmarks";
const PRODUCE_NOTES_KEY = "freshfind_produce_notes";

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function updateClock() {
    if (!HEADER.currentTime) return;
    HEADER.currentTime.textContent = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });
}

function updateVisitorCount() {
    if (!HEADER.visitorCount) return;
    const key = "freshfind_visitor_count_v3";
    let count = parseInt(localStorage.getItem(key), 10);
    if (Number.isNaN(count)) count = 1285;
    count += 1;
    localStorage.setItem(key, String(count));
    HEADER.visitorCount.textContent = count.toLocaleString();
}

function switchAuthTab(tab) {
    if (!HEADER.loginTab || !HEADER.signupTab || !HEADER.loginForm || !HEADER.signupForm) return;
    const login = tab === "login";
    HEADER.loginTab.classList.toggle("active", login);
    HEADER.signupTab.classList.toggle("active", !login);
    HEADER.loginForm.hidden = !login;
    HEADER.signupForm.hidden = login;
}

function bindHeader() {
    if (window.__freshFindHeaderBound) return;
    window.__freshFindHeaderBound = true;

    if (HEADER.menuBtn && HEADER.mainNav) {
        HEADER.menuBtn.addEventListener("click", function () {
            HEADER.mainNav.classList.toggle("open");
        });
    }

    if (HEADER.profileBtn && HEADER.authOverlay) {
        HEADER.profileBtn.addEventListener("click", function () {
            HEADER.authOverlay.classList.add("open");
            switchAuthTab("login");
        });
    }

    if (HEADER.authClose && HEADER.authOverlay) {
        HEADER.authClose.addEventListener("click", function () {
            HEADER.authOverlay.classList.remove("open");
        });

        HEADER.authOverlay.addEventListener("click", function (e) {
            if (e.target === HEADER.authOverlay) {
                HEADER.authOverlay.classList.remove("open");
            }
        });
    }

    if (HEADER.loginTab) HEADER.loginTab.addEventListener("click", () => switchAuthTab("login"));
    if (HEADER.signupTab) HEADER.signupTab.addEventListener("click", () => switchAuthTab("signup"));

    function validName(value) {
        return /^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/.test(value.trim()) && value.trim().length >= 2;
    }
    function validEmail(value) {
        return /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(value.trim());
    }
    function validPassword(value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value);
    }

    if (HEADER.loginForm) HEADER.loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = HEADER.loginForm.querySelector('input[name="email"]')?.value || "";
        const password = HEADER.loginForm.querySelector('input[name="password"]')?.value || "";
        if (!validEmail(email)) return showToast("Please enter a valid email address.");
        if (!validPassword(password)) return showToast("Password must be 8+ characters with uppercase, lowercase, number and special character.");
        HEADER.authOverlay?.classList.remove("open");
        alert("Sign in details are valid. Demo submitted successfully.");
    });

    if (HEADER.signupForm) HEADER.signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = HEADER.signupForm.querySelector('input[name="name"]')?.value || "";
        const email = HEADER.signupForm.querySelector('input[name="email"]')?.value || "";
        const password = HEADER.signupForm.querySelector('input[name="password"]')?.value || "";
        if (!validName(name)) return showToast("Name can contain letters, spaces, dots, apostrophes or hyphens only.");
        if (!validEmail(email)) return showToast("Please enter a valid email address.");
        if (!validPassword(password)) return showToast("Password must be 8+ characters with uppercase, lowercase, number and special character.");
        HEADER.authOverlay?.classList.remove("open");
        alert("Sign up details are valid. Demo submitted successfully.");
    });

    if (HEADER.headerSearchBtn && HEADER.globalSearchPanel) {
        HEADER.headerSearchBtn.addEventListener("click", function () {
            const open = !HEADER.globalSearchPanel.hidden;
            HEADER.globalSearchPanel.hidden = open;
            HEADER.headerSearchBtn.setAttribute("aria-expanded", String(!open));
            if (!open) setTimeout(() => HEADER.globalSearchInput?.focus(), 50);
        });
    }
    HEADER.globalSearchClose?.addEventListener("click", function () {
        HEADER.globalSearchPanel.hidden = true;
        HEADER.headerSearchBtn?.setAttribute("aria-expanded", "false");
    });
    HEADER.globalSearchForm?.addEventListener("submit", function (e) {
        e.preventDefault();
        const q = (HEADER.globalSearchInput?.value || "").trim();
        if (!q) return showToast("Type a market, area or produce to search.");
        HEADER.globalSearchPanel.hidden = true;
        HEADER.headerSearchBtn?.setAttribute("aria-expanded", "false");
        window.loadFreshFindPage?.("markets", true, { quickFind: { q } });
    });

    if (HEADER.footerYear) HEADER.footerYear.textContent = new Date().getFullYear();
    updateClock();
    updateVisitorCount();
    setInterval(updateClock, 1000);
}

function showToast(message) {
    const toast = HEADER.toast || document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function setActiveNav(id) {
    document.querySelectorAll(".nav-link").forEach(function (link) {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
}

function renderBreadcrumbs(id) {
    const labels = {
        home: "Home",
        markets: "Market Directory",
        marketDetail: "Market Details",
        produce: "Produce Guide",
        bookmarks: "Bookmarks",
        about: "About",
        contact: "Contact",
        sitemap: "Sitemap"
    };
    document.querySelectorAll("[data-breadcrumb]").forEach(function (nav) {
        nav.innerHTML = id === "home"
            ? `<a href="#home">Home</a>`
            : `<a href="#home">Home</a><span class="crumb-sep">/</span><span class="crumb-current">${escapeHtml(labels[id] || id)}</span>`;
    });
    setActiveNav(id);
}

function loadMarkets() {
    if (marketsCache.length) return Promise.resolve(marketsCache);
    if (marketsLoading) return marketsLoading;

    marketsLoading = fetch("data/market.json", { cache: "no-store" })
        .then(response => {
            if (!response.ok) throw new Error("Market data request failed");
            return response.json();
        })
        .then(data => {
            marketsCache = Array.isArray(data) ? data : [];
            return marketsCache;
        })
        .catch(error => {
            console.error(error);
            marketsCache = [];
            throw error;
        });

    return marketsLoading;
}

function marketIsOpenToday(market) {
    const today = DAY_NAMES[new Date().getDay()];
    return market.days.includes("Everyday") || market.days.includes(today);
}

function marketIsOpenNow(market, date = new Date()) {
    const day = DAY_NAMES[date.getDay()];
    if (!(market.days.includes("Everyday") || market.days.includes(day))) return false;

    const parts = String(market.hours || "").split("-");
    if (parts.length !== 2) return false;

    function toMinutes(value) {
        const match = value.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (!match) return null;
        let hour = Number(match[1]);
        const minute = Number(match[2]);
        const ap = match[3].toUpperCase();
        if (ap === "PM" && hour !== 12) hour += 12;
        if (ap === "AM" && hour === 12) hour = 0;
        return hour * 60 + minute;
    }

    const start = toMinutes(parts[0]);
    const end = toMinutes(parts[1]);
    if (start === null || end === null) return false;

    const now = date.getHours() * 60 + date.getMinutes();
    return end >= start ? now >= start && now <= end : now >= start || now <= end;
}

function categoryIcon(category) {
    return {
        Vegetables: "fa-carrot",
        Fruits: "fa-apple-whole",
        "Herbs & Greens": "fa-seedling",
        Dairy: "fa-cheese",
        Spices: "fa-mortar-pestle"
    }[category] || "fa-leaf";
}

function distanceKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const toRad = n => n * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function initMarketDirectory(state = {}) {
    const container = document.getElementById("marketContainer");
    if (!container || container.dataset.initialized === "1") return;
    container.dataset.initialized = "1";

    const search = document.getElementById("marketSearch");
    const area = document.getElementById("areaFilter");
    const day = document.getElementById("dayFilter");
    const produce = document.getElementById("produceFilter");
    const sort = document.getElementById("sortFilter");
    const count = document.getElementById("marketCount");
    const subtitle = document.getElementById("resultsSubtitle");
    const loader = document.getElementById("marketLoader");
    const empty = document.getElementById("emptyState");
    const activeFilters = document.getElementById("activeFilters");
    let userLocation = null;

    function fillFilters() {
        const areas = [...new Set(marketsCache.map(m => m.area))].sort();
        const produceItems = [...new Set(marketsCache.flatMap(m => m.produce))].sort();

        area.innerHTML = `<option value="">All Areas</option>` + areas.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
        produce.innerHTML = `<option value="">All Produce</option>` + produceItems.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
    }

    function renderFiltersChips() {
        if (!activeFilters) return;
        activeFilters.innerHTML = "";
        const chips = [];
        if (search.value.trim()) chips.push([`Search: "${search.value.trim()}"`, () => { search.value = ""; }]);
        if (area.value) chips.push([`Area: ${area.value}`, () => { area.value = ""; }]);
        if (day.value) chips.push([`Day: ${day.value}`, () => { day.value = ""; }]);
        if (produce.value) chips.push([`Produce: ${produce.value}`, () => { produce.value = ""; }]);

        chips.forEach(function ([label, clear]) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "filter-chip";
            btn.innerHTML = `${escapeHtml(label)} <i class="fa-solid fa-xmark"></i>`;
            btn.addEventListener("click", function () { clear(); applyFilters(); });
            activeFilters.appendChild(btn);
        });
    }

    function applyFilters() {
        const q = search.value.trim().toLowerCase();
        let list = marketsCache.filter(function (market) {
            const haystack = [market.name, market.area, market.description, ...(market.produce || [])].join(" ").toLowerCase();
            return (!q || haystack.includes(q)) &&
                (!area.value || market.area === area.value) &&
                (!day.value || market.days.includes(day.value) || market.days.includes("Everyday")) &&
                (!produce.value || market.produce.includes(produce.value));
        });

        if (sort.value === "az") list.sort((a, b) => a.name.localeCompare(b.name));
        if (sort.value === "za") list.sort((a, b) => b.name.localeCompare(a.name));
        if (sort.value === "nextopen") list.sort((a, b) => Number(marketIsOpenToday(b)) - Number(marketIsOpenToday(a)));
        if (sort.value === "nearest" && userLocation) {
            list.sort((a, b) => distanceKm(userLocation.lat, userLocation.lng, a.lat, a.lng) - distanceKm(userLocation.lat, userLocation.lng, b.lat, b.lng));
        }

        renderCards(list);
        renderFiltersChips();
    }

    function renderCards(list) {
        container.innerHTML = "";
        if (count) count.textContent = `${list.length} Market${list.length === 1 ? "" : "s"} Found`;
        if (subtitle) subtitle.textContent = list.length ? "Explore farmers markets in your area." : "No markets match your current filters.";
        if (!list.length) {
            if (empty) empty.classList.remove("d-none");
            return;
        }
        if (empty) empty.classList.add("d-none");

        list.forEach(function (market, index) {
            const distance = userLocation ? `<span class="market-distance"><i class="fa-solid fa-location-crosshairs"></i> ${distanceKm(userLocation.lat, userLocation.lng, market.lat, market.lng).toFixed(1)} km</span>` : "";
            const tags = (market.produce || []).map(item => `<span class="produce-tag"><i class="fa-solid ${categoryIcon(item)}"></i>${escapeHtml(item)}</span>`).join("");
            const card = document.createElement("div");
            card.className = "col-md-6 col-lg-4 wow animate__animated animate__fadeInUp";
            card.innerHTML = `
                <article class="market-card h-100" style="animation-delay:${(index % 9) * 0.06}s">
                    <div class="market-image-wrap">
                        <img class="market-image" src="${escapeHtml(market.image)}" alt="${escapeHtml(market.name)}" loading="lazy">
                        <span class="market-tag"><i class="fa-solid ${categoryIcon(market.produce?.[0])}"></i>${escapeHtml(market.produce?.[0] || "Fresh Produce")}</span>
                        ${distance}
                        <button type="button" class="market-bookmark-btn ${isBookmarked("market", market.id) ? "saved" : ""}" data-bookmark-market="${Number(market.id)}" aria-label="${isBookmarked("market", market.id) ? "Remove" : "Save"} ${escapeHtml(market.name)}">
                            <i class="fa-${isBookmarked("market", market.id) ? "solid" : "regular"} fa-bookmark"></i>
                        </button>
                    </div>
                    <div class="market-card-body">
                        <h4>${escapeHtml(market.name)}</h4>
                        <p class="market-location"><i class="fa-solid fa-location-dot"></i>${escapeHtml(market.area)}</p>
                        <div class="market-meta"><i class="fa-regular fa-clock"></i><span>${escapeHtml(market.hours)}</span></div>
                        <div class="market-meta"><i class="fa-regular fa-calendar"></i><span>${escapeHtml((market.days || []).join(", "))}</span></div>
                        <p class="market-description">${escapeHtml(market.description)}</p>
                        <div class="produce-tags">${tags}</div>
                        <div class="card-footer-actions">
                            <div class="open-status">
                                <strong>${marketIsOpenToday(market) ? "Open Today" : "Closed Today"}</strong>
                                <small>${escapeHtml(market.hours)}</small>
                            </div>
                            <button type="button" class="details-btn view-market" data-id="${Number(market.id)}">
                                View Market Details <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </article>`;
            container.appendChild(card);
        });
    }

    container.addEventListener("click", function (e) {
        const bookmarkButton = e.target.closest("[data-bookmark-market]");
        if (bookmarkButton) {
            e.preventDefault();
            e.stopPropagation();
            toggleBookmark("market", bookmarkButton.dataset.bookmarkMarket);
            applyFilters();
            return;
        }

        const button = e.target.closest(".view-market");
        if (!button) return;
        const marketId = Number(button.dataset.id);
        if (!marketId) return;
        window.loadFreshFindPage("marketDetail", true, { marketId });
    });

    search.addEventListener("input", applyFilters);
    area.addEventListener("change", applyFilters);
    day.addEventListener("change", applyFilters);
    produce.addEventListener("change", applyFilters);
    sort.addEventListener("change", applyFilters);

    document.getElementById("resetFilters")?.addEventListener("click", function () {
        search.value = "";
        area.value = "";
        day.value = "";
        produce.value = "";
        sort.value = "az";
        applyFilters();
    });

    document.getElementById("emptyReset")?.addEventListener("click", function () {
        document.getElementById("resetFilters")?.click();
    });

    document.getElementById("clearSearch")?.addEventListener("click", function () {
        search.value = "";
        applyFilters();
        search.focus();
    });

    document.getElementById("locationBtn")?.addEventListener("click", function () {
        const button = this;
        if (!navigator.geolocation) {
            document.getElementById("locationMessage").textContent = "Location is not supported by this browser.";
            return;
        }
        button.disabled = true;
        document.getElementById("locationMessage").textContent = "Getting your location...";
        navigator.geolocation.getCurrentPosition(function (position) {
            userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
            document.getElementById("locationMessage").textContent = "Location found. Nearest markets are ready.";
            sort.value = "nearest";
            applyFilters();
            button.disabled = false;
        }, function () {
            document.getElementById("locationMessage").textContent = "Location access was denied.";
            button.disabled = false;
        }, { timeout: 8000 });
    });

    loadMarkets().then(function (data) {
        loader?.classList.add("d-none");
        fillFilters();
        if (state?.quickFind) {
            search.value = state.quickFind.q || state.quickFind.area || "";
            area.value = "";
            day.value = state.quickFind.day || "";
            produce.value = state.quickFind.produce || "";
        }
        applyFilters();
        const heroCount = document.getElementById("heroMarketCount");
        if (heroCount) heroCount.textContent = data.length;
    }).catch(function () {
        loader?.classList.add("d-none");
        container.innerHTML = `<div class="col-12"><div class="alert alert-danger">Markets could not be loaded. Please check data/market.json.</div></div>`;
    });
}

function renderMarketDetails(market) {
    const root = document.getElementById("marketDetailPage");
    if (!root || !market) return;

    document.getElementById("detailName").textContent = market.name;
    document.getElementById("detailDescription").textContent = market.description;
    document.getElementById("detailImage").src = market.image;
    document.getElementById("detailImage").alt = market.name;
    document.getElementById("detailAddress").textContent = market.address;
    document.getElementById("detailArea").textContent = market.area;
    document.getElementById("detailHours").textContent = market.hours;
    document.getElementById("detailDays").textContent = (market.days || []).join(", ");
    document.getElementById("detailProduce").textContent = (market.produce || []).join(", ");
    document.getElementById("mapAddress").textContent = market.address;
    document.getElementById("marketMap").src = `https://www.google.com/maps?q=${market.lat},${market.lng}&z=15&output=embed`;
    document.getElementById("directionsLink").href = market.map;

    const rows = DAY_NAMES.slice(1).concat(DAY_NAMES[0]).map(function (day) {
        const open = market.days.includes("Everyday") || market.days.includes(day);
        return `<tr><td><strong>${day}</strong></td><td>${open ? escapeHtml(market.hours) : "—"}</td><td><span class="schedule-${open ? "open" : "closed"}"><i class="fa-solid fa-circle-${open ? "check" : "xmark"}"></i> ${open ? "Open" : "Closed"}</span></td></tr>`;
    }).join("");
    document.getElementById("scheduleBody").innerHTML = rows;

    const products = market.products || {};
    const items = [];
    Object.keys(products).forEach(function (category) {
        const data = products[category] || {};
        [...(data.yearRound || [])].forEach(item => items.push({ ...item, availability: "Year-round" }));
        [...(data.seasonal || [])].forEach(item => items.push({ ...item, availability: "Seasonal" }));
    });
    document.getElementById("productGrid").innerHTML = items.length
        ? items.map(item => `<div class="product-item"><div class="product-emoji">${escapeHtml(item.icon || "🌱")}</div><h5>${escapeHtml(item.name)}</h5><p>${escapeHtml(item.availability)}</p></div>`).join("")
        : `<p class="detail-subtitle">Produce information is not available for this market.</p>`;

    document.getElementById("backToDirectory")?.addEventListener("click", function () {
        window.loadFreshFindPage("markets", true);
    }, { once: true });
}

function initMarketDetails(state) {
    if (!document.getElementById("marketDetailPage")) return;
    loadMarkets().then(function (data) {
        const market = data.find(item => Number(item.id) === Number(state?.marketId));
        if (market) renderMarketDetails(market);
        else document.getElementById("detailName").textContent = "Market not selected";
    });
}

function getProduceBookmarks() {
    try { return JSON.parse(localStorage.getItem(PRODUCE_BOOKMARK_KEY)) || []; }
    catch { return []; }
}
function saveProduceBookmarks(list) { localStorage.setItem(PRODUCE_BOOKMARK_KEY, JSON.stringify(list)); }
function getProduceNotes() {
    try { return JSON.parse(localStorage.getItem(PRODUCE_NOTES_KEY)) || {}; }
    catch { return {}; }
}
function saveProduceNotes(notes) { localStorage.setItem(PRODUCE_NOTES_KEY, JSON.stringify(notes)); }
function isProduceSaved(id) { return getProduceBookmarks().includes(id); }

function renderProduceCategories() {
    const bar = document.getElementById("produceCategoryBar");
    if (!bar) return;
    const categories = ["All", "Vegetables", "Fruits", "Herbs", "Dairy", "Pantry"];
    const active = window.__produceCategory || "All";
    bar.innerHTML = categories.map(cat => `<button type="button" class="produce-category-btn ${active === cat ? "active" : ""}" data-category="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`).join("");
}

function renderProduceCatalog() {
    const grid = document.getElementById("produceCatalogGrid");
    const search = document.getElementById("produceGlobalSearch");
    const counter = document.getElementById("produceCatalogCounter");
    if (!grid) return;
    const query = (search?.value || "").trim().toLowerCase();
    const category = window.__produceCategory || "All";
    const filtered = PRODUCE_CATALOG_DATA.filter(item => {
        const matchesCategory = category === "All" || item.category === category;
        const text = `${item.name} ${item.description} ${item.category} ${item.markets.join(" ")}`.toLowerCase();
        return matchesCategory && (!query || text.includes(query));
    });
    if (counter) counter.textContent = `Showing ${filtered.length} of ${PRODUCE_CATALOG_DATA.length} items`;
    grid.innerHTML = filtered.map(item => {
        const saved = isProduceSaved(item.id);
        return `<article class="produce-card wow animate__animated animate__fadeInUp">
            <div class="produce-card-image">
                <img src="${item.image}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.style.display='none'">
                <span>${escapeHtml(item.category)}</span>
                <button type="button" class="produce-save-btn ${saved ? "saved" : ""}" data-produce-save="${escapeHtml(item.id)}" aria-label="${saved ? "Remove" : "Save"} ${escapeHtml(item.name)}"><i class="fa-solid fa-bookmark"></i></button>
            </div>
            <div class="produce-card-body">
                <h3>${escapeHtml(item.name)}</h3>
                <p>${escapeHtml(item.description)}</p>
                <div class="produce-card-meta"><span><i class="fa-regular fa-calendar"></i>${escapeHtml(item.season)}</span></div>
                <div class="produce-market-list"><strong>Available at:</strong> ${escapeHtml(item.markets.join(", "))}</div>
            </div>
        </article>`;
    }).join("") || `<div class="produce-empty"><i class="fa-solid fa-basket-shopping"></i><h3>No produce found</h3><p>Try another search or category.</p></div>`;
}

function renderProduceMarkets() {
    const grid = document.getElementById("produceMarketsGrid");
    if (!grid) return;
    grid.innerHTML = PRODUCE_MARKETS_DATA.map(market => `<article class="produce-market-card wow animate__animated animate__fadeInUp">
        <img src="${market.image}" alt="${escapeHtml(market.name)}" loading="lazy" onerror="this.style.display='none'">
        <div><h3>${escapeHtml(market.name)}</h3><p><i class="fa-solid fa-location-dot"></i>${escapeHtml(market.location)}</p><p><i class="fa-regular fa-clock"></i>${escapeHtml(market.timing)}</p><p>${escapeHtml(market.description)}</p></div>
    </article>`).join("");
}

function renderProduceSaved() {
    const list = document.getElementById("produceSavedList");
    const badge = document.getElementById("produceSavedCount");
    if (!list) return;
    const saved = getProduceBookmarks();
    const notes = getProduceNotes();
    if (badge) { badge.textContent = saved.length; badge.hidden = saved.length === 0; }
    if (!saved.length) {
        list.innerHTML = `<div class="produce-empty"><i class="fa-regular fa-bookmark"></i><h3>Your shopping list is empty</h3><p>Use the bookmark icon on a produce card to save an item.</p></div>`;
        return;
    }
    list.innerHTML = saved.map(id => {
        const item = PRODUCE_CATALOG_DATA.find(p => p.id === id);
        if (!item) return "";
        return `<article class="produce-saved-item">
            <img src="${item.image}" alt="${escapeHtml(item.name)}">
            <div class="produce-saved-copy"><div class="produce-saved-title"><h3>${escapeHtml(item.name)}</h3><button type="button" data-remove-produce="${escapeHtml(item.id)}"><i class="fa-solid fa-trash-can"></i> Remove</button></div><p>${escapeHtml(item.description)}</p><textarea data-produce-note="${escapeHtml(item.id)}" placeholder="Add a private note...">${escapeHtml(notes[item.id] || "")}</textarea></div>
        </article>`;
    }).join("");
}

function switchProduceTab(tab) {
    const tabs = { catalog: "produceViewCatalog", markets: "produceViewMarkets", bookmarks: "produceViewBookmarks" };
    Object.entries(tabs).forEach(([key, id]) => { const el = document.getElementById(id); if (el) el.hidden = key !== tab; });
    document.querySelectorAll(".produce-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.produceTab === tab));
    if (tab === "bookmarks") renderProduceSaved();
}

function produceToast(message) { showToast(message); }

function toggleProduceBookmark(id) {
    let saved = getProduceBookmarks();
    if (saved.includes(id)) { saved = saved.filter(x => x !== id); produceToast("Removed from shopping list."); }
    else { saved.push(id); produceToast("Added to shopping list."); }
    saveProduceBookmarks(saved);
    renderProduceCatalog();
    renderProduceSaved();
}

function handleProduceAssistant(query) {
    const stream = document.getElementById("produceChatStream");
    if (!stream) return;
    const q = query.trim();
    if (!q) return;
    const user = document.createElement("div"); user.className = "produce-user-message"; user.textContent = q; stream.appendChild(user);
    setTimeout(() => {
        const lower = q.toLowerCase();
        let reply = "I can help with produce, markets and your saved shopping list.";
        if (lower.includes("vegetable") || lower.includes("tomato") || lower.includes("spinach")) { reply = "Opening the Vegetables catalog for you."; window.__produceCategory = "Vegetables"; renderProduceCategories(); renderProduceCatalog(); switchProduceTab("catalog"); }
        else if (lower.includes("fruit")) { reply = "Opening the Fruits catalog for you."; window.__produceCategory = "Fruits"; renderProduceCategories(); renderProduceCatalog(); switchProduceTab("catalog"); }
        else if (lower.includes("market") || lower.includes("where")) { reply = "Here are the partner markets from the Fresh Harvest guide."; switchProduceTab("markets"); }
        else if (lower.includes("bookmark") || lower.includes("save")) { reply = "Use the bookmark button on any produce card, then open Saved Items."; switchProduceTab("bookmarks"); }
        const bot = document.createElement("div"); bot.className = "produce-bot-message"; bot.textContent = reply; stream.appendChild(bot); stream.scrollTop = stream.scrollHeight;
    }, 250);
}

function initProduceGuide() {
    const page = document.getElementById("produce");
    if (!page || !document.getElementById("produceCatalogGrid")) return;
    if (page.dataset.initialized === "1") { renderProduceCategories(); renderProduceCatalog(); renderProduceMarkets(); renderProduceSaved(); return; }
    page.dataset.initialized = "1";
    window.__produceCategory = "All";
    renderProduceCategories(); renderProduceCatalog(); renderProduceMarkets(); renderProduceSaved();

    document.querySelectorAll(".produce-tab").forEach(btn => btn.addEventListener("click", () => switchProduceTab(btn.dataset.produceTab)));
    document.getElementById("produceCategoryBar")?.addEventListener("click", e => { const btn = e.target.closest("[data-category]"); if (!btn) return; window.__produceCategory = btn.dataset.category; renderProduceCategories(); renderProduceCatalog(); });
    document.getElementById("produceGlobalSearch")?.addEventListener("input", renderProduceCatalog);
    document.getElementById("produceCatalogGrid")?.addEventListener("click", e => { const btn = e.target.closest("[data-produce-save]"); if (btn) toggleProduceBookmark(btn.dataset.produceSave); });
    document.getElementById("produceSavedList")?.addEventListener("click", e => { const btn = e.target.closest("[data-remove-produce]"); if (btn) toggleProduceBookmark(btn.dataset.removeProduce); });
    document.getElementById("produceSavedList")?.addEventListener("input", e => { const id = e.target.dataset.produceNote; if (!id) return; const notes = getProduceNotes(); notes[id] = e.target.value; saveProduceNotes(notes); });

    document.getElementById("produceExportBtn")?.addEventListener("click", () => {
        const saved = getProduceBookmarks();
        if (!saved.length) return produceToast("No items to export.");
        const notes = getProduceNotes();
        const lines = ["MY SHOPPING LIST & NOTES", ""];
        saved.forEach((id, i) => { const item = PRODUCE_CATALOG_DATA.find(p => p.id === id); if (item) lines.push(`${i + 1}. ${item.name} (${item.category})`, `   Markets: ${item.markets.join(", ")}`, `   Notes: ${notes[id] || "N/A"}`, ""); });
        const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" })); a.download = "shopping-list.txt"; a.click(); URL.revokeObjectURL(a.href); produceToast("Shopping list exported.");
    });
    const modal = document.getElementById("produceShareModal");
    document.getElementById("produceShareBtn")?.addEventListener("click", () => { if (modal) modal.hidden = false; });
    document.getElementById("produceShareClose")?.addEventListener("click", () => { if (modal) modal.hidden = true; });
    modal?.addEventListener("click", e => { if (e.target === modal) modal.hidden = true; });
    modal?.querySelectorAll("[data-platform]").forEach(btn => btn.addEventListener("click", () => { const url = encodeURIComponent(window.location.href); if (btn.dataset.platform === "whatsapp") window.open(`https://api.whatsapp.com/send?text=${url}`, "_blank"); if (btn.dataset.platform === "twitter") window.open(`https://twitter.com/intent/tweet?url=${url}`, "_blank"); }));
    document.getElementById("produceChatOpen")?.addEventListener("click", () => { const el = document.getElementById("produceChatWindow"); if (el) el.hidden = false; });
    document.getElementById("produceChatClose")?.addEventListener("click", () => { const el = document.getElementById("produceChatWindow"); if (el) el.hidden = true; });
    document.getElementById("produceChatForm")?.addEventListener("submit", e => { e.preventDefault(); const input = document.getElementById("produceChatInput"); handleProduceAssistant(input.value); input.value = ""; });
    document.querySelectorAll(".produce-quick-chips button").forEach(btn => btn.addEventListener("click", () => handleProduceAssistant(btn.dataset.query || "")));
}

const BOOKMARK_KEY = "freshfind_bookmarks";
const NOTES_KEY = "freshfind_notes";

function getBookmarks() {
    try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY)) || []; }
    catch { return []; }
}

function saveBookmarks(list) {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(list));
}

function isBookmarked(type, id) {
    return getBookmarks().some(item => item.type === type && String(item.id) === String(id));
}

function toggleBookmark(type, id) {
    let list = getBookmarks();
    if (isBookmarked(type, id)) {
        list = list.filter(item => !(item.type === type && String(item.id) === String(id)));
        showToast("Removed from bookmarks.");
    } else {
        list.push({ type, id });
        showToast("Added to bookmarks.");
    }
    saveBookmarks(list);
}

function initBookmarks() {
    const grid = document.getElementById("bookmarkGrid");
    if (!grid || grid.dataset.initialized === "1") return;
    grid.dataset.initialized = "1";

    const countEl = document.getElementById("bookmarkCount");

    loadMarkets().then(function (markets) {
        const bookmarks = getBookmarks();
        const marketBookmarks = bookmarks.filter(item => item.type === "market");
        const produceBookmarks = bookmarks.filter(item => item.type === "produce");

        if (countEl) {
            const total = marketBookmarks.length + produceBookmarks.length;
            countEl.textContent = `${total} saved ${total === 1 ? "item" : "items"}`;
        }

        if (!marketBookmarks.length && !produceBookmarks.length) {
            grid.innerHTML = `
                <div class="bookmark-empty-state wow animate__animated animate__fadeInUp">
                    <div class="bookmark-empty-icon"><i class="fa-regular fa-bookmark"></i></div>
                    <span>YOUR COLLECTION IS EMPTY</span>
                    <h3>Save something worth coming back to.</h3>
                    <p>Bookmark a market from Market Directory or save produce from Produce Guide. Your collection will appear here.</p>
                    <div class="bookmark-empty-actions">
                        <a class="bookmark-empty-btn primary" href="#markets"><i class="fa-solid fa-store"></i> Explore Markets</a>
                        <a class="bookmark-empty-btn" href="#produce"><i class="fa-solid fa-carrot"></i> Browse Produce</a>
                    </div>
                </div>`;
            if (typeof window.initFreshFindAnimations === "function") window.initFreshFindAnimations();
            return;
        }

        const marketCards = marketBookmarks.map(function (item) {
            const market = markets.find(m => String(m.id) === String(item.id));
            if (!market) return "";
            return `
                <article class="bookmark-card bookmark-market-card wow animate__animated animate__fadeInUp">
                    <div class="bookmark-card-media">
                        <img src="${escapeHtml(market.image)}" alt="${escapeHtml(market.name)}" loading="lazy">
                        <span class="bookmark-type-badge"><i class="fa-solid fa-store"></i> Market</span>
                        <button class="bookmark-heart saved" type="button" data-remove-market="${market.id}" aria-label="Remove ${escapeHtml(market.name)} from bookmarks"><i class="fa-solid fa-bookmark"></i></button>
                    </div>
                    <div class="bookmark-card-body">
                        <div class="bookmark-card-type">LOCAL MARKET</div>
                        <h3>${escapeHtml(market.name)}</h3>
                        <p class="bookmark-location"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(market.area)}</p>
                        <div class="bookmark-meta-row">
                            <span><i class="fa-regular fa-calendar"></i> ${escapeHtml((market.days || []).join(" • "))}</span>
                            <span><i class="fa-regular fa-clock"></i> ${escapeHtml(market.hours || "")}</span>
                        </div>
                        <div class="bookmark-card-footer">
                            <button class="bookmark-remove" type="button" data-remove-market="${market.id}"><i class="fa-solid fa-trash-can"></i> Remove</button>
                            <button class="bookmark-view" type="button" data-view-market="${market.id}">View Market <i class="fa-solid fa-arrow-right"></i></button>
                        </div>
                    </div>
                </article>`;
        }).join("");

        const produceCards = produceBookmarks.map(function (item) {
            const product = PRODUCE_CATALOG_DATA.find(p => p.id === item.id);
            if (!product) return "";
            return `
                <article class="bookmark-card bookmark-produce-card wow animate__animated animate__fadeInUp">
                    <div class="bookmark-card-media">
                        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
                        <span class="bookmark-type-badge"><i class="fa-solid fa-carrot"></i> Produce</span>
                        <button class="bookmark-heart saved" type="button" data-remove-produce="${escapeHtml(product.id)}" aria-label="Remove ${escapeHtml(product.name)} from bookmarks"><i class="fa-solid fa-bookmark"></i></button>
                    </div>
                    <div class="bookmark-card-body">
                        <div class="bookmark-card-type">${escapeHtml(product.category)}</div>
                        <h3>${escapeHtml(product.name)}</h3>
                        <p class="bookmark-location"><i class="fa-solid fa-leaf"></i> ${escapeHtml(product.season)}</p>
                        <p class="bookmark-description">${escapeHtml(product.description)}</p>
                        <div class="bookmark-card-footer">
                            <button class="bookmark-remove" type="button" data-remove-produce="${escapeHtml(product.id)}"><i class="fa-solid fa-trash-can"></i> Remove</button>
                            <a class="bookmark-view" href="#produce">Open Produce Guide <i class="fa-solid fa-arrow-right"></i></a>
                        </div>
                    </div>
                </article>`;
        }).join("");

        grid.innerHTML = `<div class="bookmark-grid-inner">${marketCards}${produceCards}</div>`;

        grid.querySelectorAll("[data-remove-market]").forEach(btn => btn.addEventListener("click", function () {
            const id = String(this.dataset.removeMarket);
            const next = getBookmarks().filter(item => !(item.type === "market" && String(item.id) === id));
            saveBookmarks(next);
            grid.dataset.initialized = "";
            grid.innerHTML = "";
            initBookmarks();
        }));
        grid.querySelectorAll("[data-remove-produce]").forEach(btn => btn.addEventListener("click", function () {
            const id = String(this.dataset.removeProduce);
            const next = getBookmarks().filter(item => !(item.type === "produce" && String(item.id) === id));
            saveBookmarks(next);
            grid.dataset.initialized = "";
            grid.innerHTML = "";
            initBookmarks();
        }));
        grid.querySelectorAll("[data-view-market]").forEach(btn => btn.addEventListener("click", function () {
            window.loadFreshFindPage("marketDetail", true, { marketId: Number(this.dataset.viewMarket) });
        }));
        if (typeof window.initFreshFindAnimations === "function") window.initFreshFindAnimations();
    }).catch(function () {
        if (countEl) countEl.textContent = "Unable to load saved items";
        grid.innerHTML = `<div class="bookmark-empty-state"><div class="bookmark-empty-icon"><i class="fa-solid fa-triangle-exclamation"></i></div><h3>Bookmarks could not be loaded.</h3><p>Please refresh the page and try again.</p></div>`;
    });
}

let homeHighlightTimer = null;

function initHomeSideReveal() {
    const items = document.querySelectorAll(".home-side-reveal:not(.is-in)");
    if (!items.length) return;
    const reveal = (el) => requestAnimationFrame(() => el.classList.add("is-in"));
    if (!("IntersectionObserver" in window)) { items.forEach(reveal); return; }
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { reveal(entry.target); obs.unobserve(entry.target); }
        });
    }, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });
    items.forEach(el => observer.observe(el));
}

function startFreshFindAnimations() {
    if (typeof WOW === "function") {
        if (!window.__freshFindWow) {
            window.__freshFindWow = new WOW({
                boxClass: "wow",
                animateClass: "animate__animated",
                offset: 70,
                mobile: true,
                live: false
            });
            window.__freshFindWow.init();
        } else if (typeof window.__freshFindWow.sync === "function") {
            window.__freshFindWow.sync();
        }
    }
    initHomeSideReveal();
}
window.initFreshFindAnimations = startFreshFindAnimations;

function renderHomeHighlights() {
    const stage = document.getElementById("homeHighlightStage");
    const dots = document.getElementById("highlightDots");
    if (!stage) return;

    const slides = marketsCache.slice(0, 6).map(m => ({
        id: m.id,
        name: m.name,
        image: m.image
    }));
    if (!slides.length) return;
    let index = 0;

    function draw() {
        const item = slides[index % slides.length];
        stage.innerHTML = `
            <button type="button" class="highlight-card highlight-image-only wow animate__animated animate__fadeIn" data-highlight-market="${Number(item.id)}" aria-label="Open ${escapeHtml(item.name)}">
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy">
                <span class="highlight-image-name">${escapeHtml(item.name)}</span>
            </button>`;
        if (dots) {
            dots.innerHTML = slides.map((_, i) => `<button type="button" class="${i === index ? "active" : ""}" data-highlight-index="${i}" aria-label="Show highlight ${i + 1}"></button>`).join("");
            dots.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => { index = Number(btn.dataset.highlightIndex); draw(); restart(); }));
        }
        stage.querySelector("[data-highlight-market]")?.addEventListener("click", function () {
            window.loadFreshFindPage("marketDetail", true, { marketId: Number(this.dataset.highlightMarket) });
        });
        startFreshFindAnimations();
    }
    function restart() {
        clearInterval(homeHighlightTimer);
        homeHighlightTimer = setInterval(() => { index = (index + 1) % slides.length; draw(); }, 5000);
    }
    draw();
    restart();
}

function renderHomeSearchResults(filters) {
    const box = document.getElementById("homeSearchResults");
    const grid = document.getElementById("homeSearchGrid");
    const subtitle = document.getElementById("homeResultsSubtitle");
    if (!box || !grid) return;

    const q = (filters.area || "").toLowerCase();
    const list = marketsCache.filter(function (market) {
        const haystack = [market.name, market.area, market.description, ...(market.produce || [])].join(" ").toLowerCase();
        return (!q || haystack.includes(q)) &&
            (!filters.day || market.days.includes(filters.day) || market.days.includes("Everyday")) &&
            (!filters.produce || market.produce.includes(filters.produce));
    });

    grid.innerHTML = list.map(function (market, index) {
        const tags = (market.produce || []).slice(0, 4).map(item => `<span class="produce-tag"><i class="fa-solid ${categoryIcon(item)}"></i>${escapeHtml(item)}</span>`).join("");
        return `<div class="col-md-6 col-lg-4 wow animate__animated animate__fadeInUp" style="animation-delay:${(index % 8) * .06}s">
            <article class="market-card h-100 home-result-card">
                <div class="market-image-wrap">
                    <img class="market-image" src="${escapeHtml(market.image)}" alt="${escapeHtml(market.name)}" loading="lazy">
                    <span class="market-tag"><i class="fa-solid ${categoryIcon(market.produce?.[0])}"></i>${escapeHtml(market.produce?.[0] || "Fresh Produce")}</span>
                    <button type="button" class="market-bookmark-btn ${isBookmarked("market", market.id) ? "saved" : ""}" data-home-bookmark="${Number(market.id)}" aria-label="Save ${escapeHtml(market.name)}"><i class="fa-${isBookmarked("market", market.id) ? "solid" : "regular"} fa-bookmark"></i></button>
                </div>
                <div class="market-card-body">
                    <h4>${escapeHtml(market.name)}</h4>
                    <p class="market-location"><i class="fa-solid fa-location-dot"></i>${escapeHtml(market.area)}</p>
                    <div class="market-meta"><i class="fa-regular fa-clock"></i><span>${escapeHtml(market.hours)}</span></div>
                    <div class="market-meta"><i class="fa-regular fa-calendar"></i><span>${escapeHtml((market.days || []).join(", "))}</span></div>
                    <div class="produce-tags">${tags}</div>
                    <div class="card-footer-actions">
                        <div class="open-status"><strong>${marketIsOpenToday(market) ? "Open Today" : "Closed Today"}</strong><small>${escapeHtml(market.hours)}</small></div>
                        <button type="button" class="details-btn home-view-market" data-id="${Number(market.id)}">View Details <i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                </div>
            </article>
        </div>`;
    }).join("");

    if (subtitle) subtitle.textContent = list.length ? `${list.length} market${list.length === 1 ? "" : "s"} match your search.` : "No markets match your search. Try another area, day or produce type.";
    box.hidden = false;
    startFreshFindAnimations();

    grid.querySelectorAll("[data-home-bookmark]").forEach(btn => btn.addEventListener("click", function () {
        toggleBookmark("market", this.dataset.homeBookmark);
        renderHomeSearchResults(filters);
    }));
    grid.querySelectorAll(".home-view-market").forEach(btn => btn.addEventListener("click", function () {
        window.loadFreshFindPage("marketDetail", true, { marketId: Number(this.dataset.id) });
    }));
    box.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initHomePage() {
    const page = document.getElementById("home");
    if (!page) return;
    clearInterval(homeHighlightTimer);
    const produceSelect = document.getElementById("homeProduce");

    loadMarkets().then(markets => {
        if (produceSelect) {
            const produce = [...new Set(markets.flatMap(m => m.produce || []))].sort();
            produceSelect.innerHTML = `<option value="">Any produce</option>` + produce.map(x => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("");
        }
        renderHomeHighlights();
        initHomeSideReveal();
    });

    document.getElementById("homeQuickFind")?.addEventListener("submit", function (e) {
        e.preventDefault();
        renderHomeSearchResults({
            area: document.getElementById("homeArea")?.value.trim() || "",
            day: document.getElementById("homeDay")?.value || "",
            produce: document.getElementById("homeProduce")?.value || ""
        });
    });
    document.getElementById("homeClearResults")?.addEventListener("click", function () {
        const box = document.getElementById("homeSearchResults");
        if (box) box.hidden = true;
        document.getElementById("homeQuickFind")?.reset();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.getElementById("homeScrollTop")?.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    initHomeSideReveal();
}

function globalChatReply(query) {
    const q = query.toLowerCase();
    if (!marketsCache.length) return "I am loading the local market list. Please try again in a moment.";
    if (q.includes("open") || q.includes("today")) {
        const open = marketsCache.filter(m => marketIsOpenNow(m));
        return open.length ? `Markets open right now include ${open.slice(0, 3).map(m => m.name).join(", ")}.` : "I could not find a market that is open right now. You can use Market Directory to check the next open day.";
    }
    if (q.includes("vegetable") || q.includes("fruit") || q.includes("season")) {
        const picks = [];
        marketsCache.forEach(m => Object.values(m.products || {}).forEach(g => (g.seasonal || []).forEach(x => { if (!picks.includes(x.name)) picks.push(x.name); })));
        return `This week's seasonal picks include ${picks.slice(0, 6).join(", ") || "fresh local produce"}. Open Produce Guide for the full catalog.`;
    }
    if (q.includes("find") || q.includes("market") || q.includes("near")) return "Use Find a Market on the Home page or open Market Directory to filter by area, day and produce type.";
    if (q.includes("produce")) return "Produce Guide lets you browse vegetables, fruits, herbs, dairy and pantry items and save your favorites.";
    return "I can help you find markets, check opening times, or explore seasonal produce. Try: 'Which markets are open today?'";
}

function initGlobalChatbot() {
    if (window.__freshFindChatBound) return;
    window.__freshFindChatBound = true;
    const launcher = document.getElementById("globalChatLauncher");
    const win = document.getElementById("globalChatWindow");
    const close = document.getElementById("globalChatClose");
    const form = document.getElementById("globalChatForm");
    const input = document.getElementById("globalChatInput");
    const stream = document.getElementById("globalChatStream");
    function open() { if (win) win.hidden = false; launcher?.classList.add("is-open"); setTimeout(() => input?.focus(), 50); }
    function addMessage(text, type) { const el = document.createElement("div"); el.className = `global-chat-message ${type}`; el.textContent = text; stream?.appendChild(el); if (stream) stream.scrollTop = stream.scrollHeight; }
    launcher?.addEventListener("click", () => win?.hidden ? open() : (win.hidden = true));
    close?.addEventListener("click", () => { if (win) win.hidden = true; });
    document.querySelectorAll("[data-chat-query]").forEach(btn => btn.addEventListener("click", () => { open(); const q = btn.dataset.chatQuery; addMessage(q, "user"); setTimeout(() => addMessage(globalChatReply(q), "bot"), 250); }));
    form?.addEventListener("submit", e => { e.preventDefault(); const q = input?.value.trim(); if (!q) return; addMessage(q, "user"); input.value = ""; setTimeout(() => addMessage(globalChatReply(q), "bot"), 250); });
    loadMarkets().catch(() => {});
}

window.initFreshFindPage = function (state = {}) {
    bindHeader();
    initGlobalChatbot();
    if (typeof window.initFreshFindAnimations === "function") {
        window.initFreshFindAnimations(document);
    }

    if (document.getElementById("home")) {
        initHomePage();
        document.querySelectorAll("#content .breadcrumb, #content .home-breadcrumb").forEach(el => el.remove());
        setActiveNav("home");
        return;
    }

    if (document.getElementById("marketContainer")) {
        initMarketDirectory(state);
        renderBreadcrumbs("markets");
        return;
    }

    if (document.getElementById("marketDetailPage")) {
        initMarketDetails(state);
        renderBreadcrumbs("marketDetail");
        return;
    }

    if (document.getElementById("produceCatalogGrid")) {
        initProduceGuide();
        renderBreadcrumbs("produce");
        return;
    }

    if (document.getElementById("bookmarkGrid")) {
        initBookmarks();
        renderBreadcrumbs("bookmarks");
        return;
    }

    if (document.getElementById("about")) {
        window.initAboutPage?.();
        renderBreadcrumbs("about");
        return;
    }

    if (document.getElementById("contact")) {
        window.initContactPage?.();
        renderBreadcrumbs("contact");
        return;
    }

    if (document.getElementById("sitemap")) {
        renderBreadcrumbs("sitemap");
        return;
    }

    const pageId = document.querySelector("[id]")?.id;
    if (pageId) renderBreadcrumbs(pageId);
};

bindHeader();
