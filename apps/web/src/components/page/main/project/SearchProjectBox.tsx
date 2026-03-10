'use client'

import { Box, Button, Card, CloseButton, Divider, Flex, FocusTrap, Group, Input, Modal, Stack, Text, TextInput } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react"
import type { GroupData } from "@waim/api";
import { useTranslations } from "next-intl";

type SearchProjectBoxProp = {
    defaultKeyword?: string,
    defaultGroupUid?: string,
    groups?: GroupData[]
}

export const SearchProjectBox = (prop: SearchProjectBoxProp) => {
    const t = useTranslations('main.project');

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [inputValue, setInputValue] = useState(prop.defaultKeyword || "");
    const [groupUid, setGroupUid] = useState(prop.defaultGroupUid || "");
    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerSearch, setPickerSearch] = useState('');

    const selectedGroupName = useMemo(
        () => groupUid ? (prop.groups?.find((x) => x.uid === groupUid)?.group_name ?? groupUid) : '',
        [groupUid, prop.groups]
    );

    const candidates = useMemo(() => {
        const term = pickerSearch.trim().toLowerCase();
        return (prop.groups ?? [])
            .filter((x) => !term || (x.group_name ?? '').toLowerCase().includes(term) || (x.group_alias ?? '').toLowerCase().includes(term))
            .sort((a, b) => (a.group_name ?? '').localeCompare(b.group_name ?? ''));
    }, [pickerSearch, prop.groups]);


    const applyKeyword = (keyword?: string, targetGroupUid?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (keyword) {
            params.set('keyword', keyword ?? "");
        }
        else {
            params.delete('keyword');
        }

        if (targetGroupUid) {
            params.set('group_uid', targetGroupUid);
        }
        else {
            params.delete('group_uid');
        }

        params.delete('page')


        router.push(`${pathname}?${params.toString()}`);
    }

    return (

        <FocusTrap active={true}>
            <Flex
                align='center'
                gap={'sm'}
            >
                <Box
                    w={400}
                >
                    <Input
                        placeholder={t('search_placeholder')}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.currentTarget.value)}
                        onKeyUp={(evt) => evt.key === 'Enter' && applyKeyword(inputValue, groupUid)}
                        rightSectionPointerEvents="all"
                        rightSection={
                            inputValue && <CloseButton
                                aria-label="Clear input"
                                onClick={() => {
                                    setInputValue('');
                                    applyKeyword('', groupUid);
                                }}
                                style={{ display: inputValue ? undefined : 'none' }}
                            />
                        }
                    />
                </Box>

                <TextInput
                    w={260}
                    placeholder={t('group_placeholder')}
                    value={selectedGroupName}
                    readOnly
                    onClick={() => setPickerOpen(true)}
                    styles={{ input: { cursor: 'pointer' } }}
                    rightSection={
                        groupUid ? (
                            <CloseButton
                                aria-label="Clear group"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setGroupUid('');
                                }}
                            />
                        ) : undefined
                    }
                    rightSectionWidth={groupUid ? 28 : 0}
                />

                <Button
                    onClick={() => applyKeyword(inputValue, groupUid)}
                >
                    {t('search_button')}
                </Button>
            </Flex>

            <Modal opened={pickerOpen} onClose={() => setPickerOpen(false)} title={t('modal_select_group')} size="lg">
                <Stack>
                    <Input
                        placeholder={t('modal_search_group')}
                        value={pickerSearch}
                        onChange={(e) => setPickerSearch(e.currentTarget.value)}
                    />
                    <Divider />
                    <Stack gap="xs" mah={360} style={{ overflowY: 'auto' }}>
                        {candidates.map((item) => (
                            <Card withBorder key={item.uid}>
                                <Group justify="space-between">
                                    <Box>
                                        <Text fw={600}>{item.group_name}</Text>
                                        <Text size="xs" c="dimmed">{item.group_alias}</Text>
                                    </Box>
                                    <Button
                                        type="button"
                                        size="xs"
                                        onClick={() => {
                                            setGroupUid(item.uid);
                                            setPickerOpen(false);
                                        }}
                                    >
                                        {t('select')}
                                    </Button>
                                </Group>
                            </Card>
                        ))}
                        {candidates.length === 0 && <Text c="dimmed">{t('modal_no_groups')}</Text>}
                    </Stack>
                </Stack>
            </Modal>
        </FocusTrap>

    )
}