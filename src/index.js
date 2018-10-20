const path = require("path");
const fs = require("fs");
const { getOptions } = require("loader-utils");

function getNewHeaderText(header, options = {}) {
    const stylesRegExp = new RegExp("(styles\\s*\\:\\s*(\\[.*?\\])\\s*,?)", "im");
    const stylesMatches = stylesRegExp.exec(header);
    const templateRegExp = new RegExp("(template\\s*\\:\\s*(require\\(.*?\\)))", "im");
    const templateMatches = templateRegExp.exec(header);

    if (templateMatches !== null && stylesMatches !== null) {
        return header
            .replace(stylesMatches[1], "")
            .replace(templateMatches[1], `template: __replaceCssModules(${JSON.stringify(options)})(${templateMatches[2]}, ${stylesMatches[2]})`);
    }

    return header;
}

module.exports = function (source) {
    const callback = this.async();
    const { prefix = "$", suffix = "", replacer = path.resolve(__dirname, "replacer.ts") } = getOptions(this) || {};

    const componentRegExp = new RegExp("(@Component\\(\\{[\\S\\s.]*?\\}\\))", "gim");
    const matches = componentRegExp.exec(source);
    if (matches) {
        this.addDependency(replacer);
        fs.readFile(replacer, "utf-8", function (err, header) {
            if (err)
                return callback(err);

            const newHeader = getNewHeaderText(matches[1], { prefix, suffix });
            callback(null, header + source.replace(matches[1], newHeader), source);
        });
    } else {
        callback(null, source);
    }
};
