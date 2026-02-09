import { IconContext, IconType } from "react-icons"

interface NavMenuButtonProp {
    className?: string,
    buttonTitle: string,
    icon?: React.ReactNode
}

export const NavMenuButton = (prop: NavMenuButtonProp) => {
    return (
        <div className="nav-menu">
            <div className="menu-icon">{prop.icon}</div>
            <span className="menu-title">{prop.buttonTitle}</span>
        </div>
    )
}