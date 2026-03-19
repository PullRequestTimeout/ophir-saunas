<!-- Takes in a title and page description as props, and should be configured in each +page.svelte in each route. Make sure OG image is placed in assets/images folder. -->

<script lang="ts">
	import { page } from "$app/state";

	let {
		title = "Ophir Mobile Saunas",
		description = "Ophir Mobile Saunas is a mobile sauna service operated by Colwyn Sierra in Rossland, BC. Delivering a unique and relaxing sauna experience to clients in the West Kootenay region, including Rossland, Trail, Castlegar, and Christina Lake."
	}: { title?: string; description?: string } = $props();
	const image = "/assets/images/og-image.jpg";
	const url = page.url.toString();
</script>

<svelte:head>
	<!-- Basic SEO -->
	<title>{title}</title>
	<meta name="description" content={description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={image} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:url" content={url} />

	<!-- Other Metadata -->
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={url} />
</svelte:head>
