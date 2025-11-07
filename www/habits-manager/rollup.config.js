import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';

const production = !process.env.ROLLUP_WATCH;

const createConfig = (cardName, isLast = false) => ({
  input: `src/cards/${cardName}.ts`,
  output: {
    file: `dist/${cardName}.js`,
    format: 'es',
    sourcemap: !production,
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      sourceMap: !production,
    }),
    production && terser({
      format: {
        comments: false,
      },
      compress: {
        drop_console: false, // Keep console.log for debugging
      },
    }),
    // Copy all dist files after the last card is built
    isLast && copy({
      targets: [
        { src: 'dist/*', dest: '../../custom_components/habits_manager/www' }
      ],
      hook: 'writeBundle'
    })
  ].filter(Boolean),
  onwarn(warning, warn) {
    // Suppress certain warnings
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning);
  },
});

export default [
  createConfig('habits-manager-card'),
  createConfig('habits-supervision-card'),
  createConfig('habits-child-card', true), // Copy after last card
];
