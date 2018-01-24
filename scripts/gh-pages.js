const fs = require('fs');
const content = [
	'*',
	'!index.html',
	'!/dist'
	].join('\n');
const path = './.gitignore';
fs.writeFile(path, content, (writeErr) => {
	if (!writeErr) {
		console.log(`success write ${path}`);
	}
});