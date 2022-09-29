import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './App'
import { TxChartWidget } from './TxChartWidget'
import { wasmFolder } from '@hpcc-js/wasm'

wasmFolder('https://cdn.jsdelivr.net/npm/@hpcc-js/wasm/dist/')

const injectMap = [
  {
    slot: document.querySelectorAll(
      '#ContentPlaceHolder1_maintable>.row.mb-4',
    )[6],
    widget: <TxChartWidget />,
  },
]

injectMap.forEach((inject) => {
  const stage = document.createElement('div')
  inject.slot.appendChild(stage)
  stage.style.width = '100%'
  stage.style.overflow = 'auto'

  ReactDOM.render(<App widget={inject.widget} />, stage)
})
