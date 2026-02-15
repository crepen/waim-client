import { BiMenu } from "react-icons/bi"
import { AuthProvider } from "@crepen/auth"
import authConfig from "@/config/auth/AuthConfig"
import { getLocale } from "next-intl/server"
import Link from "next/link"

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
                <ul>
                    <li>
                        <Link
                            href={'/project'}
                        >
                            Project
                        </Link>
                    </li>
                    <li>
                        <Link href={'/settings'}>Setting</Link>
                        </li>
                </ul>
            </div>
            <div className='nav-item nav-footer'>
                <div className="nav-profile">
                    {sessionUser?.name ?? "NON USER"}
                </div>
            </div>
        </nav>
    )
}