import Card from "./Card.js";

export interface MsgBoxProps {
  title: string;
  message: string;
  shown?: boolean;
  buttons?: {
    msgCancel?: boolean;
    msgOK?: boolean;
  };
}

export default function MsgBox({ title, message, shown = true, buttons = { msgCancel: false, msgOK: false } }: MsgBoxProps) {
  return (
    <div
      id="msgboxContainer"
      style={{
        display: shown ? "block": "none",
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 10,
        backgroundColor: "rgba(0, 0, 0, 0.5)"
      }}>
      <Card
        id="msgbox"
        style={{ position: "absolute" }}>
        <h1 id="msgTitle">{title}</h1>
        <p id="msgContent">{message}</p>
        <button
          id="msgCancel"
          className="button"
          style={{ display: buttons.msgCancel ? "block" : "none" }}>
          Cancel
        </button>
        <button
          id="msgOK"
          className="button"
          style={{ display: buttons.msgOK ? "block" : "none" }}>
          OK
        </button>
      </Card>
    </div>
  );
}