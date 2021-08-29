import { Placement } from "@popperjs/core"

export type Popover = {
  name: string
  placement: Placement
  anchor: HTMLElement
  render: () => React.ReactNode
  onDismiss?: () => void
  autoDismiss?: boolean
}
