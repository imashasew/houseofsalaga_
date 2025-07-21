import { forwardRef } from "react";
import "./button.css"; // Import the new CSS file

const Button = forwardRef(
    (
        {
            className = "",
            variant = "default",
            size = "default",
            children,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const variantClasses = {
            default: "btn-default",
            outline: "btn-outline",
            ghost: "btn-ghost",
            link: "btn-link",
        };

        const sizeClasses = {
            default: "btn-size-default",
            sm: "btn-size-sm",
            lg: "btn-size-lg",
            icon: "btn-size-icon",
        };

        const combinedClassName = `btn-base ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.default} ${className}`;

        return (
            <button
                className={combinedClassName}
                ref={ref}
                disabled={disabled}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };