import { IconButton, Typography } from '@mui/material'
import { action, toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { OrmaSchema } from 'orma'
import { MdAdd } from 'react-icons/md'
import { container_style } from '../pagination'
import { Query } from '../subquery'
import { WhereConditionRow, is_operator, is_connective } from './WhereCondition'
import { title_case } from '../../../sheet_builder_old/helpers'

export const Where = observer(
    ({
        entity_subquery,
        entity,
        schema
    }: {
        entity_subquery: Query
        entity: string
        schema: OrmaSchema
    }) => {
        return (
            <div style={container_style}>
                <Typography>Where</Typography>

                <WhereClause entity_subquery={entity_subquery} entity={entity} schema={schema} />
            </div>
        )
    }
)

const default_blank_condition = {
    $eq: ['id', { $escape: null }]
}

const WhereClause = observer(
    ({
        entity_subquery,
        entity,
        schema
    }: {
        entity_subquery: Query
        entity: string
        schema: OrmaSchema
    }) => {
        if (!entity_subquery.$where) {
            return (
                <AddWhereClauseButton
                    on_click={action(() => {
                        entity_subquery.$where = default_blank_condition
                    })}
                />
            )
        }
        const clause_type = Object.keys(entity_subquery.$where)[0]

        if (is_operator(clause_type)) {
            return (
                <WhereConditionRow
                    onClose={action(() => {
                        delete entity_subquery.$where
                    })}
                    condition_subquery={entity_subquery.$where}
                    entity={entity}
                    schema={schema}
                />
            )
        }

        if (is_connective(clause_type)) {
            return <MultiClause entity_subquery={entity_subquery} entity={entity} schema={schema} />
        }

        return <>Not implemented</>
    }
)

const MultiClause = observer(
    ({
        entity_subquery,
        entity,
        schema
    }: {
        entity_subquery: Query
        entity: string
        schema: OrmaSchema
    }) => {
        const clause_type = Object.keys(entity_subquery.$where)[0]
        const conditions = entity_subquery.$where[clause_type]
        return (
            <div style={{ display: 'grid', gap: '10px' }}>
                <Typography>{title_case(clause_type.replace('$', ''))}</Typography>
                {conditions.map((condition_subquery: Query, index: number) => (
                    <div key={index}>
                        <WhereConditionRow
                            condition_subquery={condition_subquery}
                            entity={entity}
                            schema={schema}
                            onClose={action(() => {
                                entity_subquery.$where![clause_type]!.splice(index, 1)
                            })}
                        />
                    </div>
                ))}

                <AddWhereClauseButton
                    on_click={action(() => {
                        if (!entity_subquery.$where![clause_type]) {
                            entity_subquery.$where![clause_type] = []
                        }

                        entity_subquery.$where![clause_type]!.push(default_blank_condition)
                    })}
                />
            </div>
        )
    }
)

const AddWhereClauseButton = observer(({ on_click }: { on_click: () => void }) => (
    <IconButton
        style={{ border: '2px dashed grey', borderRadius: '0px', width: '60px' }}
        onClick={on_click}
        size='large'
    >
        <MdAdd />
    </IconButton>
))
