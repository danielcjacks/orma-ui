import { Autocomplete, TextField } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { Query } from '../subquery'
import {
    condition_options,
    connective_options,
    is_condition,
    conditions,
    connectives
} from './where_condition'
import { action, toJS } from 'mobx'
import { isNil } from 'ramda'

const cleanup_obj = (obj: any) => {
    Object.keys(obj).forEach(key => {
        delete obj[key]
    })
}

const clause_types = {
    condition: ['$eq', '$lt', '$gt', '$lte', '$gte', '$like'],
    connective: ['$and', '$or'],
    in: ['$in'],
    any_path: ['$any_path']
}

const get_clause_type = (clause: string) => {
    for (const [clause_type, clauses] of Object.entries(clause_types)) {
        if (clauses.includes(clause)) {
            return clause_type
        }
    }
    return 'none'
}

const clause_mappings = {
    condition: {
        condition: (from_object: any, new_clause: any, old_clause: any) => from_object[old_clause],
        in: (from_object: any, new_clause: any, old_clause: any) => {
            const array_elements: any = []
            if (!isNil(from_object[old_clause][1].$escape)) {
                array_elements.push(from_object[old_clause][1])
            }

            return [
                from_object[old_clause][0],
                { $escape: from_object[old_clause][1].$escape?.split(',') }
            ]
        },
        connective: (from_object: any, new_clause: any, old_clause: string) => [from_object],
        any_path: (from_object: any, new_clause: any) => [[], from_object]
    },
    in: {
        in: (from_object: any, new_clause: any, old_clause: any) => from_object[old_clause],
        // array -> simple is a lossy mapping
        condition: (
            from_object: { [x: string]: any[] },
            new_clause: any,
            old_clause: string | number
        ) => [
            from_object[old_clause][0],
            { $escape: from_object?.[old_clause]?.[1]?.$escape?.join(', ') || '' }
        ],
        connective: (
            from_object: { [x: string]: any[] },
            new_clause: any,
            old_clause: string | number
        ) => [from_object],
        any_path: (from_object: any, new_clause: any) => [[], from_object]
    },
    connective: {
        connective: (from_object: any, new_clause: any, old_clause: any) => from_object[old_clause],
        any_path: (from_object: any, new_clause: any, old_clause: any) => [[], from_object]
        // none: (from_object: { [x: string]: any[] }, new_clause: any, old_clause: string | number) =>
        //     from_object[old_clause][0]
    },
    any_path: {
        any_path: (from_object: any, new_clause: any, old_clause: any) => from_object[old_clause],
        connective: (
            from_object: { [x: string]: any[] },
            new_clause: any,
            old_clause: string | number
        ) => [from_object[old_clause][1]]
        // none: (from_object: { [x: string]: any[] }, new_clause: any, old_clause: string | number) =>
        //     from_object[old_clause][1]
    }
} as any

export const handleOperatorChange = action(
    (prev: string, next: string, condition_subquery: Query) => {
        if (!next) {
            return
        }

        const prev_type = get_clause_type(prev)
        const next_type = get_clause_type(next)
        const new_value = clause_mappings?.[prev_type]?.[next_type]?.(
            toJS(condition_subquery),
            next,
            prev
        )

        cleanup_obj(condition_subquery)

        condition_subquery[next] = new_value
    }
)

export const OperatorDropdown = observer(
    ({ condition_subquery }: { condition_subquery: Query }) => {
        const clause_type = Object.keys(condition_subquery)[0]
        const options = [...condition_options, ...connective_options]
        return (
            <Autocomplete
                disablePortal
                disableClearable={true}
                freeSolo={false}
                options={options}
                getOptionLabel={option =>
                    is_condition(option) ? conditions[option] : connectives[option]
                }
                style={{ width: '130px' }}
                renderInput={params => (
                    <TextField
                        {...params}
                        label='Operator'
                        size='small'
                        style={{ width: '130px' }}
                    />
                )}
                // inputValue={value}
                // onInputChange={(e, value) => set_value(value)}
                groupBy={option => (is_condition(option) ? 'Operators' : 'Connectives')}
                value={clause_type}
                onChange={(e: any, option: string) =>
                    handleOperatorChange(clause_type, option, condition_subquery)
                }
            />
        )
    }
)
