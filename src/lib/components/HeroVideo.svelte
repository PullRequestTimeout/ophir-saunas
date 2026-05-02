<script lang="ts">
	import { onMount } from "svelte";

	let isSmall = false;
	let isMounted = false;
	let videoEl: HTMLVideoElement;
	let mq: MediaQueryList;
	const desktopSrc = "/assets/video/ophir.mp4";
	const mobileSrc = "/assets/video/ophir-small.mp4";

	$: videoSrc = isSmall ? mobileSrc : desktopSrc;
	$: if (isMounted && videoEl) {
		videoEl.load();
		void videoEl.play().catch(() => {
			// Autoplay can be blocked; ignore and let controls/browser policy decide.
		});
	}

	onMount(() => {
		mq = window.matchMedia("(min-width: 1024px)");

		const update = () => {
			isSmall = !mq.matches;
		};

		update();
		isMounted = true;
		mq.addEventListener("change", update);

		return () => {
			mq.removeEventListener("change", update);
		};
	});
</script>

<video
	bind:this={videoEl}
	src={videoSrc}
	autoplay
	muted
	loop
	playsinline
	preload="metadata"
	style="width: 100%; height: 100%; object-fit: cover; top: 0; left: 0; position: absolute; z-index: -1;"
></video>
