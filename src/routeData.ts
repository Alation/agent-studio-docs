// The docs have moved to documentation.alation.com. GitHub Pages can't send
// HTTP redirects, so every page redirects client-side to the same path on the
// new site (meta refresh + JS, which keeps the #hash) and points its canonical
// URL there so search engines transfer ranking. The banner covers the moment
// before the redirect fires, and anyone with redirects blocked.
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

const NEW_DOCS_BASE = 'https://documentation.alation.com/en/latest/agentstudio/';

// Old paths with no same-named page on the new site. The new site keeps all
// release notes on one page, so each old per-release page maps there.
const PATH_OVERRIDES: Record<string, string> = {
	'': 'get-started/what-is-agent-studio',
};
const RELEASES_PAGE = 'releases/overview';

const newPathFor = (slug: string) =>
	PATH_OVERRIDES[slug] ?? (slug.startsWith('releases/') ? RELEASES_PAGE : slug);
const newUrlFor = (slug: string) => NEW_DOCS_BASE + newPathFor(slug);

export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
	const is404 = route.id === '404';
	const target = newUrlFor(is404 ? '' : route.id);

	route.head = route.head.filter((tag) => !(tag.tag === 'link' && tag.attrs?.rel === 'canonical'));
	route.head.push(
		{ tag: 'link', attrs: { rel: 'canonical', href: target } },
		{
			tag: 'script',
			// The 404 page is served for any unknown path, so it works out the
			// target from the address bar instead of its own (fixed) route.
			content: `(() => {
				const base = ${JSON.stringify(NEW_DOCS_BASE)};
				const overrides = ${JSON.stringify(PATH_OVERRIDES)};
				const releasesPage = ${JSON.stringify(RELEASES_PAGE)};
				let target = ${JSON.stringify(target)};
				if (${is404}) {
					const slug = location.pathname.replace(${JSON.stringify(import.meta.env.BASE_URL)}, '').replace(/^\\/+|\\/+$/g, '');
					target = base + (overrides[slug] ?? (slug.startsWith('releases/') ? releasesPage : slug));
				}
				location.replace(target + location.hash);
			})();`,
		},
	);
	// Fallback for visitors without JS. Skipped on the 404 page, where it would
	// race the script and always win with the fixed target.
	if (!is404) {
		route.head.push({ tag: 'meta', attrs: { 'http-equiv': 'refresh', content: `0; url=${target}` } });
	}

	route.entry.data.banner = {
		content: `These docs have moved to <a href="${target}">documentation.alation.com</a>. Redirecting…`,
	};
});
