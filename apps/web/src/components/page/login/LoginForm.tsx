'use client'
import { LoginAction } from "@root/libs/actions/AuthAction";
import { useTranslations } from "next-intl";
import { Fragment, SubmitEvent, useState } from "react";

export const LoginForm = () => {
    const t = useTranslations();

    const [isLoading, setLoading] = useState<boolean>(false);


    const submitEventHandler = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const signInActionResult = await LoginAction(formData);

        if (signInActionResult.state === false) {
            alert(signInActionResult.message);
            setLoading(false);
        }
        else {
            setLoading(false);
            window.location.replace('/');
        }
    }

    return (
        <form onSubmit={submitEventHandler} method="POST">
            {
                isLoading === false
                    ? (
                        <Fragment>
                            <input type="text" name="username" autoFocus autoComplete="username" />
                            <input type="password" name="password" autoComplete="current-password" />
                            <button type="submit">
                                {/* 로그인 */}
                                {t('page.login.login_submit_bt')}
                            </button>
                        </Fragment>
                    )
                    : (
                        <Fragment>
                            LOADING
                        </Fragment>
                    )
            }
        </form>

    )
}