import { observer } from 'mobx-react-lite'
import { TestContainer, Query } from '../helpers/test_container'
import { test_schema } from '../test_schema'

export const Upper = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: {
                            $upper: 'first_name'
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Lower = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: {
                            $lower: 'first_name'
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Coalesce = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: {
                            $coalesce: ['first_name', 'last_name']
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Round = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: {
                            $round: ['id', 2]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const CastSigned = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        signed_id: {
                            $cast_signed: ['id']
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Sum = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    likes: {
                        $select: [{ $as: ['SUM(views)', 'total_views'] }],
                        $from: 'posts'
                    }
                } as unknown as Query
            }
        />
    )
})

export const SumInline = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    likes: {
                        post_id: true,
                        sum: {
                            $sum: 'id'
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Min = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    posts: {
                        user_id: true,
                        min: {
                            $min: 'likes'
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Max = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    posts: {
                        user_id: true,
                        max: {
                            $max: 'likes'
                        }
                    }
                } as unknown as Query
            }
        />
    )
})
export const Average = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    posts: {
                        user_id: true,
                        average: {
                            $average: 'likes'
                        }
                    }
                } as unknown as Query
            }
        />
    )
})
export const Count = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    posts: {
                        user_id: true,
                        count: {
                            $count: '*'
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Floor = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    posts: {
                        user_id: true,
                        floor: {
                            $floor: 'likes'
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Ceil = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    posts: {
                        user_id: true,
                        ceil: {
                            $ceil: 'likes'
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Date = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    posts: {
                        user_id: true,
                        date: {
                            $date: 'created_at'
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const If = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    posts: {
                        user_id: true,
                        if: {
                            $if: ['likes', 'true', 'false']
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Concat = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        concat: {
                            $concat: ['first_name', 'last_name']
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Multiply = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        multiply: {
                            $multiply: ['id', 2]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Divide = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        multiply: {
                            $multiply: ['id', { $entity: 'posts', $field: 'id' }]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const Add = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        add: {
                            $add: ['id', 2]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})
export const Subtract = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        subtract: {
                            $subtract: ['id', 2]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})
export const CurrentTimestamp = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        current_timestamp: {
                            $current_timestamp: []
                        }
                    }
                } as unknown as Query
            }
        />
    )
})
export const StDistance = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        st_distance: {
                            $st_distance: ['location', 'location']
                        }
                    }
                } as unknown as Query
            }
        />
    )
})
export const StDwithin = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        st_dwithin: {
                            $st_dwithin: ['location', 'location', 1]
                        }
                    }
                } as unknown as Query
            }
        />
    )
})
