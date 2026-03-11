import '../../../../../assets/styles/pages/signin.page.scss'
import { ForgotPasswordForm } from '@root/components/page/login/ForgotPasswordForm';

const ForgotPasswordPage = async () => {
    return (
        <div className='section-box sign-in-page'>
            <div className='section-title'>
                <h1>WAIM</h1>
            </div>
            <div className='sign-in-form'>
                <ForgotPasswordForm />
            </div>
        </div>
    )
}

export default ForgotPasswordPage;
