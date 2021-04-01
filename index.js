const Table          = require('cli-table3');
const colors         = require('colors');
const { formatSize } = require('webpack/lib/SizeFormatHelpers');
class ShowAssetsTablePlugin {

	apply(compiler) {
		// Specify the event hook to attach to
		compiler.hooks.done.tap(
			'ShowAssetsTablePlugin',
			(stats) => {
				if (stats.hasErrors()) {
					return false;
				}

				const data = stats.toJson({
					assets: true,
					builtAt: true,
					hash: true,
					performance: true,
				});

				this.createTable(data);
			}
		);
	}

	createTable(data) {
		const table = new Table({
			head: ['#'.bold, 'File'.bold, 'Size'.bold],
			style: {
				head: [],
				border: [],
			},
			colWidths: [4, 50, 16],
		});

		const assets = Object.entries(data.assets);

		for (const asset of assets) {
			table.push([parseInt(asset[0]) + 1, this.colorize(asset[1].name), formatSize(asset[1].size)]);
		}

		console.log();
		console.log(table.toString());
	}

	colorize(name) {

		if(name.startsWith('js')) {
			return name.yellow;
		} else if(name.startsWith('css')) {
			return name.cyan;
		} else if(name.startsWith('views')) {
			return name.green;
		}

		return name;
	}
}

module.exports = ShowAssetsTablePlugin;
