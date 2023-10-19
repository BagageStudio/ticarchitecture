const netlifyEnv = process.env.NETLIFY_ENV || "development";
const isPreview = process.env.PREVIEW === "true";
const URL =
    process.env.NETLIFY_ENV === "production"
        ? process.env.URL
        : process.env.DEPLOY_PRIME_URL;
const isDevEnv = netlifyEnv === "development";

export default defineNuxtConfig({
    devtools: { enabled: true },
    runtimeConfig: {
        public: {
            baseUrl: URL || "http://localhost:8888",
            preview: isPreview,
        },
    },
    app: {
        head: {
            meta: [
                {
                    charset: "utf-8",
                },
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1.0",
                },
            ],
            link: [
                {
                    rel: "icon",
                    href: "/favicon.ico",
                    sizes: "any",
                },
                {
                    rel: "icon",
                    href: "/icon.svg",
                    type: "image/svg+xml",
                },
                {
                    rel: "apple-touch-icon",
                    href: "/apple-touch-icon.png",
                },
                {
                    rel: "manifest",
                    href: "/manifest.webmanifest",
                },

                { rel: "preconnect", href: "https://fonts.googleapis.com" },
                {
                    rel: "preconnect",
                    href: "https://fonts.gstatic.com",
                    crossorigin: "",
                },
                {
                    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap",
                    rel: "stylesheet",
                },
            ],
        },
    },
    nitro: {
        prerender: {
            crawlLinks: true,
            failOnError: false,
        },
    },
    modules: ["@storyblok/nuxt", "@nuxt/image"],
    storyblok: {
        accessToken: process.env.SB_TOKEN,
    },
    image: {
        storyblok: {
            baseURL: "https://a.storyblok.com",
        },
    },
    css: ["@/assets/scss/main.scss"],
    build: {
        transpile: ["gsap"],
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData:
                        '@use "sass:math";@import "@/assets/scss/base/_variables.scss";',
                },
            },
        },
    },
});
