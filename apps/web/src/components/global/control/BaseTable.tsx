import { PropsWithChildren } from "react";

type BaseTableHeader = {
    [key : string] : string
}

export interface BaseTableProp extends PropsWithChildren {
    header?: BaseTableHeader
}

export const BaseTable = (prop: BaseTableProp) => {
    return (
        <table>
            <thead>
                {
                    prop.header &&
                    (
                        <th>
                            {
                                Object.keys(prop.header).map(headerItem => (
                                    <td key={headerItem}> {prop.header![headerItem]} </td>
                                ))
                            }
                        </th>
                    )
                }
            </thead>
            <tbody>
                {prop.children}
            </tbody>
        </table>
    )
}


