import { IconButton, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { MdClose } from 'react-icons/md'
import { title_case } from '../../helpers/helpers'
import { Query } from './subquery'

export const EntityName = observer(({ subquery, field }: { subquery: Query; field: string }) => {
    // const [value, set_value] = useState("")

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}
        >
            <Typography>{title_case(field)}</Typography>
            <IconButton
                onClick={() => {
                    delete subquery[field]
                }}
            >
                <MdClose />
            </IconButton>
        </div>

        // <Autocomplete
        //     style={{ width: '200px' }}
        //     disablePortal
        //     options={possible_entities}
        //     renderInput={params => (
        //         <TextField {...params} size='small' style={{ width: '200px' }} />
        //     )}
        //     // inputValue={value}
        //     // onInputChange={(e, value) => set_value(value)}
        //     value={field}
        //     onChange={(e, option) =>
        //         runInAction(() => {
        //             delete obj[field]

        //         })
        //     }
        // />
    )
})
