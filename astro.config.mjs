// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightImageZoom from "starlight-image-zoom";
import starlightSidebarTopics from "starlight-sidebar-topics";

import d2 from "astro-d2";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    site: "https://alation.github.io",
    base: "/agent-studio-docs",
    // Old URLs from the pre-overhaul structure. Keep these working forever:
    // several have been shared externally (e.g. the Snowflake recipe).
    redirects: {
        "/agent-skills/overview": "/agent-studio-docs/integrations/plugins/overview/",
        "/agent-skills/security": "/agent-studio-docs/security/channels/plugins/",
        "/getting-started/agents": "/agent-studio-docs/build/agents/overview/",
        "/getting-started/flows": "/agent-studio-docs/build/flows/overview/",
        "/getting-started/introduction": "/agent-studio-docs/get-started/what-is-agent-studio/",
        "/getting-started/key-concepts": "/agent-studio-docs/get-started/key-concepts/",
        "/getting-started/quick-start-mcp": "/agent-studio-docs/integrations/mcp/quick-start/",
        "/getting-started/sql-evaluations": "/agent-studio-docs/build/evals/sql-evaluations/",
        "/getting-started/tools": "/agent-studio-docs/build/tools/overview/",
        "/guides/access-controls/roles-and-permissions": "/agent-studio-docs/security/identity-and-permissions/",
        "/guides/authentication/introduction": "/agent-studio-docs/security/identity-and-permissions/#how-you-authenticate-changes-what-you-see",
        "/guides/authentication/machine-to-machine": "/agent-studio-docs/security/authentication/machine-to-machine/",
        "/guides/authentication/user-initiated-auth": "/agent-studio-docs/security/authentication/user-initiated-auth/",
        "/guides/context-search/using-catalog-context-search": "/agent-studio-docs/get-started/recipes/catalog-context-search/",
        "/guides/custom-tools/creating-custom-tools": "/agent-studio-docs/build/tools/creating-custom-tools/",
        "/guides/external-mcp-servers/connecting-external-mcp": "/agent-studio-docs/integrations/mcp/external-servers/",
        "/guides/flows/scheduling": "/agent-studio-docs/build/schedules/scheduling-flows/",
        "/guides/flows/variables": "/agent-studio-docs/build/flows/variables/",
        "/guides/lineage/using-lineage-agent": "/agent-studio-docs/get-started/recipes/data-lineage-agents/",
        "/guides/mcp-client-setup/chatgpt": "/agent-studio-docs/integrations/mcp-clients/chatgpt/",
        "/guides/mcp-client-setup/claude": "/agent-studio-docs/integrations/mcp-clients/claude/",
        "/guides/mcp-client-setup/copilotstudio": "/agent-studio-docs/integrations/mcp-clients/copilotstudio/",
        "/guides/mcp-client-setup/cursor": "/agent-studio-docs/integrations/mcp-clients/cursor/",
        "/guides/mcp-client-setup/librechat": "/agent-studio-docs/integrations/mcp-clients/librechat/",
        "/guides/mcp-client-setup/n8n": "/agent-studio-docs/integrations/mcp-clients/n8n/",
        "/guides/mcp-client-setup/vscode": "/agent-studio-docs/integrations/mcp-clients/vscode/",
        "/guides/models/byom-setup": "/agent-studio-docs/build/models/byom-setup/",
        "/guides/models/llm-configuration": "/agent-studio-docs/build/models/llm-configuration/",
        "/guides/observability/logs": "/agent-studio-docs/security/observability/logs/",
        "/guides/observability/usage": "/agent-studio-docs/security/observability/usage/",
        "/guides/rest-api/auth": "/agent-studio-docs/integrations/rest-api/auth/",
        "/guides/rest-api/n8n": "/agent-studio-docs/get-started/recipes/n8n-workflow/",
        "/guides/rest_api/snowflake": "/agent-studio-docs/get-started/recipes/snowflake-agent/",
        "/guides/security/identity-and-permissions": "/agent-studio-docs/security/identity-and-permissions/",
        "/guides/security/introduction": "/agent-studio-docs/security/overview/",
        "/guides/security/request-lifecycle": "/agent-studio-docs/security/request-lifecycle/",
        "/guides/slack/security": "/agent-studio-docs/security/channels/slack/",
        "/guides/slack/setup": "/agent-studio-docs/integrations/slack/setup/",
        "/guides/slack/usage": "/agent-studio-docs/integrations/slack/usage/",
        "/reference/agents": "/agent-studio-docs/build/agents/default-agents/",
        "/reference/agents/analytics-agent": "/agent-studio-docs/build/agents/analytics-agent/",
        "/reference/agents/catalog-context-search": "/agent-studio-docs/build/agents/catalog-context-search/",
        "/reference/agents/data-product-question-manager": "/agent-studio-docs/build/agents/sql-eval-case-manager/",
        "/reference/agents/catalog-search": "/agent-studio-docs/build/agents/catalog-search/",
        "/reference/agents/chart-generation": "/agent-studio-docs/build/agents/chart-generation/",
        "/reference/agents/curation": "/agent-studio-docs/build/agents/curation/",
        "/reference/agents/curation-automation": "/agent-studio-docs/build/agents/curation-automation/",
        "/reference/agents/dashboard-search": "/agent-studio-docs/build/agents/dashboard-search/",
        "/reference/agents/data-marketplace-query": "/agent-studio-docs/build/agents/data-marketplace-query/",
        "/reference/agents/data-product-query": "/agent-studio-docs/build/agents/data-product-query/",
        "/reference/agents/deep-research": "/agent-studio-docs/build/agents/deep-research/",
        "/reference/agents/generate-pdf-from-a-chat": "/agent-studio-docs/build/agents/generate-pdf-from-a-chat/",
        "/reference/agents/introduction": "/agent-studio-docs/build/agents/default-agents/",
        "/reference/agents/lineage-agent": "/agent-studio-docs/get-started/recipes/data-lineage-agents/",
        "/reference/agents/native-data-quality-advisor": "/agent-studio-docs/build/agents/native-data-quality-advisor/",
        "/reference/agents/query": "/agent-studio-docs/build/agents/query/",
        "/reference/agents/revise-data-product": "/agent-studio-docs/build/agents/revise-data-product/",
        "/reference/agents/signature-generator": "/agent-studio-docs/build/agents/signature-generator/",
        "/reference/agents/sql-eval-case-manager": "/agent-studio-docs/build/agents/sql-eval-case-manager/",
        "/reference/evaluation/data-product-evaluations": "/agent-studio-docs/build/evals/data-product-evaluations/",
        "/reference/tools/bi-report-search-tool": "/agent-studio-docs/build/tools/bi-report-search-tool/",
        "/reference/tools/data-product-search": "/agent-studio-docs/build/tools/data-product-search/",
        "/reference/tools/generate-chart-tool": "/agent-studio-docs/build/tools/generate-chart-tool/",
        "/reference/tools/generate-lineage-documentation-tool": "/agent-studio-docs/build/tools/generate-lineage-documentation-tool/",
        "/reference/tools/generate-pdf-tool": "/agent-studio-docs/build/tools/generate-pdf-tool/",
        "/reference/tools/get-catalog-object-tool": "/agent-studio-docs/build/tools/get-catalog-object-tool/",
        "/reference/tools/get-data-product-spec-tool": "/agent-studio-docs/build/tools/get-data-product-spec-tool/",
        "/reference/tools/get-data-quality-tool": "/agent-studio-docs/build/tools/get-data-quality-tool/",
        "/reference/tools/get-data-schema-tool": "/agent-studio-docs/build/tools/get-data-schema-tool/",
        "/reference/tools/get-data-sources-tool": "/agent-studio-docs/build/tools/get-data-sources-tool/",
        "/reference/tools/get-dq-scores-tool": "/agent-studio-docs/build/tools/get-dq-scores-tool/",
        "/reference/tools/get-lineage-tool": "/agent-studio-docs/build/tools/get-lineage-tool/",
        "/reference/tools/get-search-filter-fields-tool": "/agent-studio-docs/build/tools/get-search-filter-fields-tool/",
        "/reference/tools/get-search-filter-values-tool": "/agent-studio-docs/build/tools/get-search-filter-values-tool/",
        "/reference/tools/introduction": "/agent-studio-docs/build/tools/configuring-tools/",
        "/reference/tools/list-of-default-tools": "/agent-studio-docs/build/tools/default-tools/",
        "/reference/tools/search-catalog-tool": "/agent-studio-docs/build/tools/search-catalog-tool/",
        "/reference/tools/sql-execution-tool": "/agent-studio-docs/build/tools/sql-execution-tool/",
        "/reference/zerodata/infrastructure": "/agent-studio-docs/architecture/zero-data/infrastructure/",
        "/reference/zerodata/overview": "/agent-studio-docs/architecture/zero-data/overview/",
        "/sdk/using-the-sdk": "/agent-studio-docs/integrations/sdk/using-the-sdk/",
    },
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
                PageTitle: "./src/components/PageTitle.astro",
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
                        label: "Get Started",
                        link: "/get-started/what-is-agent-studio",
                        icon: "open-book",
                        items: [
                            "get-started/what-is-agent-studio",
                            "get-started/key-concepts",
                            {
                                label: "Recipes",
                                items: [
                                    "get-started/recipes",
                                    "get-started/recipes/scheduled-alert-emails",
                                    "get-started/recipes/embedded-chat-rest-api",
                                    "get-started/recipes/catalog-context-search",
                                    "get-started/recipes/copilot-scoped-catalog-context",
                                    "get-started/recipes/bulk-trust-flags",
                                    "get-started/recipes/bi-report-rationalization",
                                    "get-started/recipes/data-lineage-agents",
                                    "get-started/recipes/n8n-workflow",
                                    "get-started/recipes/snowflake-agent",
                                    "get-started/recipes/known-limitations",
                                ],
                            },
                        ],
                    },
                    {
                        label: "Build",
                        link: "/build/overview",
                        icon: "setting",
                        items: [
                            "build/overview",
                            "build/best-practices",
                            {
                                label: "Tools",
                                items: [
                                    "build/tools/overview",
                                    "build/tools/configuring-tools",
                                    "build/tools/creating-custom-tools",
                                    {
                                        label: "Built-in tools",
                                        collapsed: true,
                                        items: [
                                            "build/tools/default-tools",
                                            "build/tools/bi-report-search-tool",
                                            "build/tools/data-product-search",
                                            "build/tools/generate-chart-tool",
                                            "build/tools/generate-lineage-documentation-tool",
                                            "build/tools/generate-pdf-tool",
                                            "build/tools/get-catalog-object-tool",
                                            "build/tools/get-data-product-spec-tool",
                                            "build/tools/get-data-quality-tool",
                                            "build/tools/get-data-schema-tool",
                                            "build/tools/get-data-sources-tool",
                                            "build/tools/get-dq-scores-tool",
                                            "build/tools/get-lineage-tool",
                                            "build/tools/get-search-filter-fields-tool",
                                            "build/tools/get-search-filter-values-tool",
                                            "build/tools/search-catalog-tool",
                                            "build/tools/sql-execution-tool",
                                        ],
                                    },
                                ],
                            },
                            {
                                label: "Agents",
                                items: [
                                    "build/agents/overview",
                                    "build/agents/publishing-agents",
                                    {
                                        label: "Built-in agents",
                                        collapsed: true,
                                        items: [
                                            "build/agents/default-agents",
                                            "build/agents/analytics-agent",
                                            "build/agents/catalog-context-search",
                                            "build/agents/catalog-search",
                                            "build/agents/chart-generation",
                                            "build/agents/curation",
                                            "build/agents/curation-automation",
                                            "build/agents/dashboard-search",
                                            "build/agents/data-marketplace-query",
                                            "build/agents/data-product-query",
                                            "build/agents/deep-research",
                                            "build/agents/generate-pdf-from-a-chat",
                                            "build/agents/lineage-agent",
                                            "build/agents/lineage-builder-agent",
                                            "build/agents/native-data-quality-advisor",
                                            "build/agents/query",
                                            "build/agents/revise-data-product",
                                            "build/agents/signature-generator",
                                            "build/agents/sql-eval-case-manager",
                                        ],
                                    },
                                ],
                            },
                            {
                                label: "Flows",
                                items: [
                                    "build/flows/overview",
                                    "build/flows/variables",
                                ],
                            },
                            {
                                label: "Schedules",
                                items: ["build/schedules/scheduling-flows"],
                            },
                            {
                                label: "Evals",
                                items: [
                                    "build/evals/sql-evaluations",
                                    "build/evals/data-product-evaluations",
                                ],
                            },
                            {
                                label: "Models",
                                items: [
                                    "build/models/llm-configuration",
                                    "build/models/byom-setup",
                                ],
                            },
                        ],
                    },
                    {
                        label: "Integrations",
                        link: "/integrations/overview",
                        icon: "puzzle",
                        items: [
                            "integrations/overview",
                            {
                                label: "Slack",
                                items: [
                                    "integrations/slack/setup",
                                    "integrations/slack/usage",
                                ],
                            },
                            {
                                label: "Plugins (Agent Skills)",
                                items: [
                                    "integrations/plugins/overview",
                                    "integrations/plugins/using-the-skills",
                                    {
                                        label: "Setup",
                                        items: [
                                            "integrations/plugins/setup/claude-code",
                                            "integrations/plugins/setup/claude-cowork",
                                            "integrations/plugins/setup/codex",
                                            "integrations/plugins/setup/gemini-cli",
                                            "integrations/plugins/setup/cortex-code",
                                        ],
                                    },
                                ],
                            },
                            {
                                label: "MCP",
                                items: [
                                    "integrations/mcp/quick-start",
                                    "integrations/mcp/using-the-mcp-server",
                                    "integrations/mcp/external-servers",
                                    {
                                        label: "Client setup",
                                        items: [
                                            "integrations/mcp-clients/chatgpt",
                                            "integrations/mcp-clients/claude",
                                            "integrations/mcp-clients/copilotstudio",
                                            "integrations/mcp-clients/cursor",
                                            "integrations/mcp-clients/librechat",
                                            "integrations/mcp-clients/n8n",
                                            "integrations/mcp-clients/snowflake",
                                            "integrations/mcp-clients/vscode",
                                        ],
                                    },
                                ],
                            },
                            {
                                label: "REST API",
                                items: [
                                    "integrations/rest-api/auth",
                                    {
                                        label: "API Reference",
                                        link: "https://developer.alation.com/dev/reference/alation-ai-api-overview",
                                    },
                                    {
                                        label: "API Role Requirements",
                                        link: "https://developer.alation.com/dev/docs/api-by-roles#ai-apis",
                                    },
                                ],
                            },
                            {
                                label: "SDK",
                                items: ["integrations/sdk/using-the-sdk"],
                            },
                        ],
                    },
                    {
                        label: "Security",
                        link: "/security/overview",
                        icon: "seti:lock",
                        items: [
                            "security/overview",
                            "security/request-lifecycle",
                            "security/identity-and-permissions",
                            "security/authorization-explorer",
                            {
                                label: "Creating OAuth clients",
                                items: [
                                    "security/authentication/user-initiated-auth",
                                    "security/authentication/machine-to-machine",
                                ],
                            },
                            {
                                label: "Channel security",
                                items: [
                                    "security/channels/slack",
                                    "security/channels/plugins",
                                ],
                            },
                            "security/data-handling",
                            {
                                label: "Audit and monitoring",
                                items: [
                                    "security/observability/logs",
                                    "security/observability/usage",
                                ],
                            },
                        ],
                    },
                    {
                        label: "Architecture",
                        link: "/architecture/overview",
                        icon: "information",
                        items: [
                            "architecture/overview",
                            {
                                label: "Zero Data",
                                items: [
                                    "architecture/zero-data/overview",
                                    "architecture/zero-data/infrastructure",
                                ],
                            },
                        ],
                    },
                    {
                        label: "Release Notes",
                        link: "/releases/overview",
                        icon: "document",
                        items: [
                            {
                                label: "Release Notes",
                                autogenerate: { directory: "releases" },
                            },
                        ],
                    },
                ]),
            ],
            lastUpdated: true,
            credits: true,
        }),
        react(),
        d2({
            pad: 10,
            layout: "elk",
            theme: {
                default: "0", // Neutral Default (light)
                dark: "200", // Dark Mauve (dark)
            },
        }),
    ],
    vite: {
        plugins: [tailwindcss()],
    },
});
