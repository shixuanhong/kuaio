import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

const libFileName = 'kuaio'

export default [
  {
    input: 'src/index.ts',
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
    plugins: [typescript()]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: `dist/${libFileName}.umd.min.js`,
        format: 'umd',
        name: 'Kuaio'
      }
    ],
    plugins: [typescript(), terser()]
  }
]
