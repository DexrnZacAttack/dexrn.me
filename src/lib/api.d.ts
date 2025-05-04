export interface PostInfo {
	timestamp: Date;
	title: string;
	id: string;
	filename: string;
	postURL: string;
	hidden: boolean;
}

export interface ApiError {
	code: number;
	message: string;
}

export interface ApiResponse<T> {
	success: boolean;
	result: T;
	error?: ApiError;
}

export interface Post {
	timestamp: Date;
	title: string;
	body: string;
	id: string;
	hidden?: boolean;
}
