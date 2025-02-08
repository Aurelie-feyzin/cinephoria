import {ReactNode} from "react";

const AlertInfo = ({visible = false, titleMessage, message, children}: {
    visible: boolean,
    titleMessage: string,
    message?: string
    children?: ReactNode
}) => {
    return (visible &&
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3 rounded-md" role="alert">
            <p className="font-bold">{titleMessage}</p>
            <p className="text-sm">{message}</p>
            {children}
        </div>)

};
export default AlertInfo;