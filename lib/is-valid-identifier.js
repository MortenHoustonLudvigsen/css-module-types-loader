var regenerate = require('regenerate');

var unicode = {
    Lu: require('regenerate-unicode-properties/General_Category/Uppercase_Letter'),
    Ll: require('regenerate-unicode-properties/General_Category/Lowercase_Letter'),
    Lt: require('regenerate-unicode-properties/General_Category/Titlecase_Letter'),
    Lm: require('regenerate-unicode-properties/General_Category/Modifier_Letter'),
    Lo: require('regenerate-unicode-properties/General_Category/Other_Letter'),
    Nl: require('regenerate-unicode-properties/General_Category/Letter_Number'),
    Mn: require('regenerate-unicode-properties/General_Category/Nonspacing_Mark'),
    Mc: require('regenerate-unicode-properties/General_Category/Spacing_Mark'),
    Nd: require('regenerate-unicode-properties/General_Category/Decimal_Number'),
    Pc: require('regenerate-unicode-properties/General_Category/Connector_Punctuation'),
    ZWNJ: regenerate(0x200C),
    ZWJ: regenerate(0x200D)
};

var identifierStart = regenerate(unicode.Lu, unicode.Ll, unicode.Lt, unicode.Lm, unicode.Lo, unicode.Nl);
var identifierPart = regenerate(identifierStart, unicode.Mn, unicode.Mc, unicode.Nd, unicode.Pc, unicode.ZWNJ, unicode.ZWJ);
var identifierRe = new RegExp('^(' + identifierStart.toString() + ')(' + identifierPart.toString() + ')*$');

var reservedWords = [
    'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do',
    'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if', 'import',
    'in', 'instanceof', 'new', 'null', 'return', 'super', 'switch', 'this', 'throw', 'true',
    'try', 'typeof', 'var', 'void', 'while', 'with', 'implements', 'interface', 'let', 'package',
    'private', 'protected', 'public', 'static', 'yield'
];

function isValidIdentifier(identifier) {
    if (!identifier) {
        return false;
    }
    if (reservedWords.indexOf(identifier) >= 0) {
        console.warn('"' + identifier + '" is a reserved word');
        return false;
    }
    return identifierRe.test(identifier);
}

module.exports = isValidIdentifier;
