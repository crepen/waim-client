'use client'

import { Avatar, Button, Group, Menu, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

interface ProfileMenuButtonProps {
	profileName: string;
	isAdmin: boolean;
}

export const ProfileMenuButton = ({ profileName, isAdmin }: ProfileMenuButtonProps) => {
	const t = useTranslations('main.profileMenu');

	return (
		<Menu shadow='md' width={220} withArrow position='bottom-end'>
			<Menu.Target>
				<Button variant='subtle' color='gray' px='xs'>
					<Group gap='xs'>
						<Avatar radius='xl' size='sm'>
							{profileName.slice(0, 1).toUpperCase()}
						</Avatar>
						<Text size='sm' fw={600}>{profileName}</Text>
					</Group>
				</Button>
			</Menu.Target>

			<Menu.Dropdown>
				{isAdmin && <Menu.Label>ADMIN</Menu.Label>}
				<Menu.Item component='a' href='/profile'>
					{t('profile')}
				</Menu.Item>
				<Menu.Item component='a' href='/settings'>
					{t('settings')}
				</Menu.Item>
				<Menu.Divider />
				<Menu.Item component='a' href='/logout' color='red'>
					{t('logout')}
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
};
