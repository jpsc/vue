import { join, normalize } from '@angular-devkit/core';
import { Rule } from '@angular-devkit/schematics';
import { generateProjectLint } from '@nrwl/workspace';
import { updateWorkspaceInTree } from '@nrwl/workspace/src/utils/ast-utils';
import { NormalizedSchema } from './normalize-options';

export function addProject(options: NormalizedSchema): Rule {
  return updateWorkspaceInTree((json) => {
    const architect: { [key: string]: any } = {};
    architect.build = {
      builder: '@vue/nuxt:build',
      options: {
        root: options.appProjectRoot,
        outputPath: join(normalize('dist'), options.appProjectRoot),
      },
    };

    architect.serve = {
      builder: '@vue/nuxt:serve',
      options: {
        root: options.appProjectRoot,
      },
    };

    architect.lint = generateProjectLint(
      normalize(options.appProjectRoot),
      join(normalize(options.appProjectRoot), 'tsconfig.json'),
      options.linter
    );

    json.projects[options.projectName] = {
      root: options.appProjectRoot,
      sourceRoot: options.appProjectRoot,
      projectType: 'application',
      schematics: {},
      architect,
    };

    json.defaultProject = json.defaultProject || options.projectName;

    return json;
  });
}
