import { execSync } from "child_process";
import {existsSync, readdirSync} from "fs";

const stdio = [0, 1, 2];
// We're in a workspace
if (existsSync("packages/")) {
	readdirSync("packages/").forEach((packageName) => {
		execSync("npx semantic-release --deps.bump=inherit", {
			stdio,
			cwd: `packages/${packageName}`,
		});
	}, {
		stdio,
	});
}
// We're in a single package
else {
	execSync("npx semantic-release --deps.bump=inherit", {
		stdio,
	});
}
