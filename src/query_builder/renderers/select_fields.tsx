import { Chip, Stack, Typography } from '@mui/material'
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'
import { title_case } from '../../helpers/helpers'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { container_style } from './pagination'

const icon_size = 18

export const SelectFields = observer(
    ({
        parent,
        selected_field_names,
        possible_field_names
    }: {
        parent: Record<string, any>
        selected_field_names: string[]
        possible_field_names: string[]
    }) => {
        return (
            <div style={container_style}>
                <Typography>Select</Typography>
                <div
                    style={{
                        display: 'grid',
                        gap: '5px',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(80px, auto))'
                    }}
                >
                    {possible_field_names.map(field => {
                        const is_selected = selected_field_names.includes(field)
                        const field_name = title_case(field)

                        return (
                            <Stack key={field}>
                                <Chip
                                    onClick={action(() => {
                                        if (is_selected) {
                                            delete parent[field]
                                        } else {
                                            parent[field] = true
                                        }
                                    })}
                                    icon={
                                        is_selected ? (
                                            <MdCheckBox size={icon_size} />
                                        ) : (
                                            <MdCheckBoxOutlineBlank size={icon_size} />
                                        )
                                    }
                                    label={field_name}
                                    variant={is_selected ? 'filled' : 'outlined'}
                                />
                            </Stack>
                        )
                    })}
                </div>
            </div>
        )
    }
)
