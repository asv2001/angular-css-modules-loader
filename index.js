"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const loader_utils_1 = require("loader-utils");
function getNewHeaderText(header, params) {
    const stylesRegExp = new RegExp("(styles\\s*\\:\\s*(\\[.*?\\])\\s*,?)", "im");
    const stylesMatches = stylesRegExp.exec(header);
    const templateRegExp = new RegExp("(template\\s*\\:\\s*(require\\(.*?\\)))", "im");
    const templateMatches = templateRegExp.exec(header);
    if (templateMatches !== null && stylesMatches !== null) {
        return header
            .replace(stylesMatches[1], "")
            .replace(templateMatches[1], `template: __replaceCssModules(${JSON.stringify(params)})(${templateMatches[2]}, ${stylesMatches[2]})`);
    }
    return header;
}
function transformSource(source) {
    const callback = this.async();
    const { prefix = "$", replacer = path.resolve(__dirname, "replacer.ts"), suffix = "", unusedHtmlClasses = false, unusedSelectors = false, } = loader_utils_1.getOptions(this) || {};
    const componentRegExp = new RegExp("(@Component\\(\\{[\\S\\s.]*?\\}\\))", "gim");
    const matches = componentRegExp.exec(source);
    if (matches) {
        this.addDependency(replacer);
        fs.readFile(replacer, "utf-8", function (err, header) {
            if (err) {
                return callback(err);
            }
            const newHeader = getNewHeaderText(matches[1], { prefix, suffix, unusedHtmlClasses, unusedSelectors });
            callback(null, header + source.replace(matches[1], newHeader), source);
        });
    }
    else {
        callback(null, source);
    }
}
module.exports = transformSource;
