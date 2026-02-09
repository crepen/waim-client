import { DomUtil } from "@crepen/util"
import { Select } from "@mantine/core"
import { PropsWithChildren } from "react"

interface SettingRowItemProp extends PropsWithChildren {
    className?: string,
    title? : string
}

export const SettingRowItem = (prop: SettingRowItemProp) => {
    return (
        <div className={DomUtil.joinClassName("setting-row-item", prop.className)}>
            <div className="row-title">
                <span>{prop.title}</span>
            </div>
            <div className="row-contain">
               {prop.children}
            </div>
        </div>
    )
}