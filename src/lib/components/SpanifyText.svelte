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
        filter: blur(0);
    }
 -->

<script lang="ts">
	let { text = $bindable("") }: { text: string } = $props();
</script>

{#each text.split("") as char, i}
	<span style="transition-delay: {i * 25}ms">{char}</span>
{/each}

<style>
	span {
		font: inherit;
	}
</style>
