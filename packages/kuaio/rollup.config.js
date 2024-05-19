import { babel } from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'

const libFileName = 'kuaio'

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: `dist/${libFileName}.cjs`,
        format: 'cjs'
      },
      {
        file: `dist/${libFileName}.mjs`,
        format: 'esm'
      },
      {
        file: `dist/${libFileName}.umd.js`,
        format: 'umd',
        name: 'Kuaio'
      }
    ],
    plugins: [babel({ babelHelpers: 'bundled' })]
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: `dist/${libFileName}.umd.min.js`,
        format: 'umd',
        name: 'Kuaio'
      }
    ],
    plugins: [babel({ babelHelpers: 'bundled' }), terser()]
  }
]
