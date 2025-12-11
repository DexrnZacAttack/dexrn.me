import type { Project } from '$lib/api/starlie';
import { DexrnSite } from '$lib/DexrnSite';
import { ResponseError } from '$lib/error/ResponseError';

export enum ProjectStage {
	/// Project is no longer being worked on
	Discontinued,
	/// Project is on hold for an undetermined amount of time
	Inactive,
	/// Project is on hold for a short amount of time
	///
	/// Sometimes I get burnt out and need to work on something else
	Paused,
	NotTracked,
	/// Project is currently being worked on
	InProgress,
	/// Project is feature complete
	FeatureComplete
}

export enum ProjectType {
	Project,
	Organization
}

export class ProjectsApi {
	public static async fetchProjects(): Promise<Project[]> {
		const res = await fetch(`${DexrnSite.LOCAL_STARLIE_URL}/projects`, {
			method: 'GET',
			headers: {
				dzVersion: `${DexrnSite.getVersion()}`
			}
		});

		if (!res.ok) {
			throw await ResponseError.create('Failed to fetch projects', res);
		}

		let projects: Project[] = await res.json();
		projects = projects.sort(
			(a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
		);

		return projects;
	}
}
