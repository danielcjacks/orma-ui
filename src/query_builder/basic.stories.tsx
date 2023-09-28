import { observer } from 'mobx-react-lite'
import { Query, TestContainer } from '../helpers/test_container'
import { test_schema } from '../test_schema'

export const Empty = observer(() => {
    return <TestContainer schema={test_schema} query={{}} />
})

export const Simple = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                } as Query
            }
        />
    )
})

export const Pagination = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true,
                        $offset: 0,
                        $limit: 10
                    }
                } as Query
            }
        />
    )
})

export const MultipleTopLevel = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: true,
                        last_name: true
                    },
                    comments: {
                        id: true,
                        post_id: true
                    }
                } as Query
            }
        />
    )
})
