// Reusable Intersection Observer Action for SvelteKit
// Usage: <div use:isIntersecting={{threshold: 0.5, class: "show"}} || onintersect={handleIntersect}>...</div>

// Ensure to import the action: import { isIntersecting } from '$lib/utils/isIntersecting';

// Ensure app.d.ts has the following declaration:
/*
interface HTMLAttributes<T> {
			...other declarations
			onintersect?: IntersectionObserverCallback<T>;
		}
*/
/* 
	Example usage in this project with SpanifyText.svelte:
    <h3 class="heading-fade-in" use:isIntersecting={{ threshold: 0.5, once: true, class: "show" }}>
        <SpanifyText text="My frequently asked questions" />
    </h3>
*/

export interface IntersectOptions extends IntersectionObserverInit {
	class?: string; // class to toggle when visible
	once?: boolean; // only fire once
}

export function isIntersecting(node: HTMLElement, options: IntersectOptions = {}) {
	const { threshold = 0.1, root = null, rootMargin = "0px", class: cls = "show", once = true } = options;

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				if (cls) node.classList.add(cls);

				node.dispatchEvent(new CustomEvent("intersect", { detail: true }));

				if (once) observer.disconnect();
			} else {
				if (cls && !once) node.classList.remove(cls);
				node.dispatchEvent(new CustomEvent("intersect", { detail: false }));
			}
		},
		{ threshold, root, rootMargin }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
