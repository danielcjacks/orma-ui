import { observer } from 'mobx-react-lite'
import { TestContainer, Query } from '../helpers/test_container'
import { test_schema } from '../test_schema'

export const GroupBy = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    likes: {
                        $group_by: ['post_id'],
                        post_id: true,
                        my_likes: {
                            $count: '*'
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Having = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    likes: {
                        $group_by: ['post_id'],
                        post_id: true,
                        my_likes: {
                            $count: '*'
                        },
                        $having: {
                            $gt: ['my_likes', { $escape: 1 }]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const OrderBy = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: true,
                        $order_by: [{ $desc: 'id' }]
                    }
                } as unknown as Query
            }
        />
    )
})

export const Where = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: true,
                        $where: {
                            $eq: ['first_name', { $escape: 'Alice' }]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Subquery = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        first_name: true,
                        posts: {
                            id: true
                        },
                        $where: {
                            $in: [
                                'id',
                                {
                                    $select: ['user_id'],
                                    $from: 'posts',
                                    $where: {
                                        $eq: ['id', { $escape: 1 }]
                                    }
                                }
                            ]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const WhereConnected = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    $where_connected: [
                        {
                            $entity: 'users',
                            $field: 'id',
                            $values: [1]
                        }
                    ],
                    addresses: { id: true }
                } as unknown as Query
            }
        />
    )
})

export const FieldReference = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    $eq: [
                        'first_name',
                        {
                            $entity: 'posts',
                            $field: 'id'
                        }
                    ]
                } as unknown as Query
            }
        />
    )
})
