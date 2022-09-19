import { Autocomplete, TextField } from '@mui/material'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { get_entity_names } from 'orma/build/helpers/schema_helpers'
import { OrmaSchema } from 'orma/build/introspector/introspector'
import React, { useState } from 'react'
import { filter_object, rename_key, title_case } from '../helpers/helpers'
import { test_schema } from '../test_schema'

export const QueryBuilderRoot = observer(
    ({
        query,
        orma_schema,
        extra_resolvers
    }: {
        query: Record<string, any>
        orma_schema: OrmaSchema
        extra_resolvers: QueryBuilderResolvers
    }) => {
        const possible_entities = get_entity_names(test_schema)
        const entity_resolvers = get_entity_resolvers(possible_entities)

        return <JsonObject resolvers={entity_resolvers} obj={query} orma_schema={orma_schema} />
    }
)

const get_entity_resolvers = (entity_names: string[]) => {
    const entity_resolvers = entity_names.reduce<QueryBuilderResolvers>((acc, entity) => {
        acc[entity] = {
            default: {},
            renderer: ({ orma_schema, value }) => (
                <Subquery value={value} orma_schema={orma_schema} entity_name={entity} />
            ),
            label: title_case(entity),
            converter: (obj, field) => rename_key(obj, field, entity)
        }
        return acc
    }, {})

    return entity_resolvers
}

const Subquery = observer(
    ({
        value,
        orma_schema,
        entity_name
    }: {
        value: Record<string, any>
        orma_schema: OrmaSchema
        entity_name: string
    }) => {
        return <>Subquery</>
    }
)

const get_possible_resolvers = (resolvers: QueryBuilderResolvers, obj: Record<string, any>) => {
    const existing_keys = Object.keys(obj)
    const possible_resolvers = filter_object(
        resolvers,
        (field, value) => !existing_keys.includes(field)
    )
    return possible_resolvers
}

const get_options = (resolvers: QueryBuilderResolvers) =>
    Object.keys(resolvers).map(field => get_option(resolvers, field))

const get_option = (resolvers: QueryBuilderResolvers, field: string) => {
    return {
        label: resolvers[field].label,
        field,
        resolver: resolvers[field]
    }
}

const JsonObject = observer(
    ({
        obj,
        resolvers,
        orma_schema
    }: {
        obj: Record<string, any>
        resolvers: QueryBuilderResolvers
        orma_schema: OrmaSchema
    }) => {
        return (
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) 3px 1fr',
                    gap: '8px'
                }}
            >
                {Object.keys(obj).map(field => {
                    const Renderer = resolvers[field].renderer

                    return (
                        <React.Fragment key={field}>
                            <JsonKeyEditor obj={obj} field={field} resolvers={resolvers} />
                            <div
                                style={{
                                    borderLeft: '2px solid grey',
                                    marginTop: '2px',
                                    marginBottom: '2px'
                                }}
                            />
                            <Renderer value={obj[field]} orma_schema={orma_schema} />
                        </React.Fragment>
                    )
                })}
                <JsonObjectAddKey obj={obj} resolvers={resolvers} />
            </div>
        )
    }
)

const JsonKeyEditor = observer(
    ({
        obj,
        field,
        resolvers
    }: {
        obj: Record<string, any>
        field: string
        resolvers: QueryBuilderResolvers
    }) => {
        // const [value, set_value] = useState("")
        const possible_resolvers = get_possible_resolvers(resolvers, obj)
        const options = get_options(possible_resolvers)

        return (
            <Autocomplete
                disablePortal
                options={options}
                renderInput={params => <TextField {...params} size='small' />}
                // inputValue={value}
                // onInputChange={(e, value) => set_value(value)}
                value={get_option(resolvers, field)}
                onChange={(e, option) =>
                    runInAction(() => {
                        if (option) {
                            option.resolver.converter(obj, field)
                        } else {
                            delete obj[field]
                        }
                    })
                }
            />
        )
    }
)

const JsonObjectAddKey = observer(
    ({ obj, resolvers }: { obj: Record<string, any>; resolvers: QueryBuilderResolvers }) => {
        const possible_resolvers = get_possible_resolvers(resolvers, obj)
        const options = get_options(possible_resolvers)

        const [value, set_value] = useState('')

        console.log(options)
        return (
            <Autocomplete
                disablePortal
                options={options}
                renderInput={params => <TextField {...params} label='Add' size='small' />}
                inputValue={value}
                onInputChange={(e, value) => set_value(value)}
                value={null}
                onChange={(e, option) =>
                    runInAction(() => {
                        if (option) {
                            obj[option.field] = option.resolver.default
                            set_value('')
                        }
                    })
                }
            />
        )
    }
)

export type QueryBuilderResolvers = {
    [field: string]: {
        renderer: React.ComponentType<{ orma_schema: OrmaSchema; value: any }>
        default: any
        label: string
        converter: (obj: Record<string, any>, field: string) => any
    }
}
