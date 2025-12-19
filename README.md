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
