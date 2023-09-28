import { observer } from 'mobx-react-lite'
import { TestContainer, Query } from '../helpers/test_container'
import { test_schema } from '../test_schema'

export const NotEqual = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: true,
                        $where: {
                            $not: {
                                $eq: ['first_name', { $escape: 'Alice' }]
                            }
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const NotIn = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: true,
                        $where: {
                            $not: {
                                $eq: ['first_name', { $escape: ['Alice', 'Bob'] }]
                            }
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const HavingGte = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: true,
                        $having: {
                            $gte: [
                                {
                                    $select: ['*'],
                                    $from: 'likes',
                                    $where: { $eq: ['post_id', 0] }
                                },
                                4
                            ]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Equals = observer(() => {
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

export const In = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: true,
                        $where: {
                            $in: ['first_name', { $escape: ['Alice', 'Bob'] }]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Like = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: true,
                        $where: {
                            $like: ['first_name', { $escape: 'A%' }]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const GreaterThan = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: true,
                        $where: {
                            $gt: ['id', { $escape: 1 }]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const GreaterThanEqual = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: true,
                        $where: {
                            $gte: ['id', { $escape: 1 }]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const LessThan = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: true,
                        $where: {
                            $lt: ['id', { $escape: 10 }]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const LessThanEqual = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: true,
                        $where: {
                            $lte: ['id', { $escape: 10 }]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const NotLike = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    posts: {
                        id: true,
                        title: true,
                        $where: {
                            $not: { like: ['title', { $escape: 'A%' }] }
                        }
                    }
                } as unknown as Query
            }
        />
    )
})
