import { Autocomplete, TextField } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { Query } from '../subquery'
import { connective_options, connectives, is_condition, conditions } from './condition_dropdown'
import { handleConditionChange } from './condition_dropdown'

export const ConnectiveDropdown = observer(
    ({ condition_subquery }: { condition_subquery: Query }) => {
        const clause_type = Object.keys(condition_subquery)[0]
        const options = [...connective_options]
        return (
            <Autocomplete
                disablePortal
                disableClearable={true}
                freeSolo={false}
                options={options}
                getOptionLabel={option =>
                    is_condition(option) ? conditions[option] : connectives[option]
                }
                style={{ width: '200px' }}
                renderInput={params => (
                    <TextField
                        {...params}
                        // label='Condition'
                        size='small'
                        style={{ width: '200px' }}
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
