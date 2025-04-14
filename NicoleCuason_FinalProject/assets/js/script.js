import Destination from "./destination.js";
import DestinationText from "./destiText.js";
import DestinationBg from "./destiBg.js";
import Blog from "./blog.js";
import Testimonial from "./testimonial.js";

const navBar = document.querySelector(".header"),
    menuBtn = document.querySelector(".header__menu-icon"),
    closeMenuBtn = document.querySelector(".close-icon"),
    sections = document.querySelectorAll("section[id]"),
    destiSliderWrapper = document.querySelector(".destinations__slider-wrapper"),
    destinationsText = document.querySelector(".destinations__text"),
    destinationsBg = document.querySelector(".destinations__bg"),
    blogContent = document.querySelector(".blogs__content"),
    testiSliderWrapper = document.querySelector(".testimonials__wrapper"),
    scrollUpBtn = document.querySelector(".scroll-up");

// FIXED PATHS for JSON (relative to index.html)
const DESTINATIONS_API = "assets/apis/destinations.json";
const BLOG_API = "assets/apis/blogs.json";
const TESTIMONIALS_API = "assets/apis/testimonials.json";

const sr = ScrollReveal({ origin: "top", distance: "100px", duration: 2000, delay: 200 });

/* ============== Header ============== */
menuBtn?.addEventListener("click", () => document.body.classList.add("menu-toggled"));
closeMenuBtn?.addEventListener("click", () => document.body.classList.remove("menu-toggled"));

function changeHeaderBg() {
    const scrollY = window.scrollY;
    if (scrollY > 100) {
        navBar.style.backgroundColor = "var(--blue-60-opcty-70)";
        navBar.style.backdropFilter = "blur(20px)";
    } else {
        navBar.style.backgroundColor = "transparent";
        navBar.style.backdropFilter = "blur(0px)";
    }
}

/* ============== Home Section ============== */
const thumbnailsSwiper = new Swiper(".home__thumbnails", {
    slidesPerView: 3.5,
    spaceBetween: 20,
    loop: true,
    effect: "carousel",
    allowTouchMove: false,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    breakpoints: {
        0: { slidesPerView: 1.5 },
        800: { slidesPerView: 1.8 },
        940: { slidesPerView: 2.2 },
        1000: { slidesPerView: 2.4 },
        1100: { slidesPerView: 2.5 },
        1200: { slidesPerView: 2.8 },
        1300: { slidesPerView: 3.1 },
        1380: { slidesPerView: 3.5 },
    },
});

thumbnailsSwiper.on("slideChange", () => {
    const realIndex = thumbnailsSwiper.realIndex;
    const prevRealIndex = thumbnailsSwiper.previousRealIndex;
    const slides = document.querySelectorAll(".home__slide");
    if (slides[prevRealIndex]) slides[prevRealIndex].classList.remove("active");
    if (slides[realIndex]) slides[realIndex].classList.add("active");
});

/* ============== About Section ============== */
sr.reveal(".about__text", { origin: "left" });
sr.reveal(".about__image", { origin: "right" });

/* ============== Destinations Section ============== */
async function renderDestinations() {
    if (!destiSliderWrapper || !destinationsText || !destinationsBg) return;
    try {
        const res = await fetch(DESTINATIONS_API);
        const data = await res.json();

        data.forEach((desti) => {
            destiSliderWrapper.innerHTML += Destination(desti);
            destinationsText.innerHTML += DestinationText(desti);
            destinationsBg.innerHTML += DestinationBg(desti);
        });

        const destiSwiper = new Swiper(".destinations__slider", {
            effect: "cards",
            grabCursor: true,
            centeredSlides: true,
        });

        document.querySelectorAll(".destination-text")[0]?.classList.add("active");
        document.querySelectorAll(".destination-bg")[0]?.classList.add("active");

        destiSwiper.on("slideChange", () => {
            const realIndex = destiSwiper.realIndex;
            const prevRealIndex = destiSwiper.previousRealIndex;
            const textEls = document.querySelectorAll(".destination-text");
            const bgEls = document.querySelectorAll(".destination-bg");

            textEls[prevRealIndex]?.classList.remove("active");
            bgEls[prevRealIndex]?.classList.remove("active");
            textEls[realIndex]?.classList.add("active");
            bgEls[realIndex]?.classList.add("active");
        });

        sr.reveal(".destinations__slider");
        sr.reveal(".destinations__text");
    } catch (err) {
        console.error("Failed to load destinations:", err);
    }
}

/* ============== Blog Section ============== */
async function renderBlogs() {
    if (!blogContent) return;
    try {
        const res = await fetch(BLOG_API);
        const data = await res.json();

        data.forEach((blog) => {
            blogContent.innerHTML += Blog(blog);
        });

        sr.reveal(".blog", { interval: 100 });
    } catch (err) {
        console.error("Failed to load blog posts:", err);
    }
}

/* ============== Testimonials Section ============== */
async function renderTestmonials() {
    if (!testiSliderWrapper) return;
    try {
        const res = await fetch(TESTIMONIALS_API);
        const data = await res.json();

        data.forEach((testi) => {
            testiSliderWrapper.innerHTML += Testimonial(testi);
        });

        new Swiper(".testimonials__content", {
            slidesPerView: 1,
            effect: "fade",
            loop: true,
            grabCursor: true,
            autoplay: {
                delay: 7000,
                disableOnInteraction: false,
            },
        });

        sr.reveal(".testimonials__content");
    } catch (err) {
        console.error("Failed to load testimonials:", err);
    }
}

/* ============== Footer Section ============== */
sr.reveal(".footer__col", { interval: 100 });

/* ============== Active Scroll ============== */
function activeScroll() {
    const scrollY = window.scrollY;
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 16;
        const sectionHeight = section.offsetHeight;
        const link = document.querySelector(`.header__link a[href="#${section.id}"]`);
        if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight) {
            link?.classList.add("active");
        } else {
            link?.classList.remove("active");
        }
    });
}

/* ============== Scroll Up Button ============== */
function showScrollUpBtn() {
    if (window.scrollY > 300) {
        scrollUpBtn?.classList.add("show");
    } else {
        scrollUpBtn?.classList.remove("show");
    }
}

scrollUpBtn?.addEventListener("click", () =>
    window.scrollTo({ behavior: "smooth", top: 0, left: 0 })
);

/* ============== Page Load ============== */
window.addEventListener("scroll", () => {
    changeHeaderBg();
    showScrollUpBtn();
    activeScroll();
});

window.addEventListener("load", () => {
    renderDestinations();
    renderBlogs();
    renderTestmonials();
    activeScroll();
    document.querySelector(".home__thumbnails")?.classList.add("reveal");
});
