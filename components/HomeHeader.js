import { useSession } from "next-auth/react";

export default function HomeHeader() {
  const { data: session } = useSession();
  return (
    <div className="text-blue-900 flex justify-between items-center">
      <h2 className="mt-0">
        <div className="flex gap-2 items-center">
          <img className="w-10 h-10 rounded-md sm:hidden" src={session?.user?.image}></img>
          <div>
            Hello, <b>{session?.user?.name}</b>
          </div>
        </div>
      </h2>
      <div className="hidden sm:block">
        <div className="bg-gray-300 flex  text-black gap-1 rounded-lg overflow-hidden items-center">
          <img className="w-10 h-10" src={session?.user?.image}></img>
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
    </div>
  );
}
