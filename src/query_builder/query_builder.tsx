import { observer } from 'mobx-react-lite'
import { OrmaQuery } from 'orma'
import { OrmaSchema } from 'orma/build/types/schema/schema_types'
import { Query, Subquery } from './renderers/subquery'

export const QueryBuilder = observer(
    ({ query, orma_schema }: { query: Query; orma_schema: OrmaSchema }) => {
        return (
            <>
                <Subquery subquery={query} parent_name={undefined} orma_schema={orma_schema} />
            </>
        )
    }
)
