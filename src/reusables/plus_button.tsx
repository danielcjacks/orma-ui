import { IconButton } from "@mui/material"
import { observer } from "mobx-react-lite"
import React from "react"

/**
 * Material UI add icon
 */
const AddIcon = () => <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />

export const PlusButton = observer(
  (props: React.ComponentProps<typeof IconButton>) => {
    return (
      <IconButton
        style={{
          border: "2px dashed grey",
          borderRadius: "0px",
        }}
        size="large"
        {...props}
      >
        <AddIcon />
      </IconButton>
    )
  }
)
