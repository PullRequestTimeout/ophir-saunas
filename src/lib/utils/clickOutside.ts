/*
Ensure app.d.ts is configured to allow for the outclick event to be used in Svelte components:

declare namespace svelteHTML {
		interface HTMLAttributes<T> {
			"on:outclick"?: CompositionEventHandler<T>;
		}
	}
*/
export function clickOutside(node: any) {
	const handleClick = (event: any) => {
		if (!node.contains(event.target)) {
			node.dispatchEvent(new CustomEvent("outclick"));
		}
	};

	document.addEventListener("click", handleClick, true);

	return {
		destroy() {
			document.removeEventListener("click", handleClick, true);
		}
	};
}
