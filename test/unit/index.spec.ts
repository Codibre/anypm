import { program } from 'commander';

describe('index.ts', () => {
	afterEach(() => {
		delete require.cache[require.resolve('../../src/index')];
	});

	beforeEach(() => {
		jest.spyOn(program, 'command');
		jest.spyOn(program, 'parse').mockReturnThis();
	});

	it('should set available commands', () => {
		process.argv = ['args'];

		require('../../src/index');

		expectCallsLike(
			program.command,
			['install [packages...]'],
			['uninstall <packages...>'],
			['ci'],
			['help', { isDefault: true }],
		);
		expectCallsLike(program.parse, [['args']]);
	});
});
