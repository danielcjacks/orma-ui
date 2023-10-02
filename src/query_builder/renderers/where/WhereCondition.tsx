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
        if (!subquery.$where) {
            return <>Not implemented</>
        }

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

export const comparators = {
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

const comparator_options = Object.keys(comparators)
const connective_options = Object.keys(connectives)
export const is_comparator = (option: any) => comparator_options.includes(option)
export const is_connective = (option: any) => connective_options.includes(option)

const ChooseOperator = observer(({ subquery }: { subquery: Query }) => {
    if (!subquery.$where) {
        return <>Not implemented</>
    }

    const clause_type = Object.keys(subquery.$where)[0]
    const options = [...comparator_options, ...connective_options]
    return (
        <Autocomplete
            disablePortal
            disableClearable={true}
            freeSolo={false}
            options={options}
            getOptionLabel={option =>
                is_comparator(option) ? comparators[option] : connectives[option]
            }
            style={{ width: '200px' }}
            renderInput={params => (
                <TextField {...params} label='Operator' size='small' style={{ width: '200px' }} />
            )}
            // inputValue={value}
            // onInputChange={(e, value) => set_value(value)}
            groupBy={option => (is_comparator(option) ? 'Comparators' : 'Connectives')}
            value={clause_type}
            onChange={(e, option) =>
                runInAction(() => {
                    if (!option) {
                        return
                    }

                    const was_before_comparator = is_comparator(Object.keys(subquery.$where)[0])
                    const is_now_comparator = is_comparator(option)

                    if (was_before_comparator && is_now_comparator) {
                        subquery.$where = {
                            [option]: subquery.$where[clause_type]
                        }
                        return
                    }
                    if (!was_before_comparator && !is_now_comparator) {
                        subquery.$where = {
                            [option]: subquery.$where[clause_type]
                        }
                        return
                    }
                    if (!was_before_comparator && is_now_comparator) {
                        subquery.$where = {
                            [option]: [subquery.$where]
                        }
                        return
                    }
                    if (was_before_comparator && !is_now_comparator) {
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
    if (!subquery.$where) {
        return <>Not implemented</>
    }
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
