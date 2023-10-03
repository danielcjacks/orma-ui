import { observer } from 'mobx-react-lite'
import { OrmaSchema } from 'orma'
import { get_field_names } from 'orma/build/helpers/schema_helpers'
import { last } from 'ramda'
import { Query } from './subquery'
import { Autocomplete, Box, Chip, Grid, MenuItem, TextField, Typography } from '@mui/material'
import { title_case } from '../../helpers/helpers'
import { action, runInAction } from 'mobx'
import { container_style } from './pagination'
import { useState } from 'react'

export const GroupBy = observer(
    ({
        entity_subquery,
        schema,
        entity
    }: {
        entity_subquery: Query
        schema: OrmaSchema
        entity: string
    }) => {
        const group_bys: string[] = entity_subquery.$group_by ?? []
        const [value, set_value] = useState(null)
        const possible_fields = get_field_names(entity, schema).filter(el => {
            return !group_bys.includes(el)
        })

        return (
            <div style={container_style}>
                <Typography>Group By</Typography>

                <Grid container alignItems='center'>
                    {group_bys.map((group_by: string, i: number) => (
                        <Grid item key={i}>
                            <Box paddingRight={1}>
                                <Chip
                                    label={title_case(group_by)}
                                    onDelete={action(e => {
                                        group_bys.splice(i, 1)
                                        if (group_bys.length === 0) {
                                            delete entity_subquery.$group_by
                                        }
                                    })}
                                />
                            </Box>
                        </Grid>
                    ))}
                    <Grid item>
                        {possible_fields.length > 0 && (
                            <Autocomplete
                                disablePortal
                                disableClearable={true}
                                freeSolo={false}
                                options={possible_fields}
                                style={{ width: '200px' }}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label='Column'
                                        size='small'
                                        style={{ width: '200px' }}
                                    />
                                )}
                                inputValue={value || ''}
                                onInputChange={(e, value) => {}}
                                getOptionLabel={option => title_case(option)}
                                value={value}
                                onChange={(e: any, option: any) => {
                                    runInAction(() => {
                                        if (!option) return
                                        if (!entity_subquery.$group_by) {
                                            entity_subquery.$group_by = []
                                        }
                                        entity_subquery.$group_by.push(option)
                                    })
                                    return
                                }}
                            />
                        )}
                    </Grid>
                </Grid>
            </div>
        )
    }
)
