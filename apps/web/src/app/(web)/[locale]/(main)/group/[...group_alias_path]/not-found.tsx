import '@/assets/styles/pages/group-notfound.inline.scss';
import { NotFoundBackButton } from '@/components/global/NotFoundBackButton';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';

const GroupNotFoundPage = async () => {
    const locale = await getLocale();
    const t = await getTranslations('page.group_notfound');

    return (
        <div className='group-notfound-wrap'>
            <div className='group-notfound-card'>
                <p className='group-notfound-code'>404</p>
                <h1 className='group-notfound-title'>{t('title')}</h1>
                <p className='group-notfound-desc'>{t('description')}</p>

                <div className='group-notfound-actions'>
                    <NotFoundBackButton
                        label={t('to_previous')}
                        fallbackHref={`/${locale}/group`}
                        className='group-notfound-btn group-notfound-btn-filled'
                    />
                    <Link href={`/${locale}/group`} className='group-notfound-btn group-notfound-btn-light'>
                        {t('to_group_home')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default GroupNotFoundPage;
