import { Autocomplete, TextField } from '@mui/material'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Query } from './subquery'

export const AddEntity = observer(
    ({ subquery, nestable_entities }: { subquery: Query; nestable_entities: string[] }) => {
        const [value, set_value] = useState('')

        return (
            <Autocomplete
                disablePortal
                options={nestable_entities}
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
                            subquery[option] = {}
                            set_value('')
                        }
                    })
                }
            />
        )
    }
)
