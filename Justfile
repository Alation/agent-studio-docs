# just manual: https://github.com/casey/just

_list:
    @just --list

# Check for typos
typos:
    typos

# Update all dependencies
upgrade:
    pnpm dlx @astrojs/upgrade
    pnpm up --recursive
    pnpm install

# Install all dependencies
install *FLAGS:
    pnpm install {{FLAGS}}

# Serve the site locally for development
watch *FLAGS:
    pnpm run dev {{FLAGS}}

# Preview a production build of the site
preview:
    pnpm build
    pnpm preview

# Link check with lychee
link-check *FLAGS:
    pnpm build
    -lychee --root-dir={{ justfile_directory() }}/dist --insecure --accept '100..=103,200..=299,403,418,429' --cache --cache-exclude-status='401' --max-cache-age 7d -E {{FLAGS}} 'dist/**/*.html'
