import { Autocomplete, TextField } from '@mui/material'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Query } from './subquery'
import { title_case } from '../../helpers/helpers'

export const AddEntity = observer(
    ({
        subquery,
        nestable_entities,
        entity
    }: {
        subquery: Query
        nestable_entities: string[]
        entity: string
    }) => {
        const [value, set_value] = useState('')

        return (
            <Autocomplete
                disablePortal
                options={nestable_entities}
                style={{ width: '250px' }}
                renderInput={params => (
                    <TextField
                        {...params}
                        label={
                            <div>
                                Add to <span>{title_case(entity)}</span>
                            </div>
                        }
                        size='small'
                        style={{ width: '250px' }}
                    />
                )}
                inputValue={value}
                onInputChange={(e, value) => set_value(value)}
                getOptionLabel={option => title_case(option)}
                value={null}
                onChange={(e, option) =>
                    runInAction(() => {
                        if (option) {
                            subquery[option] = {}
                            set_value('')
                        }
                    })
                }
            />
        )
    }
)
