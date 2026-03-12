'use client'

import { Anchor, Breadcrumbs, Text } from '@mantine/core';
import { usePathname, useSearchParams } from 'next/navigation';

const buildLabel = (segment: string) => {
	if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) {
		return segment;
	}

	const map: Record<string, string> = {
		group: 'Groups',
		project: 'Projects',
		add: 'Add',
		setting: 'Setting',
		settings: 'Settings',
		profile: 'Profile',
		logout: 'Logout',
	};

	if (map[segment]) {
		return map[segment];
	}

	return segment
		.replace(/_/g, ' ')
		.replace(/\b\w/g, (ch) => ch.toUpperCase());
};

export const MainBreadcrumbs = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const segments = pathname.split('/').filter(Boolean);

	// Locale-only path (e.g. /ko) is the main page, so breadcrumbs are hidden.
	const routeSegments = segments.slice(1);
	if (routeSegments.length === 0) {
		return null;
	}

	const projectAlias = searchParams.get('project_alias') ?? '';
	const groupIndex = routeSegments.indexOf('group');

	const items = routeSegments.map((segment, index) => {
		let href = `/${segments[0]}/${routeSegments.slice(0, index + 1).join('/')}`;
		const isLast = index === routeSegments.length - 1;
		const previousSegment = index > 0 ? routeSegments[index - 1] : '';

		let label = buildLabel(segment);
		if (groupIndex !== -1 && index > groupIndex && segment !== 'setting') {
			label = decodeURIComponent(segment);
		}
		if (previousSegment === 'project' && projectAlias) {
			label = projectAlias;
		}

		if (previousSegment === 'project' && projectAlias) {
			href = `${href}?project_alias=${encodeURIComponent(projectAlias)}`;
		}

		if (isLast) {
			return (
				<Text key={href} size='sm' c='dimmed' fw={500}>
					{label}
				</Text>
			);
		}

		return (
			<Anchor key={href} href={href} size='sm'>
				{label}
			</Anchor>
		);
	});

	return (
		<Breadcrumbs separator='/' mb='xs'>
			{items}
		</Breadcrumbs>
	);
};
