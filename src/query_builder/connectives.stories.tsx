import { observer } from 'mobx-react-lite'
import { TestContainer, Query } from '../helpers/test_container'
import { test_schema } from '../test_schema'

export const And = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        first_name: true,
                        $where: {
                            $and: [
                                {
                                    $eq: ['first_name', { $escape: 'Alice' }]
                                },
                                {
                                    $eq: ['last_name', { $escape: 'Anderson' }]
                                }
                            ]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Or = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        first_name: true,
                        $where: {
                            $or: [
                                {
                                    $eq: ['first_name', { $escape: 'Alice' }]
                                },
                                {
                                    $eq: ['last_name', { $escape: 'Anderson' }]
                                }
                            ]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const All = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        first_name: true,
                        $where: {
                            $or: [
                                {
                                    $eq: ['first_name', { $escape: 'Alice' }]
                                },
                                {
                                    $eq: ['last_name', { $escape: 'Anderson' }]
                                }
                            ]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Exists = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        first_name: true,
                        $where: {
                            $exists: ['first_name']
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const AnyPath = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    posts: {
                        $where: {
                            $and: [
                                {
                                    $any_path: [
                                        ['comments'],
                                        {
                                            $eq: ['id', 1]
                                        }
                                    ]
                                },
                                {
                                    $any_path: [
                                        ['users'],
                                        {
                                            $eq: ['id', 1]
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})
