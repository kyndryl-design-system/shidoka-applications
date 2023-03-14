import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import litcss from 'rollup-plugin-postcss-lit';
import InlineSvg from 'rollup-plugin-inline-svg';
import copy from 'rollup-plugin-copy';

export default {
  input: './src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    preserveModules: true,
    preserveModulesRoot: 'src',
    sourcemap: true,
  },
  external: [/node_modules/],
  plugins: [
    del({ targets: 'dist/*' }),
    resolve(),
    copy({
      targets: [
        { src: 'package.json', dest: 'dist' },
        { src: 'README.md', dest: 'dist' },
        { src: 'src/root.css', dest: 'dist' },
        { src: 'src/assets', dest: 'dist' },
      ],
    }),
    InlineSvg(),
    typescript(),
    postcss(),
    litcss(),
    terser(),
  ],
};
