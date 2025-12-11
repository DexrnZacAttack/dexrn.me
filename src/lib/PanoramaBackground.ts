import { LoadingScreen } from '$lib/LoadingScreen';
import { cubicOut } from 'svelte/easing';
import { Tween } from 'svelte/motion';
import { DexrnSite, LoadingResult } from './DexrnSite';

export class PanoramaBackground {
	public static instance: PanoramaBackground;
	// canvas
	private static readonly SPEED_MULTIPLIER = 88;
	private static readonly FPS = 60;
	// bg speed
	private static readonly ZOOMED_OUT_SPEED = 10;
	private static readonly NORMAL_SPEED = 1;
	/// Our image
	public image: HTMLImageElement;

	/// Our canvas
	public canvas: HTMLCanvasElement;
	public readonly speed = new Tween(1, {
		duration: 500,
		easing: cubicOut
	});
	public readonly zoom = new Tween(0, {
		duration: 200,
		easing: (t) => t
	});
	/// Our canvas's context
	private _context: CanvasRenderingContext2D | null = null;
	/// Our offscreen canvas, because copying from HTMLImageElement is slow
	private _offscreenCanvas?: OffscreenCanvas;
	/// Position of the panorama in the canvas
	private _pos: Vector2 = { x: 0, y: 0 };
	private _opacity = 0;
	private _lastDraw = 0;
	private readonly _fps = PanoramaBackground.FPS;
	private readonly _onResize: () => void;
	private readonly _onDraw: (timestamp: number) => void;
	// bounds
	private _canvasScale = 0;
	private _canvasBounds: Vector2 = { x: 0, y: 0 };

	public constructor(element: HTMLCanvasElement) {
		this.canvas = element;
		this.zoomOut();

		this.image = new Image();
		PanoramaBackground.instance = this;

		this._onResize = () => this.resize();
		this._onDraw = (timestamp) => this.draw(timestamp);

		window.addEventListener('resize', this._onResize);
	}

	/// Loads the background and prepares the canvases
	public async setup() {
		await this.load().then(async (res) => {
			if (res === LoadingResult.BG_FAIL) {
				await this.setErrorState('errors.getCtxFailed');
				return;
			}

			this._context = this.canvas.getContext('2d');
			if (!this._context) {
				await this.setErrorState('errors.getCtxFailed');
				return;
			}

			this._context!.imageSmoothingEnabled = false;
			LoadingScreen.Instance.bgLoadingStatus = false;

			await this.setupOffscreenCanvas();

			requestAnimationFrame(this._onDraw);
		});
	}

	/// Zooms the background out
	public zoomOut() {
		const z = DexrnSite.instance.settings.zoomPercentage;
		this.zoom.target = z;

		this.canvas.style.background = 'var(--alt-bg-color-2)';
		this.canvas.style.borderRadius = '20px';
		this.canvas.style.width = `calc(var(--vw) - 100px * ${z} / 100)`;
		this.canvas.style.height = `calc(var(--vh) - 100px * ${z} / 100)`;
		this.canvas.style.borderWidth = 'var(--alt-border-size)';
	}

	/// Zooms the background in
	public zoomIn() {
		this.zoom.target = 0;

		this.canvas.style.width = '100%';
		this.canvas.style.height = '100%';
		this.canvas.style.background = 'none';
		this.canvas.style.borderWidth = '0'; // we only set border width because the browser refuses to animate normal border assignment
	}

	/// Called to transition out of a page
	public async transitionOut() {
		LoadingScreen.Instance.transitionStatus = true;
		await DexrnSite.sleep(250);

		this.speed.target = PanoramaBackground.ZOOMED_OUT_SPEED;
		this.zoomOut();
	}

	/// Called to transition into a page
	public async transitionIn() {
		await DexrnSite.sleep(900);
		LoadingScreen.Instance.loadingStatus = false;

		this.zoomIn();
		this.speed.target = PanoramaBackground.NORMAL_SPEED;

		await DexrnSite.sleep(100);
		this.canvas.style.borderRadius = '0';

		LoadingScreen.Instance.transitionStatus = false;
	}

	/// Starts drawing
	public begin() {
		requestAnimationFrame(this._onDraw);
	}

	/// Resizes the background
	public resize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		this._canvasScale = this.canvas.height / Math.max(this.image.height, 1);
		this._canvasBounds.x = this.image.width * this._canvasScale;
		this._canvasBounds.y = this.image.height * this._canvasScale;
	}

	/// Loads the image
	public async load(): Promise<LoadingResult> {
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const version = DexrnSite.getVersion();
		const timestamp = Date.now();

		this.image.src = `${DexrnSite.STARLIE_URL}/panorama?timestamp=${timestamp}&timezone=${timezone}&version=${version}`;

		try {
			return await new Promise<LoadingResult>((resolve, reject) => {
				this.image.onload = () => {
					this.resize();

					resolve(LoadingResult.SUCCESS);
				};
				this.image.onerror = () => reject(LoadingResult.BG_FAIL);
			});
		} catch {
			return LoadingResult.BG_FAIL;
		}
	}

	/// Sets up offscreen canvas if supported
	private async setupOffscreenCanvas(): Promise<void> {
		if (typeof OffscreenCanvas === 'undefined') {
			return;
		}

		this._offscreenCanvas = new OffscreenCanvas(this._canvasBounds.x, this._canvasBounds.y);
		const oCtx = this._offscreenCanvas.getContext('2d');
		if (!oCtx) {
			await this.setErrorState('errors.getCtxFailed');
			return;
		}

		oCtx.drawImage(
			this.image,
			0,
			0,
			this.image.width,
			this.image.height,
			0,
			0,
			this._canvasBounds.x,
			this._canvasBounds.y
		);
	}

	/// Updates opacity
	private updateOpacity(): void {
		if (this._opacity < 1) {
			this._opacity += 0.3;
			if (this._opacity > 1) this._opacity = 1;
		}
	}

	/// Draws our panorama
	private drawPanorama(): void {
		if (!this._context) return;

		const source = this._offscreenCanvas ?? this.image;
		this._context.drawImage(
			source,
			this._pos.x,
			this._pos.y,
			this._canvasBounds.x,
			this._canvasBounds.y
		);
		this._context.drawImage(
			source,
			this._pos.x + this._canvasBounds.x,
			this._pos.y,
			this._canvasBounds.x,
			this._canvasBounds.y
		);
	}

	/// Updates panorama pos
	private updatePos(): void {
		this._pos.x -=
			PanoramaBackground.instance.speed.current * (PanoramaBackground.SPEED_MULTIPLIER / this._fps);

		if (this._pos.x <= -this._canvasBounds.x) {
			this._pos.x = 0;
		}
	}

	/// Draws a frame of the panorama
	private draw = (timestamp: number) => {
		if (!this._context) return;

		if (
			timestamp - this._lastDraw < 1000 / this._fps ||
			DexrnSite.instance.settings.doNotScrollPanorama ||
			!this.image
		) {
			requestAnimationFrame(this._onDraw);
			return;
		}

		this._lastDraw = timestamp;
		this.updateOpacity();

		this._context.globalAlpha = this._opacity;
		this._context.clearRect(0, 0, this.image.width, this.image.height);

		this.drawPanorama();
		this.updatePos();

		requestAnimationFrame(this._onDraw);
	};

	/// Sets an error state, freezing the background and showing some text on the loading screen
	private async setErrorState(translation: string) {
		LoadingScreen.Instance.transitionStatus = true;
		LoadingScreen.Instance.bgLoadingStatus = true;
		LoadingScreen.Instance.loadingText = DexrnSite.TRANSLATE(translation);
		await DexrnSite.sleep(2000);
		LoadingScreen.Instance.bgLoadingStatus = false;
		await DexrnSite.sleep(250);
		LoadingScreen.Instance.transitionStatus = false;
		return;
	}
}
