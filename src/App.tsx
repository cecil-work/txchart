import * as React from 'react'
import { MantineProvider } from '@mantine/core'

interface Props {
  widget: React.ReactNode
}

class App extends React.Component<Props> {
  render() {
    const { widget } = this.props
    return (
      <MantineProvider withGlobalStyles withNormalizeCSS>
        {widget}
      </MantineProvider>
    )
  }
}

export default App
