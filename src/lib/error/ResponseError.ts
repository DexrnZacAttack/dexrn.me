export interface PlainResponseError {
	name: string,
	message: string,
	response: string,
	code: number
}

export class ResponseError extends Error {
	code: number;
	response: string;

	constructor(message: string, response: string, code: number) {
		super(message);
		this.name = "ResponseError";
		this.response = response;
		this.code = code;

		Object.setPrototypeOf(this, ResponseError.prototype);
	}

	static async create(message: string, response: Response) {
		return new ResponseError(message, await response.text(), response.status)
	}

	// this is the best you're gonna get.
	static toString(serialized: PlainResponseError): string {
		if (serialized.response.trim() === "" || !serialized.response)
			return `[ResponseError] ${serialized.message}: ${serialized.code}`;

		return `[ResponseError] ${serialized.message}: (${serialized.code}) ${serialized.response}`;
	};

	toJSON() {
		return {
			name: this.name,
			message: this.message,
			response: this.response,
			code: this.code
		}
	}

	// got fucking tired of toying with this

	toString(): string {
		if (this.response.trim() === "" || !this.response)
			return `[ResponseError] ${this.message}: ${this.code}`;

		return `[ResponseError] ${this.message}: (${this.code}) ${this.response}`;
	};
}