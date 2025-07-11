import { cn } from "@/lib/utils";

interface SectionTitleProps {
  children: string;
  className?: string;
}

const SectionTitle = ({ children, className }: SectionTitleProps) => {
  return (
    <h2
      className={cn(
        "text-[15px] pl-[1px] font-custom600 leading-[15px] text-sectionTitle mb-2",
        className
      )}
    >
      {children}
    </h2>
  );
};

export default SectionTitle;
