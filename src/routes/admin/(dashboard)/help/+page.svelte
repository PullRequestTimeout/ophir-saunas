<script lang="ts">
	import { replaceState } from "$app/navigation";
	import { page } from "$app/state";
	import { sections, type Article, type Block } from "./docs";

	let query = $state(page.url.searchParams.get("q") ?? "");

	const phrase = $derived(query.trim().toLowerCase().replace(/\s+/g, " "));
	const words = $derived(phrase.split(" ").filter(Boolean));

	const blockText = (block: Block) => (block.type === "list" ? block.items.join(" ") : block.text);
	// Searchable text per article, built once. The section title counts too, so "pricing" finds every pricing article
	const haystacks = new Map<Article, { section: string; title: string; body: string }>(
		sections.flatMap((section) =>
			section.articles.map(
				(article) =>
					[
						article,
						{ section: section.title.toLowerCase(), title: article.title.toLowerCase(), body: article.blocks.map(blockText).join(" ").toLowerCase() }
					] as const
			)
		)
	);

	const occurrences = (text: string, word: string) => text.split(word).length - 1;
	// Phrase matching ignores hyphens, so "same day" finds "Same-day turnaround"
	const unhyphen = (text: string) => text.replaceAll("-", " ");

	// An article matches when every word appears somewhere in it. Matches in its title rank far above mentions in the text,
	// so searching "time off" puts "Adding time off" ahead of articles that only mention time off
	function score(article: Article) {
		const { section, title, body } = haystacks.get(article)!;
		if (!words.every((w) => section.includes(w) || title.includes(w) || body.includes(w))) return 0;
		const p = unhyphen(phrase);
		let points = 1;
		if (unhyphen(title) === p) points += 150;
		if (unhyphen(title).includes(p)) points += 100;
		if (unhyphen(section).includes(p)) points += 40;
		if (unhyphen(body).includes(p)) points += 10;
		for (const w of words) {
			if (title.includes(w)) points += 20;
			if (section.includes(w)) points += 8;
			points += Math.min(occurrences(body, w), 10);
		}
		return points;
	}

	// While searching, results are one list ranked by score (ties keep the docs order), each labelled with its section
	const matches = $derived(
		words.length === 0
			? []
			: sections
					.flatMap((section) => section.articles.map((article) => ({ article, section, points: score(article) })))
					.filter((m) => m.points > 0)
					.sort((a, b) => b.points - a.points)
	);
	const searching = $derived(words.length > 0);

	// Longest words first so "drop-in" is highlighted whole rather than as "drop"
	const pattern = $derived(
		words.length === 0
			? null
			: new RegExp(
					`(${[...words]
						.sort((a, b) => b.length - a.length)
						.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
						.join("|")})`,
					"gi"
				)
	);

	// Keeps the search in ?q= so it survives a reload and can be shared, without adding history entries
	function syncUrl() {
		const url = new URL(page.url);
		const q = query.trim();
		if (q) url.searchParams.set("q", q);
		else url.searchParams.delete("q");
		replaceState(url, page.state);
	}

	function clear() {
		query = "";
		syncUrl();
	}
</script>

<svelte:head>
	<title>Help | Ophir Admin</title>
</svelte:head>

{#snippet highlight(text: string)}
	{#if pattern}
		<!-- With one capture group, split puts the matches at the odd indexes -->
		{#each text.split(pattern) as part, i}{#if i % 2 === 1}<mark>{part}</mark>{:else}{part}{/if}{/each}
	{:else}
		{text}
	{/if}
{/snippet}

{#snippet contents()}
	{#if searching}
		<ol class="ranked">
			{#each matches as { article } (article.id)}
				<li><a href="#{article.id}">{article.title}</a></li>
			{/each}
		</ol>
	{:else}
		<ul>
			{#each sections as section (section.id)}
				<li>
					<a href="#{section.id}">{section.title}</a>
					<ul>
						{#each section.articles as article (article.id)}
							<li><a href="#{article.id}">{article.title}</a></li>
						{/each}
					</ul>
				</li>
			{/each}
		</ul>
	{/if}
{/snippet}

{#snippet articleBody(article: Article)}
	{#each article.blocks as block, i (i)}
		{#if block.type === "p"}
			<p>{@render highlight(block.text)}</p>
		{:else if block.type === "note"}
			<p class="note"><strong>Note:</strong> {@render highlight(block.text)}</p>
		{:else if block.ordered}
			<ol>
				{#each block.items as item, j (j)}<li>{@render highlight(item)}</li>{/each}
			</ol>
		{:else}
			<ul>
				{#each block.items as item, j (j)}<li>{@render highlight(item)}</li>{/each}
			</ul>
		{/if}
	{/each}
	{#if article.link}
		<a class="text-link" href={article.link.href}>{article.link.label}</a>
	{/if}
{/snippet}

<h1>Help</h1>
<p class="intro">How the dashboard works, the booking rules behind it, and what customers see when they book.</p>

<search class="search">
	<label for="help-search">Search the help</label>
	<div class="search-row">
		<input id="help-search" type="search" placeholder="e.g. reminder, time off, cancel" autocomplete="off" bind:value={query} oninput={syncUrl} />
		{#if query}
			<button class="btn" type="button" onclick={clear}>Clear search</button>
		{/if}
	</div>
	<p class="hint" aria-live="polite">
		{#if searching}
			{#if matches.length === 0}
				No articles match “{query.trim()}”. Try fewer or different words.
			{:else}
				{matches.length}
				{matches.length === 1 ? "article matches" : "articles match"} “{query.trim()}”, best match first.
			{/if}
		{/if}
	</p>
</search>

<div class="layout-help">
	{#if !searching || matches.length > 0}
		<details class="contents-mobile">
			<summary>Contents</summary>
			<nav aria-label="Help contents">{@render contents()}</nav>
		</details>
		<aside class="contents-desktop">
			<nav aria-label="Help contents">
				<h2>Contents</h2>
				{@render contents()}
			</nav>
		</aside>
	{/if}

	<div class="articles">
		{#if searching}
			{#each matches as { article, section } (article.id)}
				<article class="card result" id={article.id} aria-labelledby="{article.id}-heading">
					<p class="section-label"><span class="material-icons" aria-hidden="true">{section.icon}</span>{section.title}</p>
					<h2 id="{article.id}-heading">{@render highlight(article.title)}</h2>
					{@render articleBody(article)}
				</article>
			{/each}
		{:else}
			{#each sections as section (section.id)}
				<section class="card" id={section.id} aria-labelledby="{section.id}-heading">
					<h2 id="{section.id}-heading"><span class="material-icons" aria-hidden="true">{section.icon}</span>{section.title}</h2>
					{#each section.articles as article (article.id)}
						<article id={article.id}>
							<h3>{article.title}</h3>
							{@render articleBody(article)}
						</article>
					{/each}
				</section>
			{/each}
		{/if}
	</div>
</div>

<style>
	p.intro {
		max-width: 48rem;
		margin-top: calc(var(--spacing-m) * -1);
	}

	search {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		max-width: 48rem;
	}

	search label {
		width: fit-content;
	}

	div.search-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-s);
	}

	div.search-row input {
		flex: 1 1 16rem;
	}

	div.search-row :global(.btn) {
		align-self: center;
	}

	/* Keeps the live region's height so the page doesn't jump while typing */
	search p.hint {
		min-height: 1.5em;
	}

	div.layout-help {
		display: grid;
		gap: var(--spacing-l);
		align-items: start;
	}

	div.articles {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-l);
		min-width: 0;
		max-width: 52rem;
	}

	section h2 {
		display: flex;
		align-items: center;
		gap: var(--spacing-s);
	}

	section h2 span.material-icons {
		font-size: 28px;
	}

	article {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
		scroll-margin-top: var(--spacing-m);
	}

	section article {
		padding-top: var(--spacing-m);
		border-top: 1px solid var(--color-primary-transparent);
	}

	/* Search results are cards of their own, labelled with the section they come from */
	p.section-label {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		margin-bottom: calc(var(--spacing-s) * -1);
		font-size: 14px;
		font-weight: 600;
		color: var(--color-secondary);
	}

	p.section-label span.material-icons {
		font-size: 18px;
		color: inherit;
	}

	nav ol.ranked {
		padding-left: 1.5rem;
		list-style: decimal;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	nav ol.ranked a {
		font-size: 14px;
	}

	article h3 {
		font-size: var(--font-body-l);
		color: var(--color-primary);
	}

	article :is(ul, ol) {
		padding-left: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	article ul {
		list-style: disc;
	}

	article ol {
		list-style: decimal;
	}

	p.note {
		padding: var(--spacing-s) var(--spacing-m);
		border-left: 4px solid var(--color-secondary);
		border-radius: 4px;
		background-color: var(--color-background-white);
	}

	p.note strong {
		color: var(--color-primary);
	}

	mark {
		background-color: var(--color-background-tan);
		color: inherit;
		border-radius: 2px;
	}

	nav ul {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	nav > ul > li > a {
		font-weight: 600;
	}

	nav ul ul {
		padding: var(--spacing-xs) 0 var(--spacing-s) var(--spacing-m);
	}

	nav a {
		color: var(--color-primary);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	nav ul ul a {
		font-size: 14px;
	}

	details.contents-mobile {
		background-color: var(--color-white);
		border-radius: var(--border-radius);
		padding: var(--spacing-s) var(--spacing-m);
		box-shadow: var(--shadow);
	}

	aside.contents-desktop {
		display: none;
	}

	@media screen and (min-width: 1280px) {
		div.layout-help {
			grid-template-columns: 16rem minmax(0, 1fr);
		}

		details.contents-mobile {
			display: none;
		}

		aside.contents-desktop {
			display: block;
			position: sticky;
			top: var(--spacing-l);
			max-height: calc(100dvh - var(--spacing-l) * 2);
			overflow-y: auto;
			/* Room for the last link's underline, which otherwise overflows by a pixel and shows a scrollbar */
			padding-bottom: var(--spacing-xs);
		}

		aside h2 {
			margin-bottom: var(--spacing-s);
		}
	}
</style>
