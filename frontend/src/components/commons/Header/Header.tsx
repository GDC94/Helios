import { Input } from "@/components/ui/input";
import { BiSearch } from "react-icons/bi";

const Header = () => {
  return (
    <header className="flex items-center justify-between pt-[20px] pb-[20px] bg-white text-sentoraBlackTitle border-b border-gray-100 max-h-[64px]">
      <div className="max-w-[1340px] w-full mx-auto flex items-center justify-between px-[42px]">
        <h2 className="text-[20px] leading-[20px] font-bold text-sectionTitle">
          Dashboard
        </h2>
        <div className="relative flex items-center">
          <BiSearch className="absolute mt-[1px] left-4 top-1/2 transform -translate-y-[50%] translate-x-[50%] w-[12px] h-[12px] pointer-events-none text-[#515054]" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-2 py-2 rounded-lg bg-gray-50 text-black border-none w-[351px] text-[14px] placeholder:text-[#C0C0C5] placeholder:text-[14px] placeholder:font-medium"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
