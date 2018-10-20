
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
                const matchRegExp: RegExp = new RegExp(`${__escapeRegExp(prefix)}\\b${__escapeRegExp(key)}\\b${__escapeRegExp(suffix)}`, "gm");
                result = result.replace(matchRegExp, value);
            }
        });
        return result;
    };
}
/* End: Replacer function */
