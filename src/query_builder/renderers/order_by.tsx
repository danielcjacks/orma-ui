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
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md'

export const get_order_by_field = (order_by: any): string => {
    return order_by?.$asc ?? order_by?.$desc
}

export const swap_order_by_type = (order_by: any) => {
    if (order_by.$asc !== undefined) {
        order_by.$desc = order_by.$asc
        delete order_by.$asc
    } else {
        order_by.$asc = order_by.$desc
        delete order_by.$desc
    }
}
const size = 16
export const OrderBy = observer(
    ({
        entity_subquery,
        schema,
        entity
    }: {
        entity_subquery: Query
        schema: OrmaSchema
        entity: string
    }) => {
        const order_bys: string[] = entity_subquery.$order_by ?? []
        const [value, set_value] = useState(null)
        const possible_fields = get_field_names(entity, schema).filter(el => {
            return !order_bys.includes(el)
        })

        return (
            <div style={container_style}>
                <Typography>Order By</Typography>

                <div style={{ display: 'flex', placeItems: 'center', gap: '8px' }}>
                    {order_bys.map((order_by: any, i: number) => (
                        <div key={i}>
                            <Chip
                                label={
                                    <div
                                        style={{
                                            display: 'flex',
                                            placeItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        {order_by.$asc !== undefined ? (
                                            <MdArrowUpward size={size} />
                                        ) : (
                                            <MdArrowDownward size={size} />
                                        )}
                                        {title_case(get_order_by_field(order_by))}
                                    </div>
                                }
                                onDelete={action(e => {
                                    order_bys.splice(i, 1)
                                    if (order_bys.length === 0) {
                                        delete entity_subquery.$order_by
                                    }
                                })}
                                onClick={action((e: any) => swap_order_by_type(order_by))}
                            />
                        </div>
                    ))}

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
                                    if (!entity_subquery.$order_by) {
                                        entity_subquery.$order_by = []
                                    }
                                    entity_subquery.$order_by.push({ $asc: option })
                                })
                                return
                            }}
                        />
                    )}
                </div>
            </div>
        )
    }
)
