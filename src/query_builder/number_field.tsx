import { TextField, IconButton, Divider, InputAdornment } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { MdAdd, MdRemove } from 'react-icons/md'
import { title_case } from '../helpers/helpers'
import { action } from 'mobx'

export const NumberField = observer((props: React.ComponentProps<typeof TextField>) => {
    const size = props.InputProps?.size || props.size

    const incrementor_size = size === 'medium' ? 'large' : 'medium'
    const icon_outer_size = size === 'medium' ? '28px' : '22px'
    const icon_size = size === 'medium' ? '22px' : '18px'
    const border_size = size === 'medium' ? '28px' : '20px'

    return (
        <TextField
            type='number'
            sx={{
                'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0
                }
            }}
            {...props}
            // inputProps={{
            //     ...props?.inputProps,
            //     style: {
            //         minWidth: '0px',
            //         maxWidth: '120px',
            //         ...props?.inputProps?.style,
            //     },
            // }}
            InputProps={{
                endAdornment: (
                    <InputAdornment
                        position='end'
                        style={{
                            margin: '-12px',
                            display: 'flex',
                            height: '100%'
                        }}
                    >
                        <IconButton
                            tabIndex={-1}
                            size={incrementor_size}
                            style={{
                                borderRadius: 0
                            }}
                            onClick={e => {
                                const new_value = Math.max(
                                    Number(props.value || 0) - 1,
                                    props?.inputProps?.min ?? -Infinity
                                )
                                props.onChange?.({
                                    target: { value: new_value.toString() }
                                } as any)
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: icon_outer_size,
                                    height: icon_outer_size
                                }}
                            >
                                <MdRemove size={icon_size} />
                            </div>
                        </IconButton>
                        <div
                            style={{
                                height: border_size,
                                borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                marginRight: '-1px'
                            }}
                        />
                        <IconButton
                            tabIndex={-1}
                            size={incrementor_size}
                            style={{
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                borderTopRightRadius: '4px',
                                borderBottomRightRadius: '4px'
                            }}
                            onClick={e => {
                                const new_value = Math.min(
                                    Number(props.value || 0) + 1,
                                    props?.inputProps?.max ?? Infinity
                                )
                                props.onChange?.({
                                    target: { value: new_value.toString() }
                                } as any)
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: icon_outer_size,
                                    height: icon_outer_size
                                }}
                            >
                                <MdAdd size={icon_size} />
                            </div>
                        </IconButton>
                    </InputAdornment>
                ),
                ...props.InputProps
            }}
        />
    )
})

export const get_number_width_style = (
    number_of_digits: number,
    size: 'small' | 'medium' = 'medium'
) => {
    const incrementor_size = size === 'medium' ? 28 : 22
    const min_width = get_character_width(number_of_digits) + 2 * incrementor_size
    return {
        minWidth: `${min_width.toFixed(0)}px`,
        maxWidth: `${(min_width * 2).toFixed(0)}px`
    }
}

export const get_text_width_style = (number_of_characters: number) => {
    const min_width = get_character_width(number_of_characters)
    return {
        minWidth: `${min_width.toFixed(0)}px`,
        maxWidth: `${(min_width * 2).toFixed(0)}px`
    }
}

const get_character_width = (number_of_characters: number) => {
    // these numbers were found by trying different values then taking a line of best fit.
    // Some numbers like 0 are wider than numbers like 1, so if the input is all 1s, there will
    // be some extra space.
    const width = 9.5 * number_of_characters + 20
    return width
}

export const get_text_field_props = <Parent extends Record<string, any>>(
    parent: Parent,
    prop: keyof Parent
) => {
    return {
        size: 'small',
        item: 'outlined',
        label: title_case(String(prop)),
        value: (parent[prop] as string) ?? '',
        onChange: action((e: any) => {
            parent[prop] = e.target.value
            if (parent?._errors?.[prop]) {
                delete parent._errors[prop]
            }
        }),
        fullWidth: true,
        error: !!parent?._errors?.[prop],
        helperText: parent?._errors?.[prop]?.message ?? ''
    } as const
}
