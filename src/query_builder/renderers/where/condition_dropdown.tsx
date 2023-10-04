import { Autocomplete, TextField } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { Query } from '../subquery'

import { action, toJS } from 'mobx'
import { isNil } from 'ramda'

export const cleanup_obj = (obj: any) => {
    Object.keys(obj).forEach(key => {
        delete obj[key]
    })
}

export const conditions = {
    $eq: '=',
    $gt: '>',
    $gte: '>=',
    $lt: '<',
    $lte: '<=',
    $like: 'like',
    $in: 'in'
} as Record<string, string>

export const connectives = {
    $and: 'And',
    $or: 'Or',
    $any_path: 'Any Path',
    $not: 'Not'
} as Record<string, string>

const clause_types = {
    condition: ['$eq', '$lt', '$gt', '$lte', '$gte', '$like'],
    connective: ['$and', '$or'],
    in: ['$in'],
    any_path: ['$any_path'],
    not: ['$not']
}

export const condition_options = Object.keys(conditions)
export const connective_options = Object.keys(connectives)
export const is_condition = (option: any) => condition_options.includes(option)
export const is_connective = (option: any) => connective_options.includes(option)

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
        not: (from_object: any, new_clause: any, old_clause: any) => from_object,
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
        not: (from_object: any, new_clause: any, old_clause: any) => from_object,
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
        not: (from_object: any, new_clause: any, old_clause: any) => from_object,
        connective: (from_object: any, new_clause: any, old_clause: any) => from_object[old_clause],
        any_path: (from_object: any, new_clause: any, old_clause: any) => [[], from_object]
        // none: (from_object: { [x: string]: any[] }, new_clause: any, old_clause: string | number) =>
        //     from_object[old_clause][0]
    },
    any_path: {
        not: (from_object: any, new_clause: any, old_clause: any) => from_object,
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

export const handleConditionChange = action(
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

export const ConditionDropdown = observer(
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
                        label='Condition'
                        size='small'
                        style={{ width: '130px' }}
                    />
                )}
                // inputValue={value}
                // onInputChange={(e, value) => set_value(value)}
                groupBy={option => (is_condition(option) ? 'Conditions' : 'Connectives')}
                value={clause_type}
                onChange={(e: any, option: string) =>
                    handleConditionChange(clause_type, option, condition_subquery)
                }
            />
        )
    }
)
