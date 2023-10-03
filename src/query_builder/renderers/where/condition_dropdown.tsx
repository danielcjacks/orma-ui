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
import { action } from 'mobx'

const cleanup_obj = (obj: any) => {
    Object.keys(obj).forEach(key => {
        delete obj[key]
    })
}

export const handleOperatorChange = action(
    (prev: string, next: string, condition_subquery: Query) => {
        if (!next) {
            return
        }

        const switching_from_condition = is_condition(prev)
        const switching_to_condition = is_condition(next)
        const prev_value = condition_subquery[prev]

        cleanup_obj(condition_subquery)

        // eg when switching from $eq to $gt
        if (switching_from_condition && switching_to_condition) {
            // same nest just change the condition
            condition_subquery[next] = prev_value
        }

        // eg when switching from $and to $or
        else if (!switching_from_condition && !switching_to_condition) {
            // same nest just change the connective
            condition_subquery[next] = prev_value
        }

        // eg when switching from $and to $eq
        else if (!switching_from_condition && switching_to_condition) {
            // remove one layer of nesting
            condition_subquery[next] = prev_value?.[0]
        }

        // eg when switching from $eq to $and
        else if (switching_from_condition && !switching_to_condition) {
            // wrap in one layer of nesting
            condition_subquery[next] = [{ [prev]: prev_value }]
        }
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
