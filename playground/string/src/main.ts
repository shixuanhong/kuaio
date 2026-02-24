import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import Kuaio from 'kuaio'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

// Single Key
Kuaio.createSync()
  .define('A')
  .on((e) => {
    console.log('A', e)
  })

// Key Combination
Kuaio.createSync()
  .define('Ctrl + A')
  .on((e) => {
    console.log('Ctrl + A', e)
  })
Kuaio.createSync({ preventDefault: true })
  .define('Ctrl + Shift + A')
  .on((e) => {
    console.log('Ctrl + Shift + A', e)
  })
Kuaio.createSync()
  .define('Q, W, E, R')
  .on((e) => {
    console.log('Q, W, E, R', e)
  })
Kuaio.createSync()
  .define('Ctrl + K, Ctrl + C')
  .on((e) => {
    console.log('Ctrl + K, Ctrl + C', e)
  })
