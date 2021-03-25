import { packageExists } from './package-exists';

export async function getTypes(
	packages: string[],
	current?: Record<string, string>,
) {
	console.log(current);
	function* getPackages() {
		for (const pkg of packages) {
			if (!pkg.startsWith('@types')) {
				const typePackage = `@types/${
					pkg.startsWith('@') ? pkg.substring(1).replace('/', '__') : pkg
				}`;
				if (
					!packages.includes(typePackage) &&
					(!current || current[typePackage])
				) {
					yield packageExists(typePackage).then((x) =>
						x ? typePackage : undefined,
					);
				}
			}
		}
	}

	return (await Promise.all(getPackages())).filter((x) => x) as string[];
}
