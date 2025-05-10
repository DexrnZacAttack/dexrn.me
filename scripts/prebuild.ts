import * as fs from 'node:fs';
import pkg from '../package.json' with { type: 'json' }; // ???
import { Build } from './shared.js';

const b: Build = {
	preBuild: {
		timestamp: Date.now()
	},
	postBuild: {
		timestamp: 0
	},
	version: pkg.version
};

fs.writeFileSync('build.json', JSON.stringify(b));
