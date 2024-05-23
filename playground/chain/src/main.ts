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
Kuaio.create()
  .A()
  .bind((e) => {
    console.log('a', e)
  })

// Key Combination
Kuaio.create()
  .Ctrl()
  .A()
  .bind((e) => {
    console.log('Ctrl + a', e)
  })

Kuaio.create()
  .Ctrl()
  .Alt()
  .A()
  .bind((e) => {
    console.log('Ctrl + Alt + a', e)
  })

Kuaio.create()
  .Q()
  // Set timeout. Pressing the next key within this time will continue listening to the sequence, otherwise it will stop.
  .after(1000)
  .W()
  .after()
  .E()
  .after()
  .R()
  .bind((e) => {
    console.log('q, w, e, r', e)
  })

Kuaio.create()
  .prventDefault()
  .Ctrl()
  .K()
  .after()
  .Ctrl()
  .C()
  .bind((e) => {
    console.log('Ctrl + k, Ctrl + c', e)
  })
