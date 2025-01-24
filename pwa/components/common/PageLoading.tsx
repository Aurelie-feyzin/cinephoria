import SpinnerIcon from "./Icon/SpinnerIcon";


const PageLoading = ({message}: {message?:string}) => (
    <div className="flex justify-center items-center h-screen">
        <div className="flex items-center space-x-3">
            <SpinnerIcon />
            {message && <span className="text-lg text-white">{message}</span>}
        </div>
    </div>
)

export default PageLoading;