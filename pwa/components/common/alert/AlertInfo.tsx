import {ReactNode} from "react";

const AlertInfo = ({visible = false, titleMessage, message, children}: {
    visible: boolean,
    titleMessage: string,
    message?: string
    children?: ReactNode
}) => {
    return (visible &&
        <div className="bg-primary_light border-t border-b border-primary text-black px-4 py-3 rounded-md" role="alert">
            <p className="font-bold">{titleMessage}</p>
            <p className="text-sm">{message}</p>
            {children}
        </div>)

};
export default AlertInfo;