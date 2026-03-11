"use server"
import '../../../../../assets/styles/pages/signin.page.scss'
import { GetPublicSignupPolicyAction } from '@/libs/actions/AdminSiteSettingsAction';
import { LoginForm } from "@root/components/page/login/LoginForm";

const LoginPage = async () => {
    const signupPolicyRes = await GetPublicSignupPolicyAction();
    const isSignupEnabled = signupPolicyRes.data.signupEnabled === 'yes';

    return (
        <div className="section-box sign-in-page">
            <div className="section-title">
                <h1>WAIM</h1>
            </div>
            <div className='sign-in-form'>
                <LoginForm showSignupLink={isSignupEnabled} />
            </div>
        </div>

    )
}

export default LoginPage;