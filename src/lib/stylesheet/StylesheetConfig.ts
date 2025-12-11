export enum StylesheetTheme {
	LIGHT = 'light',
	DARK = 'dark'
}

export class StylesheetConfig {
	private _root: HTMLElement;
	private _theme: StylesheetTheme;
	private _colors: Record<StylesheetTheme, Record<string, string>> = {
		[StylesheetTheme.LIGHT]: {
			'--prim-bg-color': 'rgba(255, 255, 255, 0.3)',
			'--alt-bg-color': 'rgba(200, 200, 200, 0.3)',
			'--prim-inverse-bg-color': 'rgba(0, 0, 0, 0.6)',
			'--alt-inverse-bg-color': 'rgba(0, 0, 0, 0.3)',
			'--prim-control-color': 'rgba(255, 255, 255, 0.5)',
			'--prim-border-color': 'rgba(255, 255, 255, 0.2)',
			'--prim-img-border-color': 'rgba(15, 15, 15, 0.3)',
			'--alt-bg-color-2': 'rgba(150, 150, 150, 0.2)',
			'--prim-moreopaque-border-color': 'rgba(200, 200, 200, 0.5)',
			'--prim-control-border-color': 'rgba(200, 200, 200, 0.2)',
			'--prim-other-bg-color': 'rgba(255, 255, 255, 0.2)',
			'--prim-reading-bg-color': 'rgba(229, 229, 229, 1)',
			'--prim-color': 'rgba(255, 255, 255, 1)',
			'--prim-hover-color': 'rgba(0, 120, 215, 0.3)',
			'--prim-subborder-color': 'rgba(255, 255, 255, 0.212)',
			'--prim-shadow-color': 'rgba(100, 100, 100, 0.3)',
			'--alt-border-size': '4px',
			'--prim-border-size': '2px',
			'--prim-text-color': 'black',
			'--href-color': '#0c3485',
			'--href-hover-color': '#07235c',
			'--behind-background-color': '#dddddd',
			'--behind-background-line-color': 'rgba(0, 0, 0, 0.1)',
			'--behind-border-color': 'rgb(190, 190, 190)'
		},
		[StylesheetTheme.DARK]: {
			'--prim-bg-color': 'rgba(0, 0, 0, 0.6)',
			'--alt-bg-color': 'rgba(50, 50, 50, 0.6)',
			'--prim-inverse-bg-color': 'rgba(255, 255, 255, 0.6)',
			'--alt-inverse-bg-color': 'rgba(255, 255, 255, 0.3)',
			'--alt-bg-color-2': 'rgba(0, 0, 0, 0.2)',
			'--prim-control-color': 'rgba(0, 0, 0, 0.5)',
			'--prim-border-color': 'rgba(100, 100, 100, 0.2)',
			'--prim-img-border-color': 'rgba(15, 15, 15, 0.3)',
			'--prim-moreopaque-border-color': 'rgba(100, 100, 100, 0.5)',
			'--prim-control-border-color': 'rgba(150, 150, 150, 0.2)',
			'--prim-other-bg-color': 'rgba(0, 0, 0, 0.2)',
			'--prim-reading-bg-color': 'rgba(15, 15, 15, 1)',
			'--prim-color': 'rgba(0, 0, 0, 1)',
			'--prim-hover-color': 'rgba(0, 120, 215, 0.3)',
			'--prim-subborder-color': 'rgba(255, 255, 255, 0.212)',
			'--prim-shadow-color': 'rgba(0, 0, 0, 0.6)',
			'--alt-border-size': '4px',
			'--prim-border-size': '2px',
			'--prim-text-color': 'white',
			'--href-color': '#109fff',
			'--href-hover-color': '#0b6cac',
			'--behind-background-color': '#111111',
			'--behind-background-line-color': 'rgba(255, 255, 255, 0.05)',
			'--behind-border-color': 'rgb(30, 30, 30)'
		}
	};

	public constructor(root: HTMLElement, theme: StylesheetTheme) {
		this._root = root;
		this._theme = theme;
	}

	public setTheme(theme: StylesheetTheme): void {
		this._theme = theme;
	}

	public apply() {
		for (const k in this._colors[this._theme]) {
			const v = this._colors[this._theme][k]; // wish it would just give pair

			this._root.style.setProperty(k, v);
		}
	}
}
