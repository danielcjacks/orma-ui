import { observer } from 'mobx-react-lite'
import { TestContainer, Query } from '../helpers/test_container'
import { test_schema } from '../test_schema'

export const ColumnRename = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: 'First Name'
                    }
                } as unknown as Query
            }
        />
    )
})

export const TableRename = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        shmosts: {
                            $from: 'posts',
                            id: true
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const RepeatedTable = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    users: {
                        id: true,
                        first_name: true,
                        billing_addresses: {
                            $foreign_key: ['billing_address_id'],
                            $from: 'addresses',
                            line_1: true
                        },
                        shipping_addresses: {
                            $foreign_key: ['shipping_address_id'],
                            $from: 'addresses',
                            line_1: true
                        }
                    }
                } as unknown as Query
            }
        />
    )
})

export const As = observer(() => {
    return (
        <TestContainer
            schema={test_schema}
            query={
                {
                    posts: {
                        id: true,
                        $select: [
                            {
                                $as: [
                                    {
                                        $select: ['first_name'],
                                        $from: 'users',
                                        $where: {
                                            $eq: [
                                                'id',
                                                {
                                                    $entity: 'posts',
                                                    $field: 'user_id'
                                                }
                                            ]
                                        }
                                    },
                                    'user_first_name'
                                ]
                            }
                        ]
                    }
                } as unknown as Query
            }
        />
    )
})
