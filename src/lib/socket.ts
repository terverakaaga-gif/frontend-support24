import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL =
	"https://backend-guardian-care-pro-0bc1ad551029.herokuapp.com";

let socket: Socket | null = null;
let listenersInitialized = false;

const initializeListeners = () => {
	if (!socket || listenersInitialized) return;

	socket.on("connect", () => {
		console.log("Socket connected:", socket?.id);
	});

	socket.on("disconnect", () => {
		console.log("Socket disconnected");
	});

	socket.on("connect_error", (err) => {
		console.error("Socket connection error:", err);
	});

	listenersInitialized = true;
};

export const initializeSocket = (token: string) => {
	if (!socket) {
		socket = io(SOCKET_SERVER_URL.replace("https","wss"), {
			auth: { token },
			autoConnect: true,
			reconnection: true,
			path: "/socket.io",
			transports: ["websocket"],
		});

		initializeListeners();
	}
	return socket;
};

export const getSocket = () => {
	if (!socket) {
		throw new Error("Socket not initialized. Call initializeSocket first.");
	}
	return socket;
};

export const disconnectSocket = () => {
	if (socket) {
		socket.disconnect();
		socket = null;
		listenersInitialized = false;
		console.log("Socket disconnected and cleaned up");
	}
};

export const updateSocketToken = (newToken: string) => {
	if (socket) {
		socket.auth = { token: newToken };
		// Force reconnection with new token if needed
		if (!socket.connected) {
			socket.connect();
		}
	}
};
