"use server"
import '../../../../../assets/styles/pages/signin.page.scss'
import { LoginForm } from "@root/components/page/login/LoginForm";

const LoginPage = async () => {
    return (
        <div className="section-box sign-in-page">
            <div className="section-title">
                <h1>WAIM</h1>
                <span>Web Access Information Management</span>
            </div>
            <div className='sign-in-form'>
                <LoginForm />
            </div>
        </div>

    )
}

export default LoginPage;