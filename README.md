# angular-css-modules-loader
CSS modules support for Angular

# Installation
```
npm i --save-dev angular-css-modules-loader
```

# Usage
Add loaders for your `.component.ts` files in `webpack.config.js` rules-section like follows:
```
            {
                test: /\.tsx?$/,
                use: [
                    "ts-loader?transpileOnly=true",
                    "angular-css-modules-loader"
                    "angular2-template-loader"
                ],
                include: /\.component\.ts/
            },

...

            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: "[name]__[local]--[hash:base64:5]"
                        }
                    }
                ],
                include: /\.component\.css/,
                exclude: /node_modules/,
            },
...
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: "[name]__[local]--[hash:base64:5]"
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ],
                include: /\.component\.scss/,
                exclude: /node_modules/,
            },

```

# How it works?

All the CSS-module requires and template-requires are groupped together. Loader will replace all occurencies of the `$some-class-name` with CSS-modules' `some-class-name`-match.


# Example

If your angular component structure looks similar to this:

login.component.scss:

```
.login-row + .password-row {
    margin-top: 10px;
}
```

login.component.html:

```
...
<div class="row $login-row">
...
</div>
<div class="row $password-row">
...
</div>
...
```

login.component.ts:
```
@Component({
    selector: "login",
    styleUrls: ["./login.component.scss"],
    templateUrl: "./login.component.html",
})
export class LoginComponent {
    ...
}
```

The transformed `login.component.ts` will look like this:

```
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

....

@Component({
    selector: "login",
    template: __replaceCssModules({"prefix":"$","suffix":"",unusedHtmlClasses:false,unusedSelectors:false})(require('./login.component.html'), [require('./login.component.scss')]),
})
export class LoginComponent {
    ...
}
```


The replaced `template` will be transformed to something like this:

```
...
<div class="row login-component__login-row--3xPhd">
...
</div>
<div class="row login-component__password-row--45j3f">
...
</div>
...
```


You can manage the transformation by providing options to a loader. The following options are available:

| Option            | Type    | Default | Description                 |
|-------------------|---------|---------|-----------------------------|
| prefix            | string  | "$"     | Class prefix                |
| suffix            | string  | ""      | Class suffix                |
| unusedHtmlClasses | boolean | false   | Report unused HTML classes  |
| unusedSelectors   | boolean | false   | Report unused CSS selectors |


```
"angular-css-modules-loader?prefix=$&suffix=$&unusedHtmlClasses=true&unusedSelectors=true"
```
