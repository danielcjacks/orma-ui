import { Typography } from '@mui/material'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { OrmaSchema } from 'orma'
import { container_style } from '../pagination'
import { Query } from '../subquery'
import { AddWhereClauseButton } from './add_where_clause_button'
import { ConnectiveClause, default_blank_condition } from './connective_clause'
import { WhereConditionRow, is_condition, is_connective } from './where_condition'
import { title_case } from '../../../helpers/helpers'

export const Where = observer(
    ({
        mode,
        entity_subquery,
        entity,
        schema
    }: {
        mode: 'where' | 'having'
        entity_subquery: Query
        entity: string
        schema: OrmaSchema
    }) => {
        return (
            <div style={container_style}>
                <Typography>{title_case(mode)}</Typography>

                <WhereClause
                    entity_subquery={entity_subquery}
                    mode={mode}
                    entity={entity}
                    schema={schema}
                />
            </div>
        )
    }
)

const WhereClause = observer(
    ({
        entity_subquery,
        entity,
        mode,
        schema
    }: {
        entity_subquery: Query
        mode: 'where' | 'having'
        entity: string
        schema: OrmaSchema
    }) => {
        const keyword = mode === 'where' ? '$where' : '$having'
        if (!entity_subquery[keyword]) {
            return (
                <AddWhereClauseButton
                    on_click={action(() => {
                        entity_subquery[keyword] = default_blank_condition
                    })}
                />
            )
        }
        const clause_type = Object.keys(entity_subquery[keyword])[0]

        if (is_condition(clause_type)) {
            return (
                <WhereConditionRow
                    onClose={action(() => {
                        delete entity_subquery[keyword]
                    })}
                    condition_subquery={entity_subquery[keyword]}
                    entity={entity}
                    schema={schema}
                />
            )
        }

        if (is_connective(clause_type)) {
            return (
                <ConnectiveClause
                    clause_subquery={entity_subquery[keyword]}
                    entity={entity}
                    schema={schema}
                    onClose={action(() => {
                        delete entity_subquery[keyword]
                    })}
                />
            )
        }

        return <>Not implemented</>
    }
)
