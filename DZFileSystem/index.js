const fs = require('fs');

class DZFileSystem {
	constructor(fs) {
		this.fs = fs;
		this.data = {};
		this.win = undefined;
		this.dialog = undefined;
		this.filePath = undefined;
		this.localPromise = undefined;
	}

	init(win, dialog) {
		this.win = win;
		this.dialog = dialog;
	}

	write(data, overwrite) {
		const saveAs = overwrite || false;
		this.localPromise = new Promise((resolve, reject) => {
			if(overwrite || this.filePath === undefined) {
				this.dialog.showSaveDialog(this.win, {defaultPath: 'filname.log'}).then( result => {
					console.log("Fullpath: ", result.filePath);
					if (result.filePath) {
						this.filePath = result.filePath;
						this.writeFile(this.filePath, data);
						resolve(this.filePath);
					}
				});
			} else {
				this.writeFile(this.filePath, data);
				resolve(this.filePath);
			}
		});

		return this.localPromise;
   }

   writeFile(path, data) {
		this.fs.writeFile(path, data, (err) => {
			if(err) {
				console.log("There was an error", err);
			} else {
				console.log("File has been saved.");
			}
		});
	}

	handler (err) {
		if(err) {
			console.log("There was an error", err);
		} else {
			console.log("File has been saved.");
		}
   }
}

const dzFS = new DZFileSystem(fs);

exports.init = (win, dialog) => {
	dzFS.init(win, dialog);
};

exports.save = (data, overwrite) => {
	return dzFS.write(data, overwrite);
};