import { MainContainer, MainContainerHeader, MainContainerScrollContent } from '@/components/layout/common/page-container/PageContainer';
import authConfig from '@/config/auth/AuthConfig';
import { AuthProvider } from '@crepen/auth';
import { Badge, Box, Button, Card, Flex, Group, NativeSelect, Space, Stack, Text, TextInput, ThemeIcon, Title } from '@mantine/core';
import { UserApiProvider } from '@waim/api';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { SlUser } from 'react-icons/sl';

type AdminUsersPageProps = {
    searchParams: Promise<{ page?: string, keyword?: string, status?: string }>
}

const AdminUsersPage = async ({ searchParams }: AdminUsersPageProps) => {
    const locale = await getLocale();
    const t = await getTranslations('main.admin');
    const query = await searchParams;

    const page = Math.max(0, Number(query?.page ?? '0') || 0);
    const keyword = (query?.keyword ?? '').trim();
    const status = (query?.status ?? '').trim().toUpperCase();

    const session = await AuthProvider
        .setConfig(authConfig(locale, ''))
        .getSession();

    const userRes = await UserApiProvider.searchAdminUsers(
        {
            page,
            size: 20,
            keyword: keyword || undefined,
            status: status || undefined
        },
        {
            locale,
            token: session?.token?.accessToken ?? ''
        }
    );

    const rows = userRes.data ?? [];
    const totalPage = Math.max(1, userRes.pageable?.total_page ?? 1);
    const currentPage = page + 1;

    const buildPageHref = (targetPage: number) => {
        const params = new URLSearchParams();

        params.set('page', String(Math.max(0, targetPage - 1)));

        if (keyword) {
            params.set('keyword', keyword);
        }

        if (status) {
            params.set('status', status);
        }

        return `/${locale}/admin/users?${params.toString()}`;
    };

    const visiblePageCount = 7;
    const half = Math.floor(visiblePageCount / 2);
    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPage, startPage + visiblePageCount - 1);

    if ((endPage - startPage + 1) < visiblePageCount) {
        startPage = Math.max(1, endPage - visiblePageCount + 1);
    }

    const pageNumbers = Array.from({ length: (endPage - startPage) + 1 }, (_, index) => startPage + index);

    const getStatusColor = (userStatus: string) => {
        if (userStatus === 'ACTIVE') {
            return 'teal';
        }

        if (userStatus === 'INACTIVE') {
            return 'gray';
        }

        if (userStatus === 'BLOCK') {
            return 'red';
        }

        return 'gray';
    };

    return (
        <MainContainer>
            <MainContainerHeader>
                <Box>
                    <Title order={4}>{t('users_title')}</Title>
                    <Text c='dimmed'>{t('users_desc')}</Text>
                </Box>
            </MainContainerHeader>
            <MainContainerScrollContent>
                <Box p='md'>
                    <Stack gap='md'>
                        <Card withBorder>
                            <form method='GET'>
                                <Flex justify='space-between' align='center' gap='sm' wrap='wrap'>
                                    <Group gap='xs' align='end'>
                                        <TextInput
                                            name='keyword'
                                            w={320}
                                            size='md'
                                            placeholder={t('search_keyword_placeholder')}
                                            defaultValue={keyword}
                                        />
                                        <NativeSelect
                                            name='status'
                                            size='md'
                                            defaultValue={status}
                                            data={[
                                                { value: '', label: t('status_all') },
                                                { value: 'ACTIVE', label: 'ACTIVE' },
                                                { value: 'INACTIVE', label: 'INACTIVE' },
                                                { value: 'BLOCK', label: 'BLOCK' }
                                            ]}
                                        />
                                        <Button type='submit' size='md' variant='light'>
                                            {t('search_button')}
                                        </Button>
                                    </Group>
                                    <Group>
                                        <Text size='sm' c='dimmed'>
                                            {t('user_count', { count: userRes.pageable?.total_element ?? 0 })}
                                        </Text>
                                        <Button component='a' href={`/${locale}/admin/users/add`} size='md'>
                                            {t('user_add_button')}
                                        </Button>
                                    </Group>
                                </Flex>
                            </form>
                        </Card>

                        <Card withBorder>
                            <Space h='xs' />

                            <Stack gap='xs'>
                                {rows.length > 0
                                    ? rows.map((item) => (
                                        <Link
                                            key={item.uid}
                                            href={`/${locale}/admin/users/${encodeURIComponent(item.userId)}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <Card withBorder px='md' py='sm' style={{ cursor: 'pointer' }}>
                                                <Flex justify='space-between' align='center' wrap='wrap' gap='xs'>
                                                    <Group gap='xs'>
                                                        <ThemeIcon radius='xl' size='sm' color='blue' variant='light'>
                                                            <SlUser size={12} />
                                                        </ThemeIcon>
                                                        <Badge color='blue' variant='light'>{item.role}</Badge>
                                                        <Badge color='gray' variant='light'>{item.userId}</Badge>
                                                        <Text fw={600}>{item.userName}</Text>
                                                    </Group>
                                                    <Group gap='xs'>
                                                        <Badge variant='light' color={getStatusColor(item.status)}>
                                                            {item.status}
                                                        </Badge>
                                                    </Group>
                                                </Flex>
                                                <Text size='xs' c='dimmed' mt={4}>
                                                    {item.email || '-'}
                                                </Text>
                                            </Card>
                                        </Link>
                                    ))
                                    : (
                                        <Text c='dimmed' size='sm'>{t('user_list_empty')}</Text>
                                    )}
                            </Stack>

                            {totalPage > 1 && (
                                <>
                                    <Space h='md' />
                                    <Group justify='center'>
                                <Button
                                    component='a'
                                    href={buildPageHref(Math.max(1, currentPage - 1))}
                                    variant='default'
                                    size='xs'
                                    disabled={currentPage <= 1}
                                >
                                    {'<'}
                                </Button>

                                {pageNumbers.map((pageNo) => (
                                    <Button
                                        key={pageNo}
                                        component='a'
                                        href={buildPageHref(pageNo)}
                                        variant={pageNo === currentPage ? 'filled' : 'light'}
                                        size='xs'
                                    >
                                        {pageNo}
                                    </Button>
                                ))}

                                <Button
                                    component='a'
                                    href={buildPageHref(Math.min(totalPage, currentPage + 1))}
                                    variant='default'
                                    size='xs'
                                    disabled={currentPage >= totalPage}
                                >
                                    {'>'}
                                </Button>
                                    </Group>
                                </>
                            )}

                            {userRes.state !== true && (
                                <Text c='orange' size='sm' mt='sm'>{userRes.message ?? t('user_list_failed')}</Text>
                            )}
                        </Card>
                    </Stack>
                </Box>
            </MainContainerScrollContent>
        </MainContainer>
    );
};

export default AdminUsersPage;
