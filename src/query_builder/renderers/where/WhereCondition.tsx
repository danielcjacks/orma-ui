import { Autocomplete, IconButton, TextField } from '@mui/material'
import { action, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { OrmaSchema } from 'orma'
import { get_field_names } from 'orma/build/helpers/schema_helpers'
import { MdClose } from 'react-icons/md'
import { Query } from '../subquery'

export const operators = {
    $eq: '=',
    $gt: '>',
    $gte: '>=',
    $lt: '<',
    $lte: '<=',
    $like: 'like'
} as Record<string, string>

export const connectives = {
    $and: 'And',
    $or: 'Or',
    $any_path: 'Any'
} as Record<string, string>

const operator_options = Object.keys(operators)
const connective_options = Object.keys(connectives)
export const is_operator = (option: any) => operator_options.includes(option)
export const is_connective = (option: any) => connective_options.includes(option)

export const WhereConditionRow = observer(
    ({
        condition_subquery,
        entity,
        schema,
        onClose
    }: {
        condition_subquery: Query
        entity: string
        schema: OrmaSchema
        onClose: () => void
    }) => {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}
            >
                <ConditionFields
                    entity={entity}
                    condition_subquery={condition_subquery}
                    schema={schema}
                />

                <IconButton onClick={onClose}>
                    <MdClose />
                </IconButton>
            </div>
        )
    }
)

const ConditionFields = observer(
    ({
        condition_subquery,
        entity,
        schema
    }: {
        condition_subquery: Query
        entity: string
        schema: OrmaSchema
    }) => {
        return (
            <>
                <ChooseColumn
                    condition_subquery={condition_subquery}
                    entity={entity}
                    schema={schema}
                />
                <OperatorDropdown condition_subquery={condition_subquery} />

                <ValueTextField condition_subquery={condition_subquery} />
            </>
        )
    }
)

const ChooseColumn = observer(
    ({
        entity,
        condition_subquery,
        schema
    }: {
        condition_subquery: Query
        entity: string
        schema: OrmaSchema
    }) => {
        const clause_type = Object.keys(condition_subquery)[0]
        const field_names = get_field_names(entity, schema)

        const value = condition_subquery[clause_type][0]

        return (
            <Autocomplete
                disablePortal
                disableClearable={true}
                freeSolo={false}
                options={field_names}
                style={{ width: '200px' }}
                renderInput={params => (
                    <TextField {...params} label='Column' size='small' style={{ width: '200px' }} />
                )}
                // inputValue={value || ''}
                // onInputChange={(e, value) => set_value(value)}

                value={value || ''}
                onChange={(e: any, option: any) => {
                    runInAction(() => {
                        if (!condition_subquery[clause_type]) {
                            condition_subquery[clause_type] = [null, { $escape: null }]
                        }

                        if (!condition_subquery[clause_type][0]) {
                            condition_subquery[clause_type][0] = null
                        }

                        if (option) {
                            condition_subquery[clause_type][0] = option
                        }
                    })
                    return
                }}
            />
        )
    }
)

const cleanup_obj = (obj: any) => {
    Object.keys(obj).forEach(key => {
        delete obj[key]
    })
}

const handleOperatorChange = action((prev: string, next: string, condition_subquery: Query) => {
    if (!next) {
        return
    }

    const switching_from_operator = is_operator(prev)
    const switching_to_operator = is_operator(next)
    const prev_value = condition_subquery[prev]

    cleanup_obj(condition_subquery)

    // eg when switching from $eq to $gt
    if (switching_from_operator && switching_to_operator) {
        // same nest just change the operator
        condition_subquery[next] = prev_value
    }

    // eg when switching from $and to $or
    else if (!switching_from_operator && !switching_to_operator) {
        // same nest just change the connective
        condition_subquery[next] = prev_value
    }

    // eg when switching from $and to $eq
    else if (!switching_from_operator && switching_to_operator) {
        // remove one layer of nesting
        condition_subquery[next] = prev_value?.[0]
    }

    // eg when switching from $eq to $and
    else if (switching_from_operator && !switching_to_operator) {
        // wrap in one layer of nesting
        condition_subquery[next] = [{ [prev]: prev_value }]
    }
})

const OperatorDropdown = observer(({ condition_subquery }: { condition_subquery: Query }) => {
    const clause_type = Object.keys(condition_subquery)[0]
    const options = [...operator_options, ...connective_options]
    return (
        <Autocomplete
            disablePortal
            disableClearable={true}
            freeSolo={false}
            options={options}
            getOptionLabel={option =>
                is_operator(option) ? operators[option] : connectives[option]
            }
            style={{ width: '200px' }}
            renderInput={params => (
                <TextField {...params} label='Operator' size='small' style={{ width: '200px' }} />
            )}
            // inputValue={value}
            // onInputChange={(e, value) => set_value(value)}
            groupBy={option => (is_operator(option) ? 'Operators' : 'Connectives')}
            value={clause_type}
            onChange={(e: any, option: string) =>
                handleOperatorChange(clause_type, option, condition_subquery)
            }
        />
    )
})

const ValueTextField = observer(({ condition_subquery }: { condition_subquery: Query }) => {
    const clause_type = Object.keys(condition_subquery)[0]
    return (
        <TextField
            size='small'
            style={{ width: '200px' }}
            label='Value'
            value={condition_subquery[clause_type]?.[1]?.$escape || ''}
            onChange={action(e => {
                if (!condition_subquery[clause_type]) {
                    condition_subquery[clause_type] = [null, { $escape: null }]
                }

                if (!condition_subquery[clause_type][1]) {
                    condition_subquery[clause_type][1] = { $escape: null }
                }

                condition_subquery.$where[clause_type][1].$escape = e.target.value
            })}
        />
    )
})
