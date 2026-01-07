// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightImageZoom from "starlight-image-zoom";
import starlightSidebarTopics from "starlight-sidebar-topics"

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
            plugins: [
                starlightImageZoom(),
                starlightSidebarTopics([
                    {
                        label: "Start",
                        link: "/getting-started/introduction",
                        icon: "rocket",
                        items: [
                            "getting-started/introduction",
                            "getting-started/key-concepts",
                            "getting-started/tools",
                            "getting-started/agents",
                            "getting-started/flows",
                            "getting-started/quick-start-mcp"
                        ]
                    },  
                    {
                        label: "Guides and recipes",
                        link: "/guides/authentication/introduction",
                        icon: "open-book",
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
                                    directory: "guides/mcp-client-setup",
                                },
                            },
                            {
                                label: "Rest API",
                                items: [
                                    "guides/rest-api/auth",
                                    "guides/rest-api/n8n",
                                    // TEMP(@vishal): make a hyphen for consistency after Snowflake reviews the link we sent.
                                    "guides/rest_api/snowflake",
                                ],
                            },
                        ],
                    },  
                    {
                        label: "Agent Studio SDK",
                        link: "/sdk/using-the-sdk",
                        icon: "puzzle",
                        items: [
                            "sdk/using-the-sdk"
                        ]
                    },
                    {
                        label: "Reference",
                        link: "/reference/agents/introduction",
                        icon: "information",
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
                                autogenerate: { directory: "reference/agents" },
                            },
                            {
                                label: "Tools",
                                autogenerate: { directory: "reference/tools" },
                            },
                            {
                                label: "Evaluation",
                                autogenerate: { directory: "reference/evaluation" },
                            },
                        ],
                    },
                ]),
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
