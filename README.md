# Agent Studio Documentation

This repository serves as documentation for Agent Studio.

## Development

### Prerequisites

To work with this repository, we recommend using
- [`just`](https://just.systems/man/en/introduction.html): our command runner
- [`mise`](https://mise.jdx.dev/installing-mise.html) (optional): to manage `pnpm`/`node` versions
- [`lychee`](https://lychee.cli.rs/) (optional): used by `just link-check` to check for broken links

Once you have at least `just` and `pnpm`, you can run the following.

```bash
# Install dependencies
just install

# Start dev server
just watch
```

## Built With

- [Astro](https://astro.build/)
- [Starlight](https://starlight.astro.build/)

## Diagrams

Architecture and flow diagrams are written in [D2](https://d2lang.com/) directly inside MDX pages, rendered at build time by [astro-d2](https://astro-d2.vercel.app/).

To keep diagrams visually consistent, use the shared style kit:

- `src/assets/d2/style.d2` — shared classes (`zone`, `card`, `hero`, `bluecard`, `purplecard`, `person`, `flow`, `okflow`, `riskflow`)
- `src/assets/diagram-icons/` — vendored SVG icons (brand logos plus generic stroke icons)

Import both with paths relative to the MDX file, the same way images work:

````mdx
```d2 title="My diagram"
...@../../../assets/d2/style

api: REST API {class: card; icon: ../../../assets/diagram-icons/api.svg}
studio: Agent Studio {class: hero}
api -> studio: request {class: flow; style.animated: true}
```
````

Conventions:

- `zone` for grouping containers, `card` for components, `hero` for the component the diagram is about
- `flow` for neutral edges, `okflow` for success paths, `riskflow` for paths that need security attention
- Icons are vendored locally so builds never depend on an icon CDN; add new ones to `src/assets/diagram-icons/`
- The default layout engine is `elk`; for top-to-bottom sequence-like diagrams `dagre` often reads better — set it per diagram with ```` ```d2 layout="dagre" ````
