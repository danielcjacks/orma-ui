import { observer } from 'mobx-react-lite'
import { Query } from '../subquery'
import { OrmaSchema } from 'orma'
import { get_all_edges, get_child_edges, get_parent_edges } from 'orma/build/helpers/schema_helpers'
import { get_direct_edges } from 'orma/src/helpers/schema_helpers'
import { last, uniq } from 'ramda'
import { Autocomplete, Box, Chip, Grid, MenuItem, TextField } from '@mui/material'
import { action, runInAction, toJS } from 'mobx'
import { title_case } from '../../../helpers/helpers'
import { Fragment, useState } from 'react'
import { MdChevronRight } from 'react-icons/md'

const get_edges = (entity_name: string, schema: OrmaSchema) => {
    const parent_edges = get_parent_edges(entity_name, schema)
    const child_edges = get_child_edges(entity_name, schema)
    return [...parent_edges, ...child_edges]
}

// gets a list of valid edge entities for a 'nested' clause type, for example an any clause.
// Some edge entities are invalid if they are not connected, or if they have already been used in this clause
export const get_nested_path_edge_tables = (path: any[], entity: string, schema: OrmaSchema) => {
    const edges = path.length === 0 ? get_all_edges(entity, schema) : get_edges(last(path), schema)

    const edge_tables = edges
        .map(el => el.to_entity)
        .filter(entity_name => !path.includes(entity_name))

    return edge_tables
}

export const AnyPath = observer(
    ({
        path,
        entity,
        schema,
        onChange
    }: {
        path: any
        entity: string
        schema: OrmaSchema
        onChange: Function
    }) => {
        const edge_tables = get_nested_path_edge_tables(path, entity, schema)
        const options = uniq(edge_tables)

        const [value, set_value] = useState(null) // doesn't do anything but makes autocomplete not have text after a select

        return (
            <>
                <div
                    style={{
                        display: 'flex',
                        placeItems: 'center',
                        gap: '8px'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            placeItems: 'center'
                        }}
                    >
                        {path.map((table_name: string, i: number) => (
                            <Fragment key={i}>
                                <Chip
                                    label={title_case(table_name)}
                                    onDelete={
                                        i === path.length - 1
                                            ? action(e => {
                                                  path.splice(i, 1)
                                                  onChange()
                                              })
                                            : undefined
                                    }
                                />

                                {i !== path.length - 1 && <MdChevronRight />}
                            </Fragment>
                        ))}
                    </div>
                    {options.length > 0 && (
                        <Autocomplete
                            disablePortal
                            disableClearable={true}
                            freeSolo={false}
                            options={options}
                            style={{ width: '200px' }}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label='Table'
                                    size='small'
                                    style={{ width: '200px' }}
                                />
                            )}
                            inputValue={value || ''}
                            onInputChange={(e, value) => {}}
                            getOptionLabel={option => title_case(option)}
                            value={value}
                            onChange={(e: any, option: any) => {
                                onChange()
                                runInAction(() => {
                                    const new_nested_path = [...path, option]
                                    path.splice(0, path.length, ...new_nested_path)
                                })
                                return
                            }}
                        />
                    )}
                </div>
            </>
        )
    }
)
