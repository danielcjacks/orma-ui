import { IconButton, Typography } from '@mui/material'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { OrmaSchema } from 'orma'
import { MdAdd } from 'react-icons/md'
import { container_style } from '../pagination'
import { Query } from '../subquery'
import { WhereCondition, comparitors } from './WhereCondition'

export const Where = observer(
    ({ subquery, entity, schema }: { subquery: Query; entity: string; schema: OrmaSchema }) => {
        return (
            <div style={container_style}>
                <Typography>Where</Typography>

                <WhereClause subquery={subquery} entity={entity} schema={schema} />
            </div>
        )
    }
)

const WhereClause = observer(
    ({ subquery, entity, schema }: { subquery: Query; entity: string; schema: OrmaSchema }) => {
        if (!subquery.$where) {
            return <AddWhereClauseButton subquery={subquery} clause_type={'$eq'} />
        }
        const clause_type = Object.keys(subquery.$where)[0]

        if (Object.keys(comparitors).includes(clause_type)) {
            return <WhereCondition subquery={subquery} entity={entity} schema={schema} />
        }

        return <>Not implemented</>
    }
)

const AddWhereClauseButton = observer(
    ({ subquery, clause_type }: { subquery: Query; clause_type: string }) => (
        <IconButton
            style={{ border: '2px dashed grey', borderRadius: '0px', width: '60px' }}
            onClick={action((e: any) => {
                if (!subquery.$where) {
                    subquery.$where = {}
                }
                if (!subquery.$where[clause_type]) {
                    subquery.$where[clause_type] = []
                }

                subquery.$where[clause_type] = [null, { $escape: null }]
            })}
            size='large'
        >
            <MdAdd />
        </IconButton>
    )
)