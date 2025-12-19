# just manual: https://github.com/casey/just

_list:
    @just --list

# Check for typos
[group('lint')]
typos:
    typos

# Update all dependencies
[group('build')]
upgrade:
    pnpm dlx @astrojs/upgrade
    pnpm up --recursive
    pnpm install

# Install all dependencies
[group('build')]
install *FLAGS:
    pnpm install {{FLAGS}}

# Serve the site locally for development
[group('dev')]
watch *FLAGS:
    pnpm run dev {{FLAGS}}

# Preview a production build of the site
[group('dev')]
preview:
    pnpm build
    pnpm preview

# Link check with lychee
[group('lint')]
link-check *FLAGS:
    pnpm build
    -lychee --remap '/dist/agent-studio-docs /dist' --root-dir={{ justfile_directory() }}/dist --insecure --accept '100..=103,200..=299,403,418,429' --cache --cache-exclude-status='401' --max-cache-age 7d -E {{FLAGS}} 'dist/**/*.html'
