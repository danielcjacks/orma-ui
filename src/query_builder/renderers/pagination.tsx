import { Typography } from '@mui/material'
import { NumberField, get_number_width_style, get_text_field_props } from '../number_field'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'

export const container_style = {
    display: 'grid',
    gridTemplateColumns: '80px 1fr',
    gap: '10px',
    marginTop: '20px'
}
export const Pagination = observer(({ parent }: { parent: Record<any, any> }) => {
    return (
        <div style={container_style}>
            <Typography>Pagination</Typography>
            <div
                style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center'
                }}
            >
                <NumberField
                    {...get_text_field_props(parent, '$offset')}
                    fullWidth={false}
                    label='Offset'
                    inputProps={{ min: 0 }}
                    style={{ width: '150px' }}
                    onChange={action(e => {
                        if (e.target.value === '') {
                            delete parent['$offset']
                            return
                        }

                        parent['$offset'] = Number(e.target.value)
                    })}
                />
                <NumberField
                    {...get_text_field_props(parent, '$limit')}
                    fullWidth={false}
                    label='Limit'
                    inputProps={{ min: 0 }}
                    style={{ width: '150px' }}
                    onChange={action(e => {
                        if (e.target.value === '') {
                            delete parent['$limit']
                            return
                        }
                        parent['$limit'] = Number(e.target.value)
                    })}
                />
            </div>
        </div>
    )
})
