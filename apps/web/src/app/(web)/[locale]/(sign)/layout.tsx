import '../../../../assets/styles/layout/signin.layout.scss';
import { PropsWithChildren } from "react";
import { Badge } from '@mantine/core';

const NonSignInLayout = async (prop : PropsWithChildren) => {
    return (
        <div className="layout layout-signin">
            <div className='split-section signin-image-section'>
                <div className='signin-hero'>
                    <Badge variant='white' color='dark'>WAIM</Badge>
                    <h1>Control Access, Keep Teams Aligned</h1>
                    <p>
                        그룹과 프로젝트 권한을 한 흐름으로 관리해 운영 리스크를 줄이고,
                        빠른 협업을 지원하세요.
                    </p>
                </div>
            </div>
            <div className='split-section signin-form-section'>
                <div className='signin-form-shell'>
                    {prop.children}
                </div>
            </div>
            
        </div>
    )
}

export default NonSignInLayout;