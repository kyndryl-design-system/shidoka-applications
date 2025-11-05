import path from 'path';
import node_path from 'node:path';
import multiInput from 'rollup-plugin-multi-input';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import del from 'rollup-plugin-delete';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import postcssLit from 'rollup-plugin-postcss-lit';
import InlineSvg from 'rollup-plugin-inline-svg';
import copy from 'rollup-plugin-copy';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: [
    './src/index.ts',
    './src/common/**/*.ts',
    './src/components/**/!(*.stories|*.sample).ts',
  ],
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
    manualChunks(id) {
      if (id.includes('node_modules')) {
        let splitChar = id.includes('\\') ? '\\' : '/';
        let moduleName = id.split(`node_modules${splitChar}`)[1];

        if (moduleName.includes('@')) {
          moduleName =
            moduleName.split(splitChar)[0] +
            '/' +
            moduleName.split(splitChar)[1];
        } else {
          moduleName = moduleName.split(splitChar)[0];
        }
        return 'vendor/' + moduleName;
      }
    },
  },
  external: (id) => {
    // Treat tslib as external by module name
    if (id === 'tslib') return true;
    // Do NOT treat SVG imports as external
    if (id.endsWith('.svg')) return false;
    // Treat all other node_modules as external
    return id.includes('node_modules');
  },
  plugins: [
    del({ targets: 'dist/*' }),
    multiInput(),
    resolve(),
    copy({
      targets: [
        { src: 'package.json', dest: 'dist' },
        { src: 'README.md', dest: 'dist' },
        { src: 'LICENSE', dest: 'dist' },
        { src: 'src/common/scss', dest: 'dist/common' },
        { src: 'src/common/assets', dest: 'dist/common' },
      ],
    }),
    InlineSvg(),
    typescript(),
    postcss({
      use: [
        [
          'sass',
          {
            includePaths: [path.resolve('node_modules')],
          },
        ],
      ],
      inject: false,
    }),
    postcssLit(),
    commonjs(),
    json(),
    terser(),
    removeQueryParams(),
  ],
};

// remove query params from imports so they don't break the build
function removeQueryParams() {
  return {
    name: 'remove-query-params',
    resolveId: {
      handler(source, importer) {
        if (source?.includes('?inline')) {
          const removedFromPath = source.replace(/\?.*$/, '');
          let path = importer
            ? node_path.resolve(node_path.dirname(importer), removedFromPath)
            : node_path.resolve(removedFromPath);

          return { id: path };
        }
        return null;
      },
    },
  };
}
