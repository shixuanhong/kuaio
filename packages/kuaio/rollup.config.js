import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

const libFileName = 'kuaio'

export default [
  // Development builds
  {
    input: 'src/index.ts',
    output: [
      { file: `dist/${libFileName}.cjs.js`, format: 'cjs' },
      { file: `dist/${libFileName}.esm.js`, format: 'esm' },
      { 
        file: `dist/${libFileName}.umd.js`, 
        format: 'umd', 
        name: 'KuaioJS',
        exports: 'named'
      }
    ],
    plugins: [typescript()]
  },
  // Production builds
  {
    input: 'src/index.ts',
    output: [
      { file: `dist/${libFileName}.cjs.prod.js`, format: 'cjs' },
      { file: `dist/${libFileName}.esm.prod.js`, format: 'esm' },
      { 
        file: `dist/${libFileName}.umd.prod.js`, 
        format: 'umd', 
        name: 'KuaioJS',
        exports: 'named'
      }
    ],
    plugins: [typescript(), terser()]
  }
]
