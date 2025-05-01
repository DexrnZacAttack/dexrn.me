<script context="module" lang="ts">
	let bg: HTMLCanvasElement;

	export function getCanvas(): HTMLCanvasElement {
		return bg;
	}
</script>

<script lang="ts">
	import { DexrnSite } from '$lib/DexrnSite';
	import { onMount, tick } from 'svelte';
	import { t } from 'svelte-i18n';
	import { speed } from '$lib/store';
	import { fade } from 'svelte/transition';
	import { LoadingScreen } from '$lib/loadingScreen';

	async function load(img: HTMLImageElement): Promise<DexrnSite.LoadingResult> {
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const version = DexrnSite.getVersion();
		const timestamp = Date.now();

		img.src = `${DexrnSite.BACKEND_URL}/api/v1/panorama?timestamp=${timestamp}&timezone=${timezone}&ver=${version}`;

		try {
			let res = await new Promise<DexrnSite.LoadingResult>((resolve, reject) => {
				img.onload = () => resolve(DexrnSite.LoadingResult.SUCCESS);
				img.onerror = () => reject(DexrnSite.LoadingResult.BG_FAIL);
			});

			return res;
		} catch {
			return DexrnSite.LoadingResult.BG_FAIL;
		}
	}

	onMount(async () => {
		await tick();

		let background = new Image();

		await load(background).then(async (res) => {
			if (res === DexrnSite.LoadingResult.BG_FAIL) {
				LoadingScreen.transitionStatus = true;
				LoadingScreen.bgLoadingStatus = true;
				LoadingScreen.loadingText = $t('errors.bgFetchFailed');
				await DexrnSite.sleep(2000);
				LoadingScreen.bgLoadingStatus = false;
				await DexrnSite.sleep(250);
				LoadingScreen.transitionStatus = false;
				return;
			}

			bg.width = window.innerWidth;
			bg.height = window.innerHeight;

			const ctx = bg.getContext('2d');
			if (!ctx) {
				LoadingScreen.transitionStatus = true;
				LoadingScreen.bgLoadingStatus = true;
				LoadingScreen.loadingText = $t('errors.getCtxFailed');
				await DexrnSite.sleep(2000);
				LoadingScreen.bgLoadingStatus = false;
				await DexrnSite.sleep(250);
				LoadingScreen.transitionStatus = false;
				return;
			}
			ctx.imageSmoothingEnabled = false;
			LoadingScreen.bgLoadingStatus = false;

			let xPos = 0;
			let opacity = 0;
			let lastDrawTime = 0;
			const FPS = 60;

			let scale = bg.height / Math.max(background.height, 1);
			let width = background.width * scale;
			let height = bg.height;

			let oCv: OffscreenCanvas;

			if (typeof OffscreenCanvas !== 'undefined') {
				// setup offscreen canvas (unsure if I'm using this right)
				oCv = new OffscreenCanvas(width, height);
				const oCtx = oCv.getContext('2d');
				if (!oCtx) {
					LoadingScreen.transitionStatus = true;
					LoadingScreen.bgLoadingStatus = true;
					LoadingScreen.loadingText = $t('errors.getCtxFailed');
					await DexrnSite.sleep(2000);
					LoadingScreen.bgLoadingStatus = false;
					await DexrnSite.sleep(250);
					LoadingScreen.transitionStatus = false;
					return;
				}

				// draw to it
				oCtx.drawImage(background, 0, 0, background.width, background.height, 0, 0, width, height);

				// then draw to main canvas
				ctx.drawImage(oCv, xPos, 0, width, height);
			} else {
				// alternatively, if the browser doesn't support it for whatever reason... we can just write the image directly
				ctx.drawImage(background, xPos, 0, width, height);
			}

			const draw = (timestamp: number) => {
				// cap
				if (
					timestamp - lastDrawTime < 1000 / FPS ||
					DexrnSite.settings.doNotScrollPanorama ||
					!bg
				) {
					requestAnimationFrame(draw);
					return;
				}
				lastDrawTime = timestamp;

				if (opacity < 1) {
					opacity += 0.3;
					if (opacity > 1) opacity = 1;
				}

				ctx.globalAlpha = opacity;
				ctx.clearRect(0, 0, bg.width, bg.height);

				ctx.drawImage(oCv ?? background, xPos, 0, width, height);
				ctx.drawImage(oCv ?? background, xPos + width, 0, width, height);

				xPos -= speed.current * (88 / FPS);

				if (xPos <= -width) {
					xPos = 0;
				}

				requestAnimationFrame(draw);
			};

			window.addEventListener('resize', () => {
				bg.width = window.innerWidth;
				bg.height = window.innerHeight;
				scale = bg.height / background.height;
				width = background.width * scale;
				height = bg.height;
			});

			requestAnimationFrame(draw);
		});
	});
</script>

<canvas class="bg" bind:this={bg} transition:fade={{ duration: 200 }}></canvas>

<style>
	.bg {
		z-index: -1;
		position: absolute;
		width: 100vw;
		height: 100vh;
		gap: 10px;
		margin: 0;
		padding: 0;
		top: calc(50% - 1px); /* amazing */
		left: 50%;
		transform: translate(-50%, -50%);
		border: 0 solid var(--prim-border-color); /* so the browser will animate it */

		transition:
			width 0.3s ease-out,
			height 0.3s ease-out,
			border-width 0.3s ease-out,
			border-radius 0.3s,
			background 0.3s ease-out;
	}

	.hidden {
		display: none;
	}
</style>
