import { observer } from 'mobx-react-lite'
import { TestContainer, Query } from '../helpers/test_container'
import { test_schema } from '../test_schema'

export const BasicNest = observer(() => {
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
                        posts: {
                            title: true,
                            views: true
                        }
                    }
                } as Query
            }
        />
    )
})

export const DeepNest = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        email: true,
                        posts: {
                            title: true,
                            likes: {
                                user_id: true
                            }
                        }
                    }
                } as Query
            }
        />
    )
})

export const ReverseNest = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    posts: {
                        title: true,
                        likes: {
                            user_id: true,
                            users: {
                                first_name: true
                            }
                        }
                    }
                } as Query
            }
        />
    )
})
