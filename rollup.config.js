import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import pkg from './package.json'

import analyze from 'rollup-plugin-analyzer'

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    'lodash/fp/identity',
    'lodash/fp/split',
    'lodash/fp/flow',
    'lodash/fp/filter',
    'lodash/fp/slice',
    'lodash/fp/reverse',
  ],
  plugins: [
    sizeSnapshot(),
    process.env.ANALYZE ? analyze() : null,
    commonjs,
    typescript({
      typescript: require('typescript'),
    }),
  ].filter(Boolean),
}
