import { observable } from "mobx"
import { test_schema } from "../test_schema"
import { QueryBuilder } from "./query_builder"

const query = observable({})

export const Simple = () => {
  return (
    <>
      <QueryBuilder
        orma_schema={test_schema}
        query={query}
        extra_resolvers={{}}
      />
    </>
  )
}
