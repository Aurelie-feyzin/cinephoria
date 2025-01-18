const AlertError = ({visible = false, titleMessage, message}: {
    visible: boolean,
    titleMessage: string,
    message?: string
}) => {
    return (visible &&
    <div className="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 rounded-md" role="alert">
    <p className="font-bold">{titleMessage}</p>
        <p className="text-sm">{message}</p>
        </div>)

};
export default AlertError