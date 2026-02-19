'use client'

import { useEffect } from "react";
import { LogoutAction } from "@/libs/actions/AuthAction";
import { useRouter } from "next/navigation";
import { useGlobalLoading } from "@/components/page/main/global/GlobalLoadingProvider";

const LogoutPage = () => {
    const router = useRouter();
    const globalLoading = useGlobalLoading();

    useEffect(() => {
        const performLogout = async () => {
            const result = await LogoutAction();
            if (result.state) {
                router.push("/login");
            } else {
                router.push("/");
            }
        };

        performLogout();
    }, [router]);

    useEffect(() => {

        globalLoading.setLoadingState(true);

        return (() => {
                globalLoading.setLoadingState(false);
        })
    },[])

    return <div></div>;
};

export default LogoutPage;