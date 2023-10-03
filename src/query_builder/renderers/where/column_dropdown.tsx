import { Autocomplete, TextField } from '@mui/material'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { OrmaSchema } from 'orma'
import { get_field_names } from 'orma/build/helpers/schema_helpers'
import { Query } from '../subquery'

export const ColumnDropdown = observer(
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
