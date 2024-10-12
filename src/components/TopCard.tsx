import { CardProps } from "./Card.js";

export default function TopCard({ id, className, style, children }: CardProps) {
    return (
        <div id={id} className={className != undefined ? `topcard ${className}` : "topcard"} style={style}>{children}</div>
    );
}