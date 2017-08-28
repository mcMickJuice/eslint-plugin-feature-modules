const path = require('path');

const isRequireFunction = node => {
  return (
    node.callee.type === 'Identifier' &&
    node.callee.name === 'require' &&
    node.arguments.length === 1 &&
    node.arguments[0].type === 'Literal'
  );
};

const isDotPath = filePath => {
  return filePath.startsWith('.');
};

const isDeepNonIndexImport = modulePathParts => {
  if (modulePathParts.length <= 2) return false;

  const thirdPathPart = modulePathParts[2];

  return thirdPathPart !== 'index' && thirdPathPart !== 'index.js';
};

const getRelevantPathParts = filePath => {
  return filePath.split(path.sep).filter(part => !part.startsWith('.'));
};

const getModuleName = (pathParts, moduleFolderName) => {
  const moduleFolderNameIndex = pathParts.indexOf(moduleFolderName);

  if (moduleFolderNameIndex === -1) return null;

  return pathParts[moduleFolderNameIndex + 1]; //get moduleName, one after moduleFolderName
};

const trimPathsToModuleFolder = (pathParts, moduleFolderName) => {
  const moduleFolderNameIndex = pathParts.indexOf(moduleFolderName);
  return pathParts.slice(moduleFolderNameIndex);
};

const lintingRule = function(context) {
  const verifyValidImport = (node, requirePath) => {
    if (!isDotPath(requirePath)) return; //dont check against node_modules or alias paths

    const fileName = context.getFilename();
    const { moduleFolderName } = context.options[0];

    const fullRequirePath = path.resolve(path.parse(fileName).dir, requirePath);

    const dependencyPathParts = getRelevantPathParts(fullRequirePath);
    const importingModulePathParts = getRelevantPathParts(fileName);

    // //are we requiring a file that is in same module?
    const dependencyModuleName = getModuleName(
      dependencyPathParts,
      moduleFolderName
    );
    const importingModuleName = getModuleName(
      importingModulePathParts,
      moduleFolderName
    );

    //if we arent requiring something from module folders
    // OR the requiring module is the same as our importing module, bail
    if (
      dependencyModuleName == null ||
      dependencyModuleName === importingModuleName
    ) {
      return;
    }

    //if not, are we digging more than one level deep?
    const modulePathParts = trimPathsToModuleFolder(
      dependencyPathParts,
      moduleFolderName
    );

    if (isDeepNonIndexImport(modulePathParts)) {
      context.report(node, 'Cannot request module thats too deep!');
    }
  };

  return {
    ImportDeclaration(node) {
      const importSource = node.source.value;
      verifyValidImport(node.source, importSource);
    },
    CallExpression(node) {
      if (!isRequireFunction(node)) {
        return;
      }
      const fileName = context.getFilename();
      const source = node.arguments[0].value;
      verifyValidImport(node.arguments[0], source);
    }
  };
};

module.exports = {
  meta: {
    docs: {
      description: 'Disallow digging too deep into feature modules',
      category: 'best practices'
    },
    schema: [
      {
        type: 'object',
        properties: {
          moduleBasePath: {
            type: 'string'
          },
          moduleFolderName: {
            type: 'string'
          }
        },
        required: ['moduleFolderName']
      }
    ]
  },
  create: lintingRule
};
