import { Typography } from '@mui/material'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { OrmaSchema } from 'orma'
import { container_style } from '../pagination'
import { Query } from '../subquery'
import { AddWhereClauseButton } from './add_where_clause_button'
import { JoinedClause, default_blank_condition } from './joined_clause'
import { WhereConditionRow, is_condition, is_connective } from './where_condition'

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

        if (is_condition(clause_type)) {
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
            return (
                <JoinedClause
                    clause_subquery={entity_subquery.$where}
                    entity={entity}
                    schema={schema}
                    onClose={action(() => {
                        delete entity_subquery.$where
                    })}
                />
            )
        }

        return <>Not implemented</>
    }
)
