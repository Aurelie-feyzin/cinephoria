import SpinnerIcon from "./Icon/SpinnerIcon";


const PageError = ({message}: {message?:string}) => (
    <div className="flex justify-center items-center h-screen">
        <div className="flex items-center space-x-3">
             <span className="text-lg text-white">{message ? message : 'Erreur...'}</span>
        </div>
    </div>
)

export default PageError;