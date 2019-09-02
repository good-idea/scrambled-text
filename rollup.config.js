import typescript from 'rollup-plugin-typescript2'

import commonjs from 'rollup-plugin-commonjs'

import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    sizeSnapshot(),
    commonjs,
    typescript({
      typescript: require('typescript'),
    }),
  ],
}
