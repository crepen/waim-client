import { BiMenu } from "react-icons/bi"
import { AuthProvider } from "@crepen/auth"
import authConfig from "@/config/auth/AuthConfig"
import { getLocale } from "next-intl/server"

export const MainNav = async () => {

    const locale = await getLocale();
    const sessionUser = await AuthProvider.setConfig(authConfig(locale)).getUser();

    return (
        <nav>
            <div className='nav-item nav-top'>
                <span>WAIM</span>
                <button>
                    <BiMenu style={{ verticalAlign: 'middle' }} />
                </button>
            </div>
            <div className='nav-item nav-container'>
                CONTAINER
            </div>
            <div className='nav-item nav-footer'>
                <div className="nav-profile">
                    {sessionUser?.name ?? "NON USER"}
                </div>
            </div>
        </nav>
    )
}