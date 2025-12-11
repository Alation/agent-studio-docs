// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightImageZoom from "starlight-image-zoom";

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: "Alation Agent Studio Documentation",
            expressiveCode: {
                themes: ["catppuccin-mocha", "catppuccin-latte"],
                styleOverrides: { borderRadius: "0.5rem" },
            },
            customCss: [
                "./src/styles/custom.css",
                "@fontsource-variable/jetbrains-mono",
            ],
            social: [
                {
                    icon: "github",
                    label: "GitHub",
                    href: "https://github.com/Alation/agent-studio-docs",
                },
            ],
            editLink: {
                baseUrl:
                    "https://github.com/Alation/agent-studio-docs/edit/main/",
            },
            favicon: "favicon.svg",
            plugins: [starlightImageZoom()],
            sidebar: [
                {
                    label: "Start Here",
                    autogenerate: { directory: "getting-started" },
                },
                {
                    label: "Guides",
                    autogenerate: { directory: "guides" },
                },
                {
                    label: "Reference",
                    autogenerate: { directory: "reference" },
                },
            ],
            lastUpdated: true,
            credits: true,
        }),
    ],
});
