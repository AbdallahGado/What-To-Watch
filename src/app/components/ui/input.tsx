import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-brand-500 selection:text-white flex h-10 w-full min-w-0 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-foreground transition-all duration-300 outline-none backdrop-blur-md file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-brand-500/50 focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:bg-black/60",
        "aria-invalid:ring-red-500/30 aria-invalid:border-red-500",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
