
/* Begin: Replacer function */
interface ICssModulesParams {
    prefix: string;
    suffix: string;
}

function __escapeRegExp(value: string): string {
    return value.replace(/[-\/\\^$*+?.()|[\]{}]/m, "\\$&");
}

function __replaceCssModules({ prefix, suffix }: ICssModulesParams) {
    return function (template: string, styles: object[]): string {
        let result: string = template;
        styles.forEach((style: object): void => {
            for (const [key, value] of Object.entries(style)) {
                const matchRegExp: RegExp = new RegExp(`(${__escapeRegExp(prefix)}\\b${__escapeRegExp(key)}\\b${__escapeRegExp(suffix)})["' \\n\\r\\]]`, "gm");
                if (matchRegExp.test(result)) {
                    matchRegExp.lastIndex = 0;
                    let matches: RegExpExecArray | null;
                    while ((matches = matchRegExp.exec(result)) !== null) {
                        result = result.slice(0, matches.index) + value + result.slice(matches.index + matches[1].length);
                    }
                }
            }
        });
        return result;
    };
}
/* End: Replacer function */
