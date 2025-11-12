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
    preserveEntrySignatures: 'exports-only',
    manualChunks(id) {
      if (id.includes('node_modules')) {
        const split = id.includes('\\') ? '\\' : '/';
        let name = id.split(`node_modules${split}`)[1];
        name = name.startsWith('@')
          ? name.split(split).slice(0, 2).join('/')
          : name.split(split)[0];
        return 'vendor/' + name;
      }
    },
  },
  external: (id) => {
    // Treat tslib as external by module name
    if (
      id === 'tslib' ||
      id === 'flatpickr' ||
      id.startsWith('flatpickr/') ||
      id.startsWith('prismjs')
    )
      return true;
    // Do NOT treat SVG imports as external
    if (id.endsWith('.svg')) return false;
    // Treat all other node_modules as external
  },
  treeshake: {
    moduleSideEffects: 'no-external',
  },
  plugins: [
    del({ targets: 'dist/*' }),
    multiInput(),
    resolve({ browser: true, preferBuiltins: false }),
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

function removeQueryParams() {
  return {
    name: 'remove-query-params',
    resolveId: {
      handler(source, importer) {
        if (source?.includes('?inline')) {
          const cleaned = source.replace(/\?.*$/, '');
          const abs = importer
            ? node_path.resolve(node_path.dirname(importer), cleaned)
            : node_path.resolve(cleaned);
          return { id: abs };
        }
        return null;
      },
    },
  };
}
