import '../../../../assets/styles/layout/main.layout.scss';
import { PropsWithChildren } from "react";
import { MainNav } from '@/components/layout/main/MainNav';

const MainLayout = (prop : PropsWithChildren) => {

    return (
        <div className="layout main-layout">
            <header>
                HEADER
            </header>
            <MainNav />
           
            <main>
                {prop.children}
            </main>
        </div>
    )
}


export default MainLayout;