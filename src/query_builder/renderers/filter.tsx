import { observer } from 'mobx-react-lite'
import { container_style } from './pagination'
import { Typography } from '@mui/material'

export const Filter = observer(() => {
    return (
        <div style={container_style}>
            <Typography>Filter</Typography>
            Group By Order By Where Where Connected Having
        </div>
    )
})
