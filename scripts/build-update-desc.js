const fs = require('fs')
const pkg = require('../package.json')
const path = require('path')

const updateJson = {
	version: pkg.version,
	description: pkg.description.split('\n')
}

fs.writeFileSync(path.join(__dirname, '../dist_electron/update-desc.json'), JSON.stringify(updateJson))
