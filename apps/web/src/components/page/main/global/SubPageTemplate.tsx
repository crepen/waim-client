import { DomUtil } from "@crepen/util"
import { PropsWithChildren } from "react"

interface SubPageTemplateProp extends PropsWithChildren {
    className? :string,
    pageTitle? : string
}

export const SubPageTemplate = (prop : SubPageTemplateProp) => {
    return (
        <div className={DomUtil.joinClassName("sub-page-template" , prop.className)}>
            <div className="page-title">
                {prop.pageTitle}
            </div>
            <div className="page-content">
                {prop.children}
            </div>
        </div>
    )
}