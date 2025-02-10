import multiInput from 'rollup-plugin-multi-input';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import litcss from 'rollup-plugin-postcss-lit';
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
  plugins: [
    del({ targets: 'dist/*' }),
    multiInput(),
    resolve(),
    copy({
      targets: [
        { src: 'package.json', dest: 'dist' },
        { src: 'README.md', dest: 'dist' },
        { src: 'src/common/scss', dest: 'dist/common' },
        { src: 'src/common/assets', dest: 'dist/common' },
      ],
    }),
    InlineSvg(),
    typescript(),
    postcss({
      inject: false,
    }),
    litcss(),
    commonjs(),
    json(),
    terser(),
  ],
};
