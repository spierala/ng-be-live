import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { UtilLibGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/workspace/generators';

interface NormalizedSchema extends UtilLibGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(tree: Tree, options: UtilLibGeneratorSchema): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
    const templateOptions = {
      ...options,
      ...names(options.name),
      offsetFromRoot: offsetFromRoot(options.projectRoot),
      template: ''
    };
    generateFiles(tree, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}

export default async function (tree: Tree, options: UtilLibGeneratorSchema) {
  libraryGenerator(tree, {
    name: 'util-' + options.name,
    directory: options.directory,
    tags: `type:util, scope:${options.directory}`
  });
  await formatFiles(tree);
}


