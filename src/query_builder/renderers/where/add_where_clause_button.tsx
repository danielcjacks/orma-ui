import { IconButton } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { MdAdd } from 'react-icons/md'

export const AddWhereClauseButton = observer(({ on_click }: { on_click: () => void }) => (
    <IconButton
        style={{ border: '2px dashed grey', borderRadius: '0px', width: '60px' }}
        onClick={on_click}
        size='large'
    >
        <MdAdd />
    </IconButton>
))
