import type { HTMLAttributes, PropsWithChildren } from "react";

export type CardProps = PropsWithChildren<{
  id: string;
  className?: HTMLAttributes<HTMLElement>["className"];
  style?: HTMLAttributes<HTMLElement>["style"];
}>;

export default function TopBar({ id, className, style }: CardProps) {
    return (
        <div id={id} className={className != undefined ? `topbar card ${className}` : "topbar card"} style={style}>
            <button>Test</button>
        </div>
    );
}