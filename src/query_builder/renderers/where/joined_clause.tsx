import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { OrmaSchema } from 'orma'
import { Query } from '../subquery'
import { ConnectiveDropdown } from './connective_dropdown'
import { WhereConditionRow, is_condition, is_connective } from './where_condition'
import { AddWhereClauseButton } from './add_where_clause_button'
import { IconButton, alpha } from '@mui/material'
import { MdClose } from 'react-icons/md'

export const default_blank_condition = { $eq: ['id', { $escape: null }] }

export const JoinedClause = observer(
    ({
        clause_subquery,
        entity,
        schema,
        onClose
    }: {
        clause_subquery: Query
        entity: string
        schema: OrmaSchema
        onClose: () => void
    }) => {
        const clause_type = Object.keys(clause_subquery)[0]
        const conditions = clause_subquery[clause_type]

        return (
            <div>
                <div style={{ display: 'flex' }}>
                    <ConnectiveDropdown condition_subquery={clause_subquery} />
                    <IconButton onClick={onClose}>
                        <MdClose />
                    </IconButton>
                </div>

                <div
                    style={{
                        borderLeft: `2px dashed ${alpha('#000', 0.12)}`,
                        display: 'grid',
                        gap: '10px',

                        padding: '16px'
                    }}
                >
                    {conditions.map((condition_subquery: Query, index: number) => {
                        const condition_clause_type = Object.keys(condition_subquery)[0]
                        const is_a_condition = is_condition(condition_clause_type)
                        const is_a_connective = is_connective(condition_clause_type)
                        if (is_a_condition) {
                            return (
                                <div key={index}>
                                    <WhereConditionRow
                                        condition_subquery={condition_subquery}
                                        entity={entity}
                                        schema={schema}
                                        onClose={action(() => {
                                            clause_subquery[clause_type]!.splice(index, 1)
                                        })}
                                    />
                                </div>
                            )
                        }
                        if (is_a_connective) {
                            return (
                                <JoinedClause
                                    clause_subquery={condition_subquery}
                                    entity={entity}
                                    schema={schema}
                                    onClose={action(() => {
                                        clause_subquery[clause_type]!.splice(index, 1)
                                    })}
                                />
                            )
                        }

                        return <>Not implemented yet</>
                    })}

                    <AddWhereClauseButton
                        on_click={action(() => {
                            if (!clause_subquery[clause_type]) {
                                clause_subquery[clause_type] = []
                            }

                            clause_subquery[clause_type].push(default_blank_condition)
                        })}
                    />
                </div>
            </div>
        )
    }
)
