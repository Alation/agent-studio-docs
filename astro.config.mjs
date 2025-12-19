// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightImageZoom from "starlight-image-zoom";

import d2 from "astro-d2";

// https://astro.build/config
export default defineConfig({
    site: "https://alation.github.io",
    base: "/agent-studio-docs",
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
            components: {
                Header: "./src/components/Header.astro",
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
                    items: [
                        "getting-started/introduction",
                        "getting-started/key_concepts",
                        "getting-started/tools",
                        "getting-started/agents",
                        "getting-started/flows",
                        "getting-started/quick_start_mcp"
                    ]
                },
                {
                    label: "Guides",
                    items: [
                        {
                            label: "Authentication",
                            autogenerate: {
                                directory: "guides/authentication",
                            },
                        },
                        {
                            label: "MCP Client Setup",
                            autogenerate: {
                                directory: "guides/mcp_client_setup",
                            },
                        },
                        {
                            label: "Rest API",
                            autogenerate: {
                                directory: "guides/rest_api",
                            },
                        },
                    ],
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
                            link: "https://developer.alation.com/dev/reference/alation-ai-api-overview",
                        },
                        {
                            label: "API Role Requirements",
                            link: "https://developer.alation.com/dev/docs/api-by-roles#ai-apis",
                        },
                        {
                            label: "Agents",
                            items: [
                                {
                                    slug: "reference/agents/introduction",
                                },

                                {
                                    slug: "reference/agents",
                                },
                                {
                                    label: "Default Agent Details",
                                    autogenerate: {
                                        directory: "reference/agents/default",
                                    },
                                },
                            ],
                        },
                        { slug: "reference/tools" },
                        {
                            label: "Data Products",
                            autogenerate: {
                                directory: "reference/data_products",
                            },
                        },
                        {
                            label: "Evaluation",
                            autogenerate: { directory: "reference/evaluation" },
                        },
                    ],
                },
            ],
            lastUpdated: true,
            credits: true,
        }),
        d2({
            pad: 10,
            layout: "elk",
        }),
    ],
});
