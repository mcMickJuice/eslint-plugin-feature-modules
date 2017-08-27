# no-deep-module-require eslint rule

## Description
This rule prevents importing module related files that are not the index.js file a another module.  It is linting rule that enforces a certain folder/file structure.

## Motivation

Folder structures and conventions are important.  One folder structure that I like to utilize in web projects is the following:

```
src/
  modules/
    story/
    signup/
    home/
  app.js
```

Each folder under modules is a feature boundary that contains files specific to that feature.  This structure is communicated well in [this post](https://jaysoo.ca/2016/02/28/organizing-redux-application/#rule-1-organize-by-feature).

While modules can import components, service, etc from other modules, we don't want to make everything in a module "public". Therefore, the index.js file of each module acts defines the "public api" of the module.

This rule enforces this convention that all dependents of a module must "go through" that modules inedx.js.  If the importing file is importing a dependency in another module file that is "deeper" than that module's index.js, a linting error will be thrown.

## Assumptions
This rule only applies to an opinionated file structure as described above. In addition:
* each module folder (e.g. story, signup) has an index.js in the root
* each module folder is housed under a common root folder
* this common root folder is named modules, though you can configure this rule to accept a different module folder name (see below)

## Lint Options
`moduleFolderName` - common root folder that all modules are located in.  If no name is specified, `modules` will be the name that the rule uses