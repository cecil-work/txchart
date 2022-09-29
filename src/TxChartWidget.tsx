import { Box, Center, NavLink, Paper, Text } from '@mantine/core'
import * as React from 'react'
import * as d3Graphviz from 'd3-graphviz'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'

interface Transfer {
  from: {
    address: string
    link: string
    name: string
    type: 'eoa' | 'contract'
  }
  to: {
    address: string
    link: string
    name: string
    type: 'eoa' | 'contract'
  }
  amount: string
  price: string
  token: {
    icon: string
    symbol: string
  }
}

export function TxChartWidget() {
  const transfersWrap = document.querySelectorAll('#wrapperContent')[1]
  const transfers = Array.from(
    transfersWrap.querySelectorAll('li .media-body'),
  ).map((mediaBody) => {
    let spanFrom, spanTo, spanAmount, buttonPrice, imgTokenIcon, aToken
    if (mediaBody.childNodes.length === 9) {
      ;[, spanFrom, , spanTo, , spanAmount, buttonPrice, imgTokenIcon, aToken] =
        mediaBody.childNodes
    } else if (mediaBody.childNodes.length === 8) {
      //no price tag
      ;[, spanFrom, , spanTo, , spanAmount, imgTokenIcon, aToken] =
        mediaBody.childNodes
    }

    return {
      from: {
        address: (
          spanFrom as HTMLElement
        ).firstElementChild?.firstElementChild?.outerHTML.match(/0x\w+/)?.[0],
        link: (
          (spanFrom as HTMLSpanElement).firstElementChild as HTMLAnchorElement
        ).href,
        name: (spanFrom as HTMLElement).firstElementChild?.firstElementChild
          ?.textContent,
        type: /^0x/.test((spanFrom as HTMLSpanElement).textContent ?? '')
          ? 'eoa'
          : 'contract',
      },
      to: {
        address: (
          spanTo as HTMLElement
        ).firstElementChild?.firstElementChild?.outerHTML.match(/0x\w+/)?.[0],
        link: (
          (spanTo as HTMLSpanElement).firstElementChild as HTMLAnchorElement
        ).href,
        name: (spanTo as HTMLElement).firstElementChild?.firstElementChild
          ?.textContent,
        type: /^0x/.test((spanTo as HTMLSpanElement).textContent ?? '')
          ? 'eoa'
          : 'contract',
      },
      amount: spanAmount?.textContent?.trim(),
      price: buttonPrice?.textContent,
      token: {
        icon: (imgTokenIcon as HTMLImageElement).src,
        symbol: (aToken?.textContent.match(/\((.+)?\)/)[1] + '').endsWith('...')
          ? aToken?.lastElementChild?.outerHTML.match(
              /data-original-title=\"(.+?)\"/,
            )?.[1]
          : aToken?.textContent.match(/\((.+)?\)/)[1],
      },
    }
  })
  const ref = useRef<HTMLDivElement>(null)

  const [rankdir, setRankdir] = useState('LR')

  const graphvizStr = `digraph "" {
    rankdir="${rankdir}"

    ${transfers
      .map((transfer) => [transfer.from, transfer.to])
      .flat()
      .map(
        (addr) => `
        "${addr.address}" [
          label="${
            addr.type === 'eoa' ? addr.name?.substring(0, 8) : addr.name
          }"
          tooltip="${addr.address}"
          shape="${addr.type === 'eoa' ? 'pentagon' : 'ellipse'}"
          style="filled"
          color="#464e5f"
          fontfamily="Verdana,sans-serif"
          fillcolor="#f8f9fa"
          fontcolor="#464e6f"
          href="${addr.link}"
          target="_blank"
        ];
      `,
      )
      .join('')}


      ${transfers
        .map(
          (transfer, idx) => `
            "${transfer.from.address}" -> "${transfer.to.address}"
            [
              dir="forward"
              class="transfer-${idx}"
              style="solid"
              color="#464e5f"
              label="${parseFloat(transfer.amount).toFixed(4)} ${
            transfer.token.symbol
          }"
              labeltooltip="${transfer.amount} ${transfer.token.symbol} ${
            transfer.price ?? ''
          }"
              labelhref="${transfer.from.link}"
              labeltarget="_blank"
            ];
          `,
        )
        .join('')}

  }
  `
  useEffect(() => {
    d3Graphviz.graphviz(ref.current).renderDot(graphvizStr).options({
      zoom: false,
      fit: false,
    })
  })
  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      <hr></hr>
      <div ref={ref}></div>
    </Box>
  )
}
