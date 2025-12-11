enum PID {
	EventBD, // s <-> c
	HelloS2C, // s --> c
	InitC2S, // s <-- c
	HeartbeatC2S // s <-- c
}

export type PacketHandler = (ws: LanyardWebsocket, data: LanyardPacket) => void;

export class LanyardWebsocket {
	private _ws?: WebSocket;
	private readonly _url: string;
	private readonly _userId: string;

	// our events
	private _onHelloReceived: PacketHandler | null = this.setup;

	private _s2c: Record<PID, PacketHandler | null> = {
		[PID.EventBD]: null,
		[PID.HelloS2C]: this._onHelloReceived,
		[PID.InitC2S]: null,
		[PID.HeartbeatC2S]: null
	};

	public constructor(userId: string, url: string = 'wss://api.lanyard.rest/socket') {
		this._url = url;
		this._userId = userId;
	}

	public set onEventReceived(handler: PacketHandler) {
		this._s2c[PID.EventBD] = handler;
	}

	public async start() {
		this._ws = new WebSocket(this._url);
		this._ws.onmessage = async (res) => {
			const packet: LanyardPacket = JSON.parse(res.data);

			const handler: PacketHandler | null = this._s2c[packet.op as PID];
			if (handler) handler(this, packet);
		};
	}

	public stop() {
		this._ws?.close();
	}

	private sendInit(data: LanyardInitPacket) {
		this._ws?.send(
			JSON.stringify({
				op: PID.InitC2S,
				d: data
			})
		);
	}

	private sendHeartbeat() {
		this._ws?.send(JSON.stringify({ op: PID.HeartbeatC2S }));
	}

	private setup(ws: LanyardWebsocket, data: LanyardPacket) {
		ws.sendInit({
			subscribe_to_id: ws._userId
		});

		const int = (data.d as LanyardHelloPacket).heartbeat_interval;

		// https://lanyard.eggsy.xyz/api/working-with-websockets | Heartbeat
		setInterval(ws.sendHeartbeat, int);
	}
}
