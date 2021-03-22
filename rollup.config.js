import path from 'path';
import analyzer from "rollup-plugin-analyzer";
import angular from 'rollup-plugin-angular';
import alias from '@rollup/plugin-alias';
import commonjs from "@rollup/plugin-commonjs";
import copy from 'rollup-plugin-copy';
import progress from "rollup-plugin-progress";
import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import dev from 'rollup-plugin-dev';

const projectRootDir = path.resolve(__dirname);

let baseConfig = {
  input: 'src/wrapper-wc.ts',
  output: {
    dir: 'dist/webc',
    format: 'esm',
    indent: false,
    sourcemap: true
  },
  watch: {
    include: 'src/**'
  }
};
let config
if (process.env.NODE_ENV === 'prod') {
  config = Object.assign(baseConfig, {
    plugins: [
      progress(),
      copy({
        targets: [
          { src: 'src/index.html', dest: 'dist/webc' }
        ]
      }),
      alias({
        entries: [
          { find: /^@\/(.*)/, replacement: path.resolve(projectRootDir, 'src/$1') }
        ]
      }),
      angular({
        replace: true,
        preprocessors: {
          template: htmlPreprocessor,
          style: stylePreprocessor
        }
      }),
      typescript(),
      resolve({ jsnext: true, main: true }),
      commonjs(),
      terser({
        compress: {
          pure_getters: true,
          unsafe: false,
          unsafe_comps: false,
          warnings: false
        }
      }),
      sourcemaps(),
      analyzer()
    ]
  });
} else {
  config = Object.assign(baseConfig,{
    plugins: [
      progress(),
      copy({
        targets: [
          { src: 'src/index.html', dest: 'dist/webc' }
        ]
      }),
      alias({
        entries: [
          { find: /^@\/(.*)/, replacement: path.resolve(projectRootDir, 'src/$1') }
        ]
      }),
      angular({
        replace: true,
        preprocessors: {
        }
      }),
      typescript(),
      resolve({ jsnext: true, main: true }),
      commonjs(),
      sourcemaps(),
      dev({
        dirs: ['dist/webc'],
        port: 8000,
      })
    ]
  });
}

export default config;
