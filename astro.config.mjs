// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightImageZoom from "starlight-image-zoom";

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: "Alation Agent Studio Documentation",
            logo: {
                light: "./src/assets/logo-light.svg",
                dark: "./src/assets/logo-dark.svg",
                replacesTitle: true,
            },
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
                    label: "Agent Studio SDK",
                    autogenerate: { directory: "sdk" },
                },
                {
                    label: "Reference",
                    items: [
                        {
                            label: "API Reference",
                            link: "https://developer.alation.com/dev/reference/alation-ai-api-overview"
                        },
                        {
                            label: "API Role Requirements",
                            link: "https://developer.alation.com/dev/docs/api-by-roles#ai-apis"
                        },
                        {
                            label: "Authentication",
                            link: "reference/auth"
                        },
                        {
                          label: "Agents",
                          autogenerate: { directory: "reference/agents" },
                        },
                        {
                          label: "Tools",
                          autogenerate: { directory: "reference/tools" },
                        },
                        {
                          label: "Data Products",
                          autogenerate: { directory: "reference/data_products" },
                        },
                  ],
                },
            ],
            lastUpdated: true,
            credits: true,
        }),
    ],
});
