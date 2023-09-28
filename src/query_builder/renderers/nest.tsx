import { Autocomplete, TextField, Typography } from '@mui/material'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Query, Subquery } from './subquery'
import { OrmaSchema } from 'orma'
import { container_style } from './pagination'

export const Nest = observer(
    ({
        subquery,
        parent_name,
        orma_schema
    }: {
        subquery: Query
        parent_name: string
        orma_schema: OrmaSchema
    }) => {
        return (
            <div style={container_style}>
                <Typography>Nest</Typography>
                <Subquery subquery={subquery} orma_schema={orma_schema} parent_name={parent_name} />
            </div>
        )
    }
)
