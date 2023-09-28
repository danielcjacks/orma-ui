import { Editor } from '@monaco-editor/react'
import { action, autorun, observable, runInAction, toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { OrmaQuery, OrmaSchema } from 'orma'
import { try_parse_json } from '../helpers/try_parse_json'
import { QueryBuilder } from '../query_builder/query_builder'
import { test_schema } from '../test_schema'

export type Query = OrmaQuery<typeof test_schema, any>

export const FunctionEditor = observer(
    ({
        store
    }: {
        store: {
            query: Query
            query_input_text: string
        }
    }) => {
        return (
            <Editor
                height='50vh'
                width='100%'
                defaultLanguage='json'
                value={store.query_input_text}
                onChange={action(val => {
                    const json = try_parse_json(val || '', undefined)
                    if (json) {
                        store.query = json
                    }
                    store.query_input_text = val || ''
                })}
                theme={'vs-dark'}
            />
        )
    }
)

export const TestContainer = observer(({ schema, query }: { schema: OrmaSchema; query: Query }) => {
    const store = observable({
        query_input_text: '',
        query: query
    })

    autorun(() => {
        let query = toJS(store.query)

        runInAction(() => {
            store.query_input_text = JSON.stringify(query, null, 2)
        })
    })

    return (
        <div
            style={{
                display: 'grid',
                gap: '1rem',
                // gridTemplateColumns: '1fr 1fr',
                backgroundColor: '#ccc',
                padding: '1rem'
                // margin: '1rem'
                // overflow: 'auto'
            }}
        >
            <QueryBuilder
                orma_schema={schema}
                query={store.query}
                extra_resolvers={{}}
                is_root={true}
            />

            <FunctionEditor store={store} />
        </div>
    )
})
