import { Chip, Stack, Tooltip, Typography } from '@mui/material'
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'
import { title_case } from '../../helpers/helpers'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { container_style } from './pagination'
import { get_field_schema } from 'orma/build/helpers/schema_helpers'
import { OrmaSchema } from 'orma/src/types/schema/schema_types'

const icon_size = 18

export const SelectFields = observer(
    ({
        parent,
        entity,
        selected_field_names,
        possible_field_names,
        orma_schema
    }: {
        entity: string
        parent: Record<string, any>
        selected_field_names: string[]
        possible_field_names: string[]
        orma_schema: OrmaSchema
    }) => {
        return (
            <div style={container_style}>
                <Typography>Select</Typography>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                    }}
                >
                    {possible_field_names.map(field => {
                        const is_selected = selected_field_names.includes(field)
                        const field_name = title_case(field)
                        const is_required_field = get_field_schema(
                            orma_schema,
                            entity,
                            field
                        ).$not_null

                        return (
                            <div key={field}>
                                <Chip
                                    style={{ padding: '8px' }}
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
                                    label={
                                        <div
                                            style={{
                                                fontWeight: is_required_field ? 'bold' : 'normal'
                                            }}
                                        >
                                            {field_name}
                                        </div>
                                    }
                                    variant={is_selected ? 'filled' : 'outlined'}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
)
