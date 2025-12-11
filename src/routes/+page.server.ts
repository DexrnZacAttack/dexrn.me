import { ProjectsApi } from '$lib/api/ProjectsApi';
import type { Project } from '$lib/api/starlie';

export const prerender = false;

export const load = async () => {
	try {
		const projects: Project[] = (await ProjectsApi.fetchProjects()).filter(
			(p) => p.projectUrl && p.isFeatured
		);

		return { projects };
	} catch {
		return {}; // todo "optional" type
	}
};
