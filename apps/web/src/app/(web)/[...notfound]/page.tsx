import '../../../assets/styles/pages/notfound.page.scss';
import { NotFoundBackButton } from '@/components/global/NotFoundBackButton';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';

const NotFoundPage = async () => {
    const locale = await getLocale();
    const t = await getTranslations('page.notfound');

    return (
        <div className='notfound-page'>
            <div className='notfound-card'>
                <p className='notfound-code'>404</p>
                <h1 className='notfound-title'>{t('title')}</h1>
                <p className='notfound-desc'>{t('description')}</p>

                <div className='notfound-actions'>
                    <NotFoundBackButton
                        label={t('to_previous')}
                        fallbackHref={`/${locale}`}
                        className='notfound-btn notfound-btn-filled'
                    />
                    <Link href={`/${locale}`} className='notfound-btn notfound-btn-light'>
                        {t('to_home')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;