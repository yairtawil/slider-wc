const fs = require('fs');
const content = [
	'*',
	'!index.html',
	'!dist/main.bundle.js'
	].join('\n');
const path = './.gitignore';
fs.writeFile(path, content, (writeErr) => {
	if (!writeErr) {
		console.log(`success write ${path}`);
	}
});