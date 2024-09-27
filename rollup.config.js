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
        return 'vendor';
      }
    },
  },
  external: [/shidoka-foundation\/components/],
  plugins: [
    del({ targets: 'dist/*' }),
    multiInput(),
    resolve(),
    copy({
      targets: [
        { src: 'package.json', dest: 'dist' },
        { src: 'README.md', dest: 'dist' },
        { src: 'src/common/scss', dest: 'dist/common' },
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
