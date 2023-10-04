import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { OrmaSchema } from 'orma'
import { Query } from '../subquery'
import { ConnectiveDropdown } from './connective_dropdown'
import { WhereConditionRow, is_condition, is_connective } from './where_condition'
import { AddWhereClauseButton } from './add_where_clause_button'
import { IconButton, alpha } from '@mui/material'
import { MdClose } from 'react-icons/md'
import { AnyPath } from './any_path'
import { last } from 'ramda'

export const default_blank_condition = { $eq: ['id', { $escape: null }] }

export const ConnectiveClause = observer(
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

        const is_any_path = clause_type === '$any_path'

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
                        borderLeft: `3px solid ${alpha('#000', 0.12)}`,
                        display: 'grid',
                        gap: '10px',
                        padding: '16px'
                    }}
                >
                    {conditions.map((condition_subquery: Query, index: number) => {
                        if (is_any_path && index === 0) {
                            return (
                                <AnyPath
                                    path={condition_subquery as string[]}
                                    onChange={() => {
                                        // remove the next condition
                                        clause_subquery[clause_type]!.splice(index + 1, 1)
                                    }}
                                    entity={entity}
                                    schema={schema}
                                />
                            )
                        }

                        const condition_clause_type = Object.keys(condition_subquery)[0]
                        const is_a_condition = is_condition(condition_clause_type)
                        const is_a_connective = is_connective(condition_clause_type)

                        const chooser_entity = is_any_path
                            ? last(clause_subquery[clause_type][0])
                            : entity

                        if (typeof chooser_entity !== 'string') {
                            return <>{JSON.stringify(chooser_entity)}</>
                        }

                        if (is_a_condition) {
                            return (
                                <div key={index}>
                                    <WhereConditionRow
                                        condition_subquery={condition_subquery}
                                        entity={chooser_entity}
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
                                <ConnectiveClause
                                    clause_subquery={condition_subquery}
                                    entity={chooser_entity}
                                    schema={schema}
                                    onClose={action(() => {
                                        clause_subquery[clause_type]!.splice(index, 1)
                                    })}
                                />
                            )
                        }

                        return <>Not implemented yet</>
                    })}

                    {((is_any_path && conditions.length <= 1) || !is_any_path) && (
                        <AddWhereClauseButton
                            on_click={action(() => {
                                if (!clause_subquery[clause_type]) {
                                    clause_subquery[clause_type] = []
                                }

                                clause_subquery[clause_type].push(default_blank_condition)
                            })}
                        />
                    )}
                </div>
            </div>
        )
    }
)
