const GENERIC_API_MESSAGES = [
    'server connect failed.',
    'system error.',
    'unknown error',
    '알 수 없는 오류입니다.',
    '알수없는 오류입니다.'
];

export const resolveApiMessage = (message?: string | null): string | undefined => {
    if (!message || message.trim().length === 0) {
        return undefined;
    }

    const normalized = message.trim().toLowerCase();

    if (GENERIC_API_MESSAGES.includes(normalized)) {
        return undefined;
    }

    return message;
};
