export class StringUtils {
	// https://stackoverflow.com/questions/45205593/how-to-convert-a-json-style-object-to-a-css-string
	public static styleToString(style: Partial<CSSStyleDeclaration>): string {
		return Object.keys(style).reduce(
			(acc, key) =>
				acc +
				key
					.split(/(?=[A-Z])/)
					.join('-')
					.toLowerCase() +
				':' +
				style[key as never] +
				';',
			''
		);
	}

	public static truncate(s: string, len: number): string {
		if (s.length <= len) return s;
		return s.slice(0, len) + '...';
	}

	public static toTimeString(ts: number): string {
		if (ts > 0) {
			const seconds = Math.floor(ts / 1000) % 60;
			const minutes = Math.floor(ts / (1000 * 60)) % 60;
			const hours = Math.floor(ts / (1000 * 60 * 60));

			return `${hours != 0 ? `${hours.toString().padStart(2, '0')}:` : ''}${minutes
				.toString()
				.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		} else {
			return '';
		}
	}

	public static timeSince(now: number, time: number) {
		return StringUtils.toTimeString(now - time);
	}

	// templates are compile time so I have to shove in entire object in function signature how fun
	public static enumToString(
		e: Record<string, string | number>,
		v: string | number
	): string | undefined {
		return Object.keys(e).find((key) => e[key] === v);
	}

	public static firstLetterToLowerCase(s: string): string {
		return s.charAt(0).toLowerCase() + s.slice(1);
	}

	public static firstLetterToUpperCase(s: string): string {
		return s.charAt(0).toUpperCase() + s.slice(1);
	}
}
