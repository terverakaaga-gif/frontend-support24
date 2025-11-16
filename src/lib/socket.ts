import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL =
	"https://backend-guardian-care-pro-0bc1ad551029.herokuapp.com";

let socket: Socket | null = null;
let listenersInitialized = false;

const initializeListeners = () => {
	if (!socket || listenersInitialized) return;

	socket.on("connect", () => {
	});

	socket.on("disconnect", () => {
	});

	socket.on("connect_error", (err) => {
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
