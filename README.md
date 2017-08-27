# eslint-plugin-feature-modules

Plugin for eslint rules that apply to feature modules directory structure

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-feature-modules`:

```
$ npm install eslint-plugin-feature-modules --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-feature-modules` globally.

## Usage

Add `feature-modules` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "feature-modules"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "feature-modules/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





