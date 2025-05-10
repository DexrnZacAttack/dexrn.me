import * as fs from 'node:fs';
import build from '../build.json' with { type: 'json' };
import { Build } from './shared.js'; // ???

const b: Build = build as Build;

b.postBuild.timestamp = Date.now();

fs.writeFileSync('build.json', JSON.stringify(b));
