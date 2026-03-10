import { BiLoaderCircle } from "react-icons/bi";

export default function LoadingIcon() {
    return (
        <div className="flex h-full items-center justify-center">
          <BiLoaderCircle className="animate-spin text-blue-500" size={48} />
        </div>
    );
}