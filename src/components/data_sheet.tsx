import { Typography } from '@mui/material'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import ReactDataSheet from 'react-datasheet'
import 'react-datasheet/lib/react-datasheet.css'
import { Center } from '../sheet_builder_old/center'

export const DataSheet = observer(
    ({ grid_parent }: { grid_parent: { grid: { value: string }[][] } }) => {
        if (grid_parent.grid.length === 0) {
            return (
                <Center>
                    <Typography style={{ margin: '20px' }} variant='h5'>
                        Populate mutation to begin editing
                    </Typography>
                </Center>
            )
        }
        return (
            <ReactDataSheet
                data={grid_parent.grid as any}
                valueRenderer={(cell: any) => String(cell.value)}
                // cellRenderer={(cell: any) => (
                //     <span style={{ color: 'red', padding: '20px' }}>{String(cell.cell.value)}</span>
                // )}
                sheetRenderer={(props: any) => (
                    <table className={props.className} style={{ margin: '20px' }}>
                        {/* <thead>
                            <tr>
                                <th className='action-cell' />
                                <th style={{ width: '200px' }}>Sku</th>
                                <th style={{ width: '100px' }}>Quantity</th>
                            </tr>
                        </thead> */}
                        <tbody>{props.children}</tbody>
                    </table>
                )}
                rowRenderer={(props: any) => (
                    <tr>
                        <td>{props.row + 1}&nbsp;&nbsp;</td>
                        {props.children}
                    </tr>
                )}
                onCellsChanged={action((changes: any, additions: any) => {
                    const grid: any = grid_parent.grid.map(row => [...row])
                    changes.forEach(({ cell, row, col, value }: any) => {
                        grid[row][col] = { ...grid[row][col], value }
                    })
                    additions?.forEach(({ cell, row, col, value }: any) => {
                        if (!grid[row]) grid[row] = []
                        grid[row][col] = { ...grid[row][col], value }
                    })
                    grid_parent.grid = grid
                })}
            />
        )
    }
)
