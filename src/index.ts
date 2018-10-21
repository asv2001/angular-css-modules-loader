import * as path from "path";
import * as fs from "fs";
import { getOptions } from "loader-utils";

interface ICssModulesParams {
    prefix?: string;
    replacer?: string;
    suffix?: string;
    unusedHtmlClasses?: boolean;
    unusedSelectors?: boolean;
}

function getNewHeaderText(header: string, params: ICssModulesParams): string {
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

function transformSource(this: any, source: string): void {
    const callback: Function = this.async();
    const {
        prefix = "$",
        replacer = path.resolve(__dirname, "replacer.ts"),
        suffix = "",
        unusedHtmlClasses = false,
        unusedSelectors = false,
    } = getOptions(this) || {};
    const componentRegExp: RegExp = new RegExp("(@Component\\(\\{[\\S\\s.]*?\\}\\))", "gim");
    const matches: RegExpExecArray | null = componentRegExp.exec(source);

    if (matches) {
        this.addDependency(replacer);
        fs.readFile(replacer, "utf-8", function (err: any, header: string) {
            if (err) {
                return callback(err);
            }

            const newHeader: string = getNewHeaderText(matches[1], { prefix, suffix, unusedHtmlClasses, unusedSelectors });
            callback(null, header + source.replace(matches[1], newHeader), source);
        });
    } else {
        callback(null, source);
    }
}

module.exports = transformSource;
