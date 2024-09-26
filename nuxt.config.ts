// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	pages: true,
	css: ["~/assets/css/global.css"],
	modules: ["@nuxt/ui", "nuxt-umami"],
	umami: {
		// enabled: false,
		host: "https://cloud.umami.is/script.js",
		id: "f798d17d-8a6c-4724-b044-fcc3b0cc6b6b",
		useDirective: true,
		logErrors: true,
		proxy: "cloak",
	},

	colorMode: {
		preference: "system",
	},

	ui: {
		icons: ["material-symbols"],
	},

	compatibilityDate: "2024-09-26",
});
