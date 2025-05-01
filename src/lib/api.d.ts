export interface PostInfo {
	timestamp: Date;
	title: string;
	id: string;
	filename: string;
	postURL: string;
	hidden: boolean;
}

export interface ApiResponse<T> {
	success: boolean;
	result: T;
}

export interface Post {
	timestamp: Date;
	title: string;
	body: string;
	id: string;
	hidden?: boolean;
}
