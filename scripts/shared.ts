export interface Build {
	postBuild: {
		timestamp: number;
	};
	preBuild: {
		timestamp: number;
	};
	version: string;
}
