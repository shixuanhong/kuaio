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
    ]
  }
]
