(function () {
    function initContactPage() {
        const page = document.getElementById("contact");
        if (!page || page.dataset.contactInitialized === "1") return;
        page.dataset.contactInitialized = "1";

        const form = page.querySelector("#form");
        const formAlert = page.querySelector("#formAlert");
        if (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                const name = page.querySelector("#fullName")?.value.trim() || "";
                const email = page.querySelector("#email")?.value.trim() || "";
                const phone = page.querySelector("#phone")?.value.trim() || "";
                const subject = page.querySelector("#subject")?.value.trim() || "";
                const message = page.querySelector("#message")?.value.trim() || "";
                const nameOk = /^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/.test(name) && name.length >= 2;
                const emailOk = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(email);
                const phoneDigits = phone.replace(/[\s-]/g, "");
                const phoneOk = /^(?:\+92|0092|0)3\d{9}$/.test(phoneDigits);
                const subjectOk = /^[A-Za-z0-9][A-Za-z0-9 .,!?'-]{2,100}$/.test(subject);
                if (!name || !email || !phone || !subject || !message) {
                    alert("Please fill in all required fields before sending your message.");
                    return;
                }
                if (!nameOk) {
                    alert("Please enter a valid name using letters, spaces, dots, apostrophes or hyphens only.");
                    return;
                }
                if (!emailOk) {
                    alert("Please enter a valid email address.");
                    return;
                }
                if (!phoneOk) {
                    alert("Please enter a valid Pakistani phone number, e.g. 03001234567 or +923001234567.");
                    return;
                }
                if (!subjectOk) {
                    alert("Please enter a valid subject.");
                    return;
                }
                if (message.length < 10) {
                    alert("Message must contain at least 10 characters.");
                    return;
                }
                alert("Thank you! Your message has been received.");
                if (formAlert) formAlert.style.display = "none";
                form.reset();
            });
        }

        const cards = page.querySelectorAll(".info-card, .form-card");
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    entry.target.classList.toggle("visible", entry.isIntersecting);
                });
            }, { threshold: 0.18 });
            cards.forEach(function (card) { observer.observe(card); });
        } else {
            cards.forEach(function (card) { card.classList.add("visible"); });
        }

        const locationBlock = page.querySelector(".location");
        if (locationBlock && "IntersectionObserver" in window) {
            const locationObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    entry.target.classList.toggle("visible-location", entry.isIntersecting);
                });
            }, { threshold: 0.12 });
            locationObserver.observe(locationBlock);
        } else if (locationBlock) {
            locationBlock.classList.add("visible-location");
        }

        const mapFrame = page.querySelector("#mapFrame");
        const locateBtn = page.querySelector("#locateBtn");
        const statusBox = page.querySelector("#statusBox");
        function showStatus(message) {
            if (!statusBox) return;
            statusBox.textContent = message;
            statusBox.style.display = "block";
            clearTimeout(window.freshFindContactStatusTimer);
            window.freshFindContactStatusTimer = setTimeout(function () {
                statusBox.style.display = "none";
            }, 6000);
        }
        if (locateBtn) {
            locateBtn.addEventListener("click", function () {
                if (!navigator.geolocation) {
                    showStatus("Geolocation is not supported by your browser.");
                    return;
                }
                locateBtn.disabled = true;
                locateBtn.innerHTML = "<span>⌛</span><span>Detecting...</span>";
                showStatus("Please allow location access in your browser.");
                navigator.geolocation.getCurrentPosition(function (position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    if (mapFrame) mapFrame.src = "https://maps.google.com/maps?q=" + latitude + "," + longitude + "&z=15&output=embed";
                    showStatus("Your current location is now shown on the map.");
                    locateBtn.disabled = false;
                    locateBtn.innerHTML = "<span>✓</span><span>Location Found</span>";
                }, function (error) {
                    let message = "We could not access your location.";
                    if (error.code === 1) message = "Location permission was denied. Please allow access and try again.";
                    else if (error.code === 2) message = "Your location is currently unavailable.";
                    else if (error.code === 3) message = "The location request timed out. Please try again.";
                    showStatus(message);
                    locateBtn.disabled = false;
                    locateBtn.innerHTML = "<span>📍</span><span>Use My Location</span>";
                }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
            });
        }
    }
    window.initContactPage = initContactPage;
})();
