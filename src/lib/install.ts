import { getTypes } from './get-types';
import { getCommand } from './get-command';
import { manageLocks } from './manage-locks';
import { prepareManager } from './prepare-manager';
import { mountNpmCommand } from './mount-npm-command';
import { prepareOptions } from './prepare-options';
import { properHoist } from './proper-hoist';

interface InstallOptions {
	keepLock: boolean;
	saveDev: boolean;
}

const ARG0 = 'install';

export async function* install(
	packages: string[],
	informedOptions: InstallOptions,
) {
	const options = prepareOptions(informedOptions);
	const { hasCommand, command } = await getCommand();
	if (packages.length === 0 || options.keepLock) {
		yield* prepareManager(hasCommand);
	}
	const hasPackages = packages.length > 0;
	packages.push(properHoist);

	yield mountNpmCommand(command, ARG0, packages, options.saveDev);

	if (hasPackages) {
		const types = await getTypes(packages);

		if (types.length > 0) {
			types.push(properHoist);
			yield mountNpmCommand(command, ARG0, types, true);
		}
	}

	yield* manageLocks(hasCommand, options);
}
