var fs = require('fs-extra');
var concat = require('concat');


(async function build() {
    const prgName = process.argv.slice(2)[0];

    let outputPath = process.argv.slice(3)[0].split("=")[1] || './dist/';
    const promoteFolders = process.argv.slice(4)[0] && process.argv.slice(4)[0].split("=")[1];
    const promoteFoldersArray = promoteFolders && promoteFolders.split(",") || [];
    const trimSupportingJS = true;
    const supportingJS = ['scripts.js','styles.js','polyfills.js','polyfill-webcomp-es5.js'];
    outputPath = outputPath + "/";
    var path = './dist/'+prgName;
    var jsFiles = [];
    fs.readdir(path, (err, files) => {
        files.forEach(file => {
            if (file.endsWith('.js')) {
              if(trimSupportingJS ) {
                if(supportingJS.indexOf(file) === -1) {
                  var jsPath = './dist/' + prgName + '/' + file;
                  jsFiles.push(jsPath);
                }
                else {
                  console.log("Supporting files", file);
                }
              }
              else {
                var jsPath = './dist/' + prgName + '/' + file;
                jsFiles.push(jsPath);
              }

            }
        })
    })
    if (!prgName) {
        console.log('Error: Project name should be specified.');
        return false;
    }

    await fs.ensureDir('./dist/' + prgName + '/elements');
    fs.ensureDir(outputPath);
    await concat(jsFiles, outputPath + prgName + '_es2015_bundle.js');

    if(promoteFoldersArray.length > 0) {
      promoteFoldersArray.forEach(folder => {
        const from = './dist/' + prgName + '/' + folder;
        const to = outputPath + folder;
        promoteFolder(from,to);
      })
    }

    function promoteFolder(from,to) {
      fs.ensureDir(from);
      fs.ensureDir(to);
      console.log('Copying file from ', from,' to ', to);
      fs.copy(from, to, function (err) {
        if (err){
            console.log('An error occured while copying the folder.')
            return console.error(err)
        }
        console.log('Copy completed!')
      });
    }

})();
