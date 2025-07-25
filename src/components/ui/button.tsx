import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "border border-input bg-background hover:bg-transparent hover:bg-sombre",
                destructive: "bg-background bg-sombre hover:bg-primary",
                outline:
                    "w-full bg-sombre text-white hover:bg-black border border-white/20",
                secondary: "w-full bg-white text-black hover:bg-neutral-200",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                ghostInverted:
                    "w-full sm:w-auto bg-accent hover:bg-transparent hover:bg-accenthover",
                link: "bg-background hover:bg-transparent hover:bg-sombre",
            },
            size: {
                default: "h-10 rounded px-4 py-2",
                sm: "h-9 rounded px-3",
                lg: "h-11 rounded px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
