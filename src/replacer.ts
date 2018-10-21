
/* Begin: Replacer function */
interface ICssModulesParams {
    prefix: string;
    suffix: string;
    unusedHtmlClasses: string;
    unusedSelectors: string;
}

function __escapeRegExp(value: string): string {
    return value.replace(/[-\/\\^$*+?.()|[\]{}]/m, "\\$&");
}

function __replaceCssModules({ prefix, suffix, unusedHtmlClasses, unusedSelectors }: ICssModulesParams) {
    return function (template: string, styles: object[]): string {
        let result: string = template;
        styles.forEach((style: object): void => {
            for (const [key, value] of Object.entries(style)) {
                const matchRegExp: RegExp = new RegExp(`${__escapeRegExp(prefix)}\\b${__escapeRegExp(key)}(?![\\w-])\\b${__escapeRegExp(suffix)}`, "gm");
                if (matchRegExp.test(result)) {
                    matchRegExp.lastIndex = 0;
                    result = result.replace(matchRegExp, value);
                } else if (unusedSelectors) {
                    console.warn(`Unused selector: ${key}`);
                }
            }
        });

        if (unusedHtmlClasses) { // find unused HTML keys
            const unusedRegExp: RegExp = new RegExp(`(${__escapeRegExp(prefix)}\\b[\\w-]+\\b${__escapeRegExp(suffix)})`, "gm");
            let unusedMatches: RegExpExecArray | null;
            while ((unusedMatches = unusedRegExp.exec(result)) !== null) {
                console.warn(`Unused HTML-class: ${unusedMatches[1]}`);
            }
        }

        return result;
    };
}
/* End: Replacer function */
