import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close

const SheetPortal = (props: SheetPrimitive.DialogPortalProps) => (
    <SheetPrimitive.Portal {...props} />
)

const SheetOverlay = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm",
            className
        )}
        {...props}
    />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const SheetContent = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: "top" | "bottom" | "left" | "right"
}
>(({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Content
            ref={ref}
            className={cn(
                "fixed z-50 gap-4 bg-background p-6 shadow-lg duration-200",
                side === "top" && "inset-x-0 top-0 border-b",
                side === "bottom" && "inset-x-0 bottom-0 border-t",
                side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r",
                side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l",
                className
            )}
            {...props}
        >
            {children}
            <SheetPrimitive.Close className="absolute top-4 right-4">
                <X className="h-6 w-6" />
            </SheetPrimitive.Close>
        </SheetPrimitive.Content>
    </SheetPortal>
))
SheetContent.displayName = "SheetContent"

export {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
}