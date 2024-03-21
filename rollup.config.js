import multiInput from 'rollup-plugin-multi-input';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import del from 'rollup-plugin-delete';
import typescript from 'rollup-plugin-typescript2';
import renameNodeModules from 'rollup-plugin-rename-node-modules';
import postcss from 'rollup-plugin-postcss';
import litcss from 'rollup-plugin-postcss-lit';
import InlineSvg from 'rollup-plugin-inline-svg';
import copy from 'rollup-plugin-copy';
import image from '@rollup/plugin-image';
// import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  input: ['./src/**/index.ts'],
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
  external: [/shidoka-foundation\/components/],
  plugins: [
    del({ targets: 'dist/*' }),
    multiInput.default(),
    resolve({ dedupe: ['@lit/reactive-element', 'lit-html'] }),
    renameNodeModules(),
    image(),
    // peerDepsExternal(),
    copy({
      targets: [
        { src: 'package.json', dest: 'dist' },
        { src: 'README.md', dest: 'dist' },
      ],
    }),
    InlineSvg(),
    typescript(),
    postcss({
      inject: false,
    }),
    litcss(),
    terser(),
  ],
};
