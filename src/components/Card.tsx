import type { HTMLAttributes, PropsWithChildren } from "react";

export type CardProps = PropsWithChildren<{
  id: string;
  className?: HTMLAttributes<HTMLElement>["className"];
  style?: HTMLAttributes<HTMLElement>["style"];
}>;

export default function Card({ id, className, style, children }: CardProps) {
    return (
        <div id={id} className={className != undefined ? `card ${className}` : "card"} style={style}>{children}</div>
    );
}