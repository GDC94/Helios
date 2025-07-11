import { CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LiaQuestionCircle } from "react-icons/lia";
import { RxDotsVertical } from "react-icons/rx";
import { LiaExpandArrowsAltSolid } from "react-icons/lia";
import { LiaDownloadSolid } from "react-icons/lia";
import { TfiBackRight } from "react-icons/tfi";

interface PerformarceChartHeaderProps {
  children: React.ReactNode;
}

const PerformarceChartHeader = ({ children }: PerformarceChartHeaderProps) => {
  return (
    <CardHeader className="p-0">
      <div className="px-[16px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full  border-b border-[EFEFF4]">
        <div className="flex items-center justify-center gap-[2.9px] py-[16px]">
          <h3 className="text-[#152935] font-[15px] leading-[15px]">
            Total Allocation
          </h3>
          <div className="flex items-end pt-[2px]">
            <Tooltip>
              <TooltipTrigger asChild>
                <LiaQuestionCircle className="h-[18px] w-[18px] text-[#808080] cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>
                  Shows the total distribution of the investment portfolio over
                  time.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
            <TfiBackRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#808080]" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
            <LiaDownloadSolid className="h-3 w-3 sm:h-4 sm:w-4 text-[#808080]" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
            <LiaExpandArrowsAltSolid className="h-3 w-3 sm:h-4 sm:w-4 text-[#808080]" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
            <RxDotsVertical className="h-3 w-3 sm:h-4 sm:w-4 text-[#808080]" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 py-[12px] px-[16px]">
        <div className="w-[9px] h-[9px] rounded-full bg-[#4A90E2]"></div>
        <span className="text-[11px] leading-[11px] text-gray-600">
          Total Allocation
        </span>
      </div>

      {children}
    </CardHeader>
  );
};

export default PerformarceChartHeader;
