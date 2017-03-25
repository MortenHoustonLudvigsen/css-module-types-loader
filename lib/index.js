var os = require('os');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var isValidIdentifier = require('./is-valid-identifier');

function parseLocals(content) {
    var match = /exports.locals\s*=\s*({[^}]*})/.exec(content);
    return JSON.parse(match && match[1] || '{}');
}

function generateTypingsInterface(locals) {
    locals = locals || {};

    var hasStyles = false;
    var typings = 'declare const styles: {';
    for (var className in locals) {
        if (locals.hasOwnProperty(className)) {
            hasStyles = true;
            typings += os.EOL + "    '" + className + "': string;";
        }
    }

    if (hasStyles) {
        typings += os.EOL;
    }

    typings += '};';
    typings += os.EOL + 'export default styles;';
    typings += os.EOL;
    return typings;
}

function generateTypings(locals) {
    locals = locals || {};

    var hasStyles = false;
    var typings = '';
    for (var className in locals) {
        if (locals.hasOwnProperty(className)) {
            hasStyles = true;
            typings += 'export const ' + className + ': string;' + os.EOL;
        }
    }

    if (!hasStyles) {
        return generateTypingsInterface(locals);
    }

    return typings;
}

function readFileSync(filePath, options) {
    try {
        return fs.readFileSync(filePath, options);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return;
        }
        throw err;
    }
}

function writeFileIfChanged(filePath, contents) {
    var existing = readFileSync(filePath, 'utf8');
    if (existing !== contents) {
        console.log('Emitting ' + chalk.green(filePath));
        fs.writeFileSync(filePath, contents, 'utf8');
    }
}

function cssTypesLoader(content) {
    var locals = parseLocals(content);
    var typings = generateTypings(locals);
    if (typeof typings === 'string') {
        writeFileIfChanged(this.resourcePath + '.d.ts', typings);
    }

    // Pass content on to next loader
    return content;
}

module.exports = cssTypesLoader;