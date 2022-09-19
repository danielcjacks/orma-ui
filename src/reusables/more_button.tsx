import { IconButton, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import React from "react"

/**
 * Material UI add icon
 */
const MoreIcon = () => (
    <svg viewBox='0 0 24 24' color='white' fill='currentcolor' width='1.3rem' height='1.3rem'>
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
)

export const MoreButton = observer(
  (props: React.ComponentProps<typeof IconButton>) => {
    return (
      <IconButton size="medium" {...props}>
        <MoreIcon />
      </IconButton>
    )
  }
)
