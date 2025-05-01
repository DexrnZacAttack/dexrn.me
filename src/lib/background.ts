import { LoadingScreen } from '$lib/loadingScreen';
import { speed, zoom } from '$lib/store';
import { DexrnSite } from './DexrnSite';

export async function zoomOut(ref: HTMLElement) {
	// start transitioning (hides elements)
	LoadingScreen.transitionStatus = true;
	await DexrnSite.sleep(250);

	// ramp up the speed (note that we get bg null exception if we use .set)
	speed.target = 10;
	// zoom out
	zoom.target = DexrnSite.settings.zoomPercentage;
	ref.style.background = 'var(--alt-bg-color-2)';
	ref.style.borderRadius = '20px';
	ref.style.width = `calc(var(--vw) - 100px * ${DexrnSite.settings.zoomPercentage} / 100)`;
	ref.style.height = `calc(var(--vh) - 100px * ${DexrnSite.settings.zoomPercentage} / 100)`;
	ref.style.borderWidth = 'var(--alt-border-size)';
	// wait
	await DexrnSite.sleep(1000);
}

export async function zoomIn(ref: HTMLElement) {
	// wait for everything to hide
	await DexrnSite.sleep(900);

	// zoom in
	zoom.target = 0;

	// this hides the text as we zoom in, looks p nice
	LoadingScreen.loadingStatus = false;
	ref.style.width = '100%';
	ref.style.height = '100%';
	ref.style.background = 'none';
	ref.style.borderWidth = '0'; // we only set border width because the browser refuses to animate normal border assignment
	// ramp down the speed
	speed.target = 1;
	// sleep for a sec until we are partway through the animation
	await DexrnSite.sleep(100);
	// then we nuke the border radius
	ref.style.borderRadius = '0';

	// and then we're done transitioning
	LoadingScreen.transitionStatus = false;
}
