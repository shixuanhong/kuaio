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
Kuaio.on('a', (e) => {
  console.log('a', e)
})

// Key Combination
Kuaio.on('Ctrl + a', (e) => {
  console.log('Ctrl + a', e)
})
Kuaio.on('Ctrl + Alt + a', (e) => {
  console.log('Ctrl + Alt + a', e)
})
Kuaio.on('q, w, e, r', (e) => {
  console.log('q, w, e, r', e)
})
Kuaio.on(
  'Ctrl + k, Ctrl + c',
  (e) => {
    console.log('Ctrl + k, Ctrl + c', e)
  },
  {
    preventDefault: true
  }
)
