import { ProjectStage } from '$lib/api/ProjectsApi';

export class ProjectStageImpl {
	public static getColor(stage?: ProjectStage): string {
		switch (stage) {
			case ProjectStage.Discontinued:
				return 'var(--project-stage-discontinued)';
			case ProjectStage.Inactive:
				return 'var(--project-stage-inactive)';
			default:
			case ProjectStage.NotTracked:
				return 'var(--project-stage-not-tracked)';
			case ProjectStage.Paused:
				return 'var(--project-stage-paused)';
			case ProjectStage.InProgress:
				return 'var(--project-stage-in-progress)';
			case ProjectStage.FeatureComplete:
				return 'var(--project-stage-feature-complete)';
		}
	}

	// todo translations
	public static toString(stage?: ProjectStage): string {
		switch (stage) {
			case ProjectStage.Discontinued:
				return 'Discontinued';
			case ProjectStage.Inactive:
				return 'Inactive';
			default:
			case ProjectStage.NotTracked:
				return 'Not Tracked';
			case ProjectStage.Paused:
				return 'Paused';
			case ProjectStage.InProgress:
				return 'In-progress';
			case ProjectStage.FeatureComplete:
				return 'Feature complete';
		}
	}

	public static toDescriptionString(stage?: ProjectStage): string {
		switch (stage) {
			case ProjectStage.Discontinued:
				return 'This project is no longer being worked on';
			case ProjectStage.Inactive:
				return 'This project is on hold for an undetermined amount of time';
			default:
			case ProjectStage.NotTracked:
				return "This project's stage is not tracked, usually because I am not the sole author working on it";
			case ProjectStage.Paused:
				return 'This project is on hold for a short amount of time\nUsually because I get burnt out or need to work on something else';
			case ProjectStage.InProgress:
				return 'This project is actively being worked on';
			case ProjectStage.FeatureComplete:
				return 'This project is feature complete, this usually means updates may be small and infrequent\nThis, however, does not rule out the potential for more features and/or rewrites';
		}
	}
}
