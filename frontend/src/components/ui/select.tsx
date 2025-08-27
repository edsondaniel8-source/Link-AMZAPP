import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Simple native select components to replace Radix UI
interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

const Select = ({ value, onValueChange, children }: SelectProps) => {
  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectTrigger) {
          return React.cloneElement(child as any, { value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

const SelectTrigger = React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  ({ className, children, value, onValueChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value || "");

    React.useEffect(() => {
      setSelectedValue(value || "");
    }, [value]);

    const handleSelect = (newValue: string) => {
      setSelectedValue(newValue);
      onValueChange?.(newValue);
      setIsOpen(false);
    };

    return (
      <div className="relative" ref={ref}>
        <div
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
          {...props}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === SelectValue) {
              return React.cloneElement(child as any, { selectedValue });
            }
            return null;
          })}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
        
        {isOpen && (
          <div className="absolute top-full left-0 w-full mt-1 bg-background border border-input rounded-md shadow-lg z-50 max-h-60 overflow-auto">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.type === SelectContent) {
                return React.cloneElement(child as any, { onSelect: handleSelect, selectedValue });
              }
              return null;
            })}
          </div>
        )}
        
        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

interface SelectValueProps {
  placeholder?: string;
  selectedValue?: string;
}

const SelectValue = ({ placeholder, selectedValue }: SelectValueProps) => {
  return (
    <span className={cn(!selectedValue && "text-muted-foreground")}>
      {selectedValue || placeholder}
    </span>
  );
};

interface SelectContentProps {
  children: React.ReactNode;
  onSelect?: (value: string) => void;
  selectedValue?: string;
}

const SelectContent = ({ children, onSelect, selectedValue }: SelectContentProps) => {
  return (
    <div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          return React.cloneElement(child as any, { onSelect, selectedValue });
        }
        return child;
      })}
    </div>
  );
};

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  onSelect?: (value: string) => void;
  selectedValue?: string;
  className?: string;
  [key: string]: any;
}

const SelectItem = ({ value, children, onSelect, selectedValue, className, ...props }: SelectItemProps) => {
  const isSelected = selectedValue === value;
  
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        isSelected && "bg-accent text-accent-foreground",
        className
      )}
      onClick={() => onSelect?.(value)}
      {...props}
    >
      {children}
    </div>
  );
};

// Unused components - keeping for compatibility
const SelectGroup = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const SelectScrollUpButton = () => null;
const SelectScrollDownButton = () => null;
const SelectSeparator = () => <div className="h-px bg-muted" />;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectSeparator,
}