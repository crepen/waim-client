import '../../../../assets/styles/layout/signin.layout.scss';
import { PropsWithChildren } from "react";

const NonSignInLayout = async (prop : PropsWithChildren) => {
    return (
        <div className="layout layout-signin">
            <div className='split-section signin-image-section'>

            </div>
            <div className='split-section signin-form-section'>
                {prop.children}
            </div>
            
        </div>
    )
}

export default NonSignInLayout;