<script lang="ts">
	import { slide } from "svelte/transition";
	import { isIntersecting } from "$lib/utils/isIntersecting";
	import SpanifyText from "$lib/components/SpanifyText.svelte";

	let openFaqIndex: number | null = $state(null);

	function toggleFaq(i: number) {
		openFaqIndex = openFaqIndex === i ? null : i;
	}

	let { faqs = $bindable([]) } = $props();
</script>

<section>
	<h2 class="long-heading heading-fade-in" use:isIntersecting>
		<SpanifyText text="Frequently Asked Questions" />
	</h2>
	<div class="faq-group group-stagger-fade" use:isIntersecting>
		<hr />
		{#each faqs as faq, i}
			<div class="faq-item">
				<button onclick={() => toggleFaq(i)} aria-label="Toggle answer for {faq.question}">
					<p class="faq-question">{faq.question}</p>
					<span class="material-icons faq-icon" class:open={openFaqIndex === i}>keyboard_arrow_down</span>
				</button>
				{#if openFaqIndex === i}
					<div transition:slide={{ axis: "y" }} class="faq-answer">
						{#each faq.answer as answer}
							{#if answer.element === "p"}
								<p>{answer.content}</p>
							{:else if answer.element === "ul"}
								<ul>
									{#if Array.isArray(answer.content)}
										{#each answer.content as item}
											<li>{item}</li>
										{/each}
									{/if}
								</ul>
							{:else if answer.element === "a"}
								{#if typeof answer.content === "object" && answer.content !== null && "href" in answer.content && "text" in answer.content}
									<a href={answer.content.href}>{answer.content.text}</a>
								{/if}
							{/if}
						{/each}
					</div>
				{/if}
			</div>
			<hr />
		{/each}
	</div>
</section>

<style>
	section {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-l);
	}

	div.faq-group {
		width: 100%;
	}

	div.faq-item {
		width: 100%;
	}

	div.faq-item button {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: none;
		border: none;
		padding: 0.75rem 0;
		gap: var(--spacing-xs);
	}

	div.faq-item button p {
		text-align: left;
		font-size: var(--font-body-l);
		font-weight: 400;
		color: var(--color-primary);
	}

	div.faq-item button * {
		margin: 0;
	}

	div.faq-item div.faq-answer * {
		margin: 0;
		font-size: var(--font-body-l);
		color: var(--color-primary);
		font-weight: 300;
		line-height: 1.4;
	}

	div.faq-item div.faq-answer {
		margin-bottom: var(--spacing-m);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-s);
	}

	div.faq-item div.faq-answer a {
		color: var(--color-primary-light);
		text-decoration: underline;
		font-weight: 400;
	}

	hr {
		width: 100%;
		border: none;
		border-top: 2px solid var(--color-black);
	}

	span.faq-icon {
		color: var(--color-primary);
		font-size: 24px;
		transition: transform 0.3s ease;
	}

	span.faq-icon.open {
		transform: rotate(180deg);
	}

	@media screen and (min-width: 1024px) {
		section {
			grid-template-columns: auto 1fr;
		}
	}
</style>
