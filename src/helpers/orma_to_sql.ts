import { action } from 'mobx'
import { OrmaStatement } from 'orma'
import { orma_mutate } from 'orma/src/mutate/mutate'
import { orma_query } from 'orma/src/query/query'
import { OrmaQuery } from 'orma/src/types/query/query_types'
import { format } from 'sql-formatter'

export const reset_query_log = action(
    (query: { sql_queries: string; query: OrmaQuery<any, any> }, schema: any) => {
        query.sql_queries = ''
        orma_query(query.query, schema, sqls => fake_sql_fn(sqls, query))
    }
)

export const fake_sql_fn = async (sqls: any, query: any) => {
    const sql_strings = sqls
        .map((sql: OrmaStatement) => {
            return (
                format(sql.sql_string, {
                    language: 'spark',
                    tabWidth: 2,
                    keywordCase: 'upper',
                    linesBetweenQueries: 2
                }) + ';\n---------------------------------------\n'
            )
        })
        .join('\n')
    query.sql_queries += sql_strings
    return sqls.map((sql: any) => {
        if (sql.operation === 'query') {
            const rows = [
                sql.ast.$select.reduce((acc: any, val: string) => ((acc[val] = ''), acc), {})
            ]
            return rows
        }
        if (sql.operation === 'create') {
            const rows = sql.ast.$values.map((values: string[], i: number) => {
                return { id: i }
            }, {})

            return rows
        }
        return []
    })
}

export const reset_mutation_log = action(
    (mutate: { mutation: any; sql_queries: string }, schema: any) => {
        mutate.sql_queries = ''
        orma_mutate(mutate.mutation, sqls => fake_sql_fn(sqls, mutate), schema)
    }
)
