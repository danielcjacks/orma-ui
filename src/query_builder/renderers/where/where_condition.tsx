import { IconButton, TextField } from '@mui/material'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { OrmaSchema } from 'orma'
import { MdClose } from 'react-icons/md'
import { Query } from '../subquery'
import { ColumnDropdown } from './column_dropdown'
import { OperatorDropdown } from './condition_dropdown'

export const conditions = {
    $eq: '=',
    $gt: '>',
    $gte: '>=',
    $lt: '<',
    $lte: '<=',
    $like: 'like',
    $in: 'in'
} as Record<string, string>

export const connectives = {
    $and: 'And',
    $or: 'Or',
    $any_path: 'Any Path'
} as Record<string, string>

export const condition_options = Object.keys(conditions)
export const connective_options = Object.keys(connectives)
export const is_condition = (option: any) => condition_options.includes(option)
export const is_connective = (option: any) => connective_options.includes(option)

export const WhereConditionRow = observer(
    ({
        condition_subquery,
        entity,
        schema,
        onClose
    }: {
        condition_subquery: Query
        entity: string
        schema: OrmaSchema
        onClose: () => void
    }) => {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}
            >
                <ColumnDropdown
                    condition_subquery={condition_subquery}
                    entity={entity}
                    schema={schema}
                />
                <OperatorDropdown condition_subquery={condition_subquery} />

                <ValueTextField condition_subquery={condition_subquery} />

                <IconButton onClick={onClose}>
                    <MdClose />
                </IconButton>
            </div>
        )
    }
)

const ValueTextField = observer(({ condition_subquery }: { condition_subquery: Query }) => {
    const clause_type = Object.keys(condition_subquery)[0]
    const is_in = clause_type === '$in'

    const value = condition_subquery[clause_type]?.[1]?.$escape || ''
    return (
        <TextField
            {...(is_in
                ? {
                      multiline: true,
                      minRows: 10,
                      maxRows: 50
                  }
                : {})}
            size='small'
            style={{ width: '200px' }}
            label={is_in ? 'One value per line no commas' : 'Value'}
            value={is_in ? value.join('\n') : value}
            onChange={action(e => {
                if (!condition_subquery[clause_type]) {
                    condition_subquery[clause_type] = [null, { $escape: null }]
                }

                if (!condition_subquery[clause_type][1]) {
                    condition_subquery[clause_type][1] = { $escape: null }
                }

                condition_subquery[clause_type][1].$escape = is_in
                    ? e.target.value.split('\n')
                    : e.target.value
            })}
        />
    )
})
