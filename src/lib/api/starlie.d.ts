import { type ProjectStage, ProjectType } from '$lib/api/ProjectsApi';

export interface Post {
	id: string;
	title: string;
	content: string;
	created: string;
	modified: string;
	thumbnailUrl?: string;
}

export interface ApiPost extends Post {
	authors: string[];
}

/// Post but with authors filled in
export interface FullPost extends Post {
	authors: Array<Author>;
}

export interface Author {
	username: string;
	displayName: string;
	avatarUrl?: string;
}

export interface Project {
	/// <summary>
	/// Project ID
	/// </summary>
	id: string;
	/// <summary>
	/// Project name
	/// </summary>
	name: string;
	/// <summary>
	/// Project description
	/// </summary>
	description?: string;
	/// <summary>
	/// Project URL (e.g. GitHub link)
	/// </summary>
	projectUrl?: string;
	/// <summary>
	/// Project logo URL
	/// </summary>
	logoUrl?: string;
	/// <summary>
	/// Percentage complete
	/// </summary>
	percentageComplete?: number;
	/// <summary>
	/// Time the project was created on the API
	/// </summary>
	created: string;
	/// <summary>
	/// The stage that the project is in
	/// </summary>
	stage?: ProjectStage;
	stageReason?: string;
	isFeatured: boolean;
	type: ProjectType;
}

export interface VersionResponse {
	version: string;
}
