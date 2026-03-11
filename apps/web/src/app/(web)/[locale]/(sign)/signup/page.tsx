import '../../../../../assets/styles/pages/signin.page.scss'
import { GetPublicSignupPolicyAction } from '@/libs/actions/AdminSiteSettingsAction';
import { SignupForm } from '@root/components/page/login/SignupForm';
import { redirect } from 'next/navigation';

type SignupPageProps = {
    params: Promise<{ locale: string }>
}

const SignupPage = async ({ params }: SignupPageProps) => {
    const { locale } = await params;
    const signupPolicyRes = await GetPublicSignupPolicyAction();

    if (signupPolicyRes.data.signupEnabled !== 'yes') {
        redirect(`/${locale}/login`);
    }

    return (
        <div className='section-box sign-in-page'>
            <div className='section-title'>
                <h1>WAIM</h1>
            </div>
            <div className='sign-in-form'>
                <SignupForm passwordPolicy={signupPolicyRes.data} />
            </div>
        </div>

    )
}

export default SignupPage;
