import { ProjectsApi, ProjectStage, ProjectType } from '$lib/api/ProjectsApi';
import { ResponseError } from '$lib/error/ResponseError';

export const load = async () => {
	try {
		const p = await ProjectsApi.fetchProjects();
		const projects = p
			.filter((p) => p.type == ProjectType.Project)
			.sort((rhs, lhs) => (lhs.percentageComplete || 0) - (rhs.percentageComplete || 0))
			.sort(
				(rhs, lhs) =>
					(lhs.stage ?? ProjectStage.NotTracked) - (rhs.stage ?? ProjectStage.NotTracked)
			);

		const organizations = p
			.filter((p) => p.type == ProjectType.Organization)
			.sort((rhs, lhs) => rhs.name.toLowerCase().localeCompare(lhs.name));

		return { projects, organizations };
	} catch (ex: unknown) {
		if (ex instanceof ResponseError) {
			return { error: (ex as ResponseError).toJSON() };
		}

		if (ex instanceof Error) {
			return { error: { name: ex.name, message: ex.message, response: '', code: 500 } };
		}
	}
};
