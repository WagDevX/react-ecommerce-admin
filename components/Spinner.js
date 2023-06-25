import { PulseLoader } from "react-spinners";

export default function Spinner ({fulllWidth}) {
    if (fulllWidth) {
        return (
            <div className="w-full flex justify-center">
                <PulseLoader color={'#1E3A8A'} speedMultiplier={1.5}/>
            </div>
        )
    }
    return (
        <PulseLoader color={'#1E3A8A'} speedMultiplier={1.5}/>
    )
}