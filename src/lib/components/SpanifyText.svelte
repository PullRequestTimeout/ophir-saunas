<!-- This component adds a span around each character in the text prop for animation effects -->
<!-- Usage <h1><SpanifyText text="Hello" /></h1> in the page or component -->
<!-- CSS rules in global.css -->
<!-- 
    .heading-fade-in span {
        opacity: 0;
        filter: blur(2px);
        transition:
            opacity 0.5s ease,
            filter 0.5s ease;
    }

    .heading-fade-in.show span {
        opacity: 1;
        filter: none;
    }
 -->

<script lang="ts">
	let { text = $bindable("") }: { text: string } = $props();

	// Words keep their trailing space; start is the word's first character index in text, for the stagger delay
	const words = $derived.by(() => {
		let start = 0;
		return text.split(/(?<= )/).map((word) => {
			const entry = { text: word, start };
			start += word.length;
			return entry;
		});
	});

	// Once a word's last letter has nearly faded in, swap its spans for plain text. Ligatures split across spans render with hairline seams.
	// The fade is 500ms in global.css; by SWAP_AFTER_MS the letter is close enough to opaque that the swap isn't visible.
	const SWAP_AFTER_MS = 300;
	let revealed: boolean[] = $state([]);

	function revealLater(e: TransitionEvent, w: number) {
		if (e.propertyName === "opacity") setTimeout(() => (revealed[w] = true), SWAP_AFTER_MS);
	}
</script>

{#each words as word, w}
	{#if revealed[w]}
		{word.text}
	{:else}
		{#each word.text.split("") as char, i}
			<span style="transition-delay: {(word.start + i) * 25}ms" ontransitionstart={i === word.text.length - 1 ? (e) => revealLater(e, w) : undefined}
				>{char}</span
			>
		{/each}
	{/if}
{/each}

<style>
	span {
		font: inherit;
	}
</style>
