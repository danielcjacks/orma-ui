import { alpha } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { get_all_edges, get_entity_names, get_field_names } from 'orma/build/helpers/schema_helpers'
import { OrmaSchema } from 'orma/build/types/schema/schema_types'
import { MdCircle } from 'react-icons/md'
import { EntityName } from './entity_name'
import { AddEntity } from './add_entity'
import { Nest } from './nest'
import { Pagination } from './pagination'
import { SelectFields } from './select_fields'
import { pathOr, uniq } from 'ramda'
import { OrmaQuery } from 'orma'
import { DeepMutable } from 'orma/src/types/schema/schema_helper_types'

export type Query = Record<any, any>

export const Subquery = observer(
    ({
        subquery,
        parent_name,
        orma_schema
    }: {
        subquery: Query
        parent_name: string | undefined
        orma_schema: OrmaSchema
    }) => {
        const is_root_level = parent_name === undefined
        const all_possible_entities = get_entity_names(orma_schema)

        const nestable_entities = is_root_level
            ? all_possible_entities.filter(el => {
                  return !Object.keys(subquery).includes(el)
              })
            : uniq(
                  get_all_edges(parent_name, orma_schema)
                      .map(el => el.to_entity)
                      .filter(el => {
                          return !Object.keys(subquery).includes(el)
                      })
              )

        const subquery_entities = Object.keys(subquery).filter(el => {
            return all_possible_entities.includes(el)
        })

        return (
            <div>
                {subquery_entities.map((entity, i) => {
                    const possible_field_names = get_field_names(entity, orma_schema)
                    const selected_field_names = Object.keys(subquery?.[entity]).filter(el => {
                        return possible_field_names.includes(el)
                    })

                    const padding_left = 10
                    const font_size = 13
                    return (
                        <div
                            key={entity}
                            style={{
                                paddingLeft: padding_left,
                                border: `2px dashed ${alpha('#000', 0.12)}`
                            }}
                        >
                            {/* <MdCircle
                                style={{
                                    position: 'relative',
                                    top: '30px',
                                    fontSize: `${font_size}px`,
                                    color: '#666',
                                    marginLeft: `-${padding_left + (font_size + 2) / 2}px`
                                }}
                            /> */}
                            <EntityName subquery={subquery} field={entity} />
                            <div style={{ marginLeft: '10px' }}>
                                <SelectFields
                                    parent={subquery[entity]!}
                                    selected_field_names={selected_field_names}
                                    possible_field_names={possible_field_names}
                                />
                                <Nest
                                    subquery={subquery[entity]!}
                                    parent_name={entity}
                                    orma_schema={orma_schema}
                                />
                                <Pagination parent={subquery[entity]!} />
                            </div>
                        </div>
                    )
                })}

                <div
                    style={{
                        display: 'flex',
                        marginTop: '10px'
                    }}
                >
                    {nestable_entities.length > 0 && (
                        <AddEntity subquery={subquery} nestable_entities={nestable_entities} />
                    )}
                </div>
            </div>
        )
    }
)
