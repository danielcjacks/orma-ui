import {
    Autocomplete,
    Button,
    Checkbox,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    TextField,
    Tooltip,
    Typography
} from '@mui/material'
import { action, runInAction, toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { get_all_edges, get_entity_names, get_field_names } from 'orma/build/helpers/schema_helpers'
import { OrmaSchema } from 'orma/build/introspector/introspector'
import React, { useState } from 'react'
import { filter_object, rename_key, title_case } from '../helpers/helpers'
import { MoreButton } from '../reusables/more_button'
import { test_schema } from '../test_schema'

export const QueryBuilder = observer(
    ({
        query,
        orma_schema,
        extra_resolvers,
        is_root = true
    }: {
        query: Record<string, any>
        orma_schema: OrmaSchema
        extra_resolvers: QueryBuilderResolvers
        is_root: boolean
    }) => {
        const possible_entities = get_entity_names(test_schema)
        const entity_resolvers = get_entity_resolvers(possible_entities)

        return (
            <JsonObject>
                {Object.keys(query).map((field, i) => (
                    <JsonObjectRow key={field}>
                        <JsonKeyEditor obj={query} field={field} resolvers={entity_resolvers} />
                        <JsonObjectValue
                            obj={query}
                            field={field}
                            orma_schema={orma_schema}
                            resolvers={entity_resolvers}
                        />
                    </JsonObjectRow>
                ))}
                <JsonObjectAddKey obj={query} resolvers={entity_resolvers} />
            </JsonObject>
        )
    }
)

const Subquery = observer(
    ({
        value,
        orma_schema,
        entity
    }: {
        value: Record<string, any>
        orma_schema: OrmaSchema
        entity: string
    }) => {
        const possible_entities = get_all_edges(entity, orma_schema).map(el => el.to_entity)

        const entity_resolvers = get_entity_resolvers(possible_entities)
        const field_resolvers = get_field_resolvers(orma_schema, entity)
        const resolvers = { ...entity_resolvers, ...field_resolvers }

        return (
            <JsonObject>
                {Object.keys(value).map((field, i) => (
                    <JsonObjectRow key={field}>
                        <JsonKeyEditor obj={value} field={field} resolvers={resolvers} />
                        <JsonObjectValue
                            obj={value}
                            field={field}
                            orma_schema={orma_schema}
                            resolvers={resolvers}
                        />
                    </JsonObjectRow>
                ))}
                <JsonObjectAddKey obj={value} resolvers={resolvers} />
            </JsonObject>
        )
    }
)

const get_entity_resolvers = (entity_names: string[]) => {
    const entity_resolvers = entity_names.reduce<QueryBuilderResolvers>((acc, entity) => {
        acc[entity] = {
            default: {},
            renderer: ({ orma_schema, parent, field }) => (
                <Subquery orma_schema={orma_schema} value={parent[field]} entity={entity} />
            ),
            label: title_case(entity),
            converter: (obj, field) => rename_key(obj, field, entity),
            group: 'Entities'
        }
        return acc
    }, {})

    return entity_resolvers
}

const get_field_resolvers = (orma_schema: OrmaSchema, entity_name: string) => {
    const fields = get_field_names(entity_name, orma_schema)

    const resolvers = fields.reduce<QueryBuilderResolvers>((acc, field) => {
        acc[field] = {
            default: true,
            renderer: ({ orma_schema, parent, field }) => <Field parent={parent} field={field} />,
            label: title_case(field),
            converter: (obj, new_field) => rename_key(obj, field, new_field),
            group: 'Fields'
        }
        return acc
    }, {})

    return resolvers
}

const Field = observer(({ parent, field }: { parent: Record<string, any>; field: string }) => {
    const value = parent[field]
    const is_boolean = value === true || value === false
    // const is_

    return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {is_boolean && (
                <Checkbox
                    checked={value}
                    onChange={action(e => (parent[field] = e.target.checked))}
                />
            )}
            <Tooltip
                title={
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => {}}>
                                <ListItemText>Reset field</ListItemText>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemText>
                                <ListItemButton>Rename field</ListItemButton>
                            </ListItemText>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemText>
                                <ListItemButton>Use function</ListItemButton>
                            </ListItemText>
                        </ListItem>
                    </List>
                }
            >
                <MoreButton />
            </Tooltip>
        </span>
    )
})

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

const JsonObject = observer(({ children }: { children: React.ReactNode }) => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'min-content 3px 1fr',
                gap: '8px'
            }}
        >
            {children}
        </div>
    )
})

const JsonObjectRow = observer(({ children }: { children: [React.ReactNode, React.ReactNode] }) => {
    return (
        <>
            {children[0]}
            <div
                style={{
                    borderLeft: '2px solid grey',
                    marginTop: '2px',
                    marginBottom: '2px'
                }}
            />
            {children[1]}
        </>
    )
})

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
                style={{ width: '200px' }}
                disablePortal
                options={options}
                renderInput={params => (
                    <TextField {...params} size='small' style={{ width: '200px' }} />
                )}
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
                groupBy={option => option.resolver.group ?? ''}
            />
        )
    }
)

const JsonObjectValue = observer(
    ({
        obj,
        field,
        resolvers,
        orma_schema
    }: {
        obj: Record<string, any>
        field: string
        resolvers: QueryBuilderResolvers
        orma_schema: OrmaSchema
    }) => {
        const DefaultRenderer: QueryBuilderResolvers[string]['renderer'] = props => (
            <Typography color='textPrimary'>NOT IMPLEMENTED</Typography>
        )
        const Renderer = resolvers[field]?.renderer ?? DefaultRenderer

        console.log('t1', toJS(obj), field)
        return <Renderer orma_schema={orma_schema} parent={obj} field={field} />
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
                style={{ width: '200px' }}
                renderInput={params => (
                    <TextField {...params} label='Add' size='small' style={{ width: '200px' }} />
                )}
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
                groupBy={option => option.resolver.group ?? ''}
            />
        )
    }
)

export type QueryBuilderResolvers = {
    [field: string]: {
        renderer: React.ComponentType<{
            orma_schema: OrmaSchema
            parent: any
            field: any
        }>
        default: any
        label: string
        converter: (obj: Record<string, any>, field: any) => any
        group?: string
    }
}
