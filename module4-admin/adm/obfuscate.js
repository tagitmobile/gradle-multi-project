const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');
const distPath = path.join(__dirname, 'web-build/dist'); //"dist/mrb" may vary based on the project build setup
const files = fs.readdirSync(distPath);
const obfuscationOptions = {
    compact: true,
    controlFlowFlattening: false,
    controlFlowFlatteningThreshold: 1,
    numbersToExpressions: false,
    simplify: true,
    stringArrayShuffle: false,
    splitStrings: false,
    stringArrayThreshold: 1,
    transformObjectKeys: false,
    unicodeEscapeSequence: false,
    renameProperties: false,
    renamePropertiesMode: 'safe'
};
files.forEach(file => {
    if (file.endsWith('.js')) {
        const filePath = path.join(distPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const obfuscatedCode = JavaScriptObfuscator.obfuscate(content, obfuscationOptions);
        fs.writeFileSync(filePath, obfuscatedCode.getObfuscatedCode());
        console.log(`Obfuscated: ${file}`);
    }
});