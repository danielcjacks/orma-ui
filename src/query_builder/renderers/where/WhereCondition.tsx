import { Autocomplete, IconButton, TextField } from '@mui/material'
import { action, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { OrmaSchema } from 'orma'
import { get_field_names } from 'orma/build/helpers/schema_helpers'
import { MdClose } from 'react-icons/md'
import { Query } from '../subquery'
import { is } from 'ramda'

export const WhereCondition = observer(
    ({ subquery, entity, schema }: { subquery: Query; entity: string; schema: OrmaSchema }) => {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}
            >
                <ChooseColumn subquery={subquery} entity={entity} schema={schema} />

                <ChooseOperator subquery={subquery} />
                <ChooseValue subquery={subquery} />

                <IconButton
                    onClick={action(() => {
                        delete subquery.$where
                    })}
                >
                    <MdClose />
                </IconButton>
            </div>
        )
    }
)

const ChooseColumn = observer(
    ({ entity, subquery, schema }: { subquery: Query; entity: string; schema: OrmaSchema }) => {
        const clause_type = Object.keys(subquery.$where)[0]
        const field_names = get_field_names(entity, schema)

        const value = subquery.$where[clause_type][0]

        return (
            <Autocomplete
                disablePortal
                disableClearable={true}
                freeSolo={false}
                options={field_names}
                style={{ width: '200px' }}
                renderInput={params => (
                    <TextField {...params} label='Column' size='small' style={{ width: '200px' }} />
                )}
                // inputValue={value || ''}
                // onInputChange={(e, value) => set_value(value)}

                value={value || ''}
                onChange={(e: any, option: any) => {
                    runInAction(() => {
                        if (!subquery.$where) {
                            subquery.$where = {}
                        }
                        if (!subquery.$where[clause_type]) {
                            subquery.$where[clause_type] = []
                        }

                        if (option) {
                            subquery.$where[clause_type][0] = option
                        }
                    })
                    return
                }}
            />
        )
    }
)

export const comparitors = {
    $eq: '=',
    $gt: '>',
    $gte: '>=',
    $lt: '<',
    $lte: '<=',
    $like: 'like'
} as Record<string, string>

export const connectives = {
    $and: 'And',
    $or: 'Or',
    $any_path: 'Any'
} as Record<string, string>

const comparitor_options = Object.keys(comparitors)
const connective_options = Object.keys(connectives)
const is_comparitor = (option: any) => comparitor_options.includes(option)

const ChooseOperator = observer(({ subquery }: { subquery: Query }) => {
    const clause_type = Object.keys(subquery.$where)[0]
    const options = [...comparitor_options, ...connective_options]
    return (
        <Autocomplete
            disablePortal
            disableClearable={true}
            freeSolo={false}
            options={options}
            getOptionLabel={option =>
                is_comparitor(option) ? comparitors[option] : connectives[option]
            }
            style={{ width: '200px' }}
            renderInput={params => (
                <TextField {...params} label='Operator' size='small' style={{ width: '200px' }} />
            )}
            // inputValue={value}
            // onInputChange={(e, value) => set_value(value)}
            groupBy={option => (is_comparitor(option) ? 'Comparitors' : 'Connectives')}
            value={clause_type}
            onChange={(e, option) =>
                runInAction(() => {
                    if (!option) {
                        return
                    }

                    const was_before_comparitor = is_comparitor(Object.keys(subquery.$where)[0])
                    const is_now_comparitor = is_comparitor(option)

                    if (was_before_comparitor && is_now_comparitor) {
                        subquery.$where = {
                            [option]: subquery.$where[clause_type]
                        }
                        return
                    }
                    if (!was_before_comparitor && !is_now_comparitor) {
                        subquery.$where = {
                            [option]: subquery.$where[clause_type]
                        }
                        return
                    }
                    if (!was_before_comparitor && is_now_comparitor) {
                        subquery.$where = {
                            [option]: [subquery.$where]
                        }
                        return
                    }
                    if (was_before_comparitor && !is_now_comparitor) {
                        subquery.$where = {
                            [option]: [subquery.$where]
                        }
                        return
                    }
                })
            }
        />
    )
})

const ChooseValue = observer(({ subquery }: { subquery: Query }) => {
    const clause_type = Object.keys(subquery.$where)[0]
    return (
        <TextField
            size='small'
            style={{ width: '200px' }}
            label='Value'
            value={subquery.$where?.[clause_type]?.[1]?.$escape || ''}
            onChange={action(e => {
                if (!subquery.$where) {
                    subquery.$where = {}
                }
                if (!subquery.$where[clause_type]) {
                    subquery.$where[clause_type] = []
                }
                if (!subquery.$where[clause_type][1]) {
                    subquery.$where[clause_type][1] = {}
                }

                subquery.$where[clause_type][1].$escape = e.target.value
            })}
        />
    )
})
