import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL =
	"https://backend-guardian-care-pro-0bc1ad551029.herokuapp.com";

let socket: Socket | null = null;
let listenersInitialized = false;

const initializeListeners = () => {
	if (!socket || listenersInitialized) return;

	socket.on("connect", () => {
		console.log("Socket connected successfully");
	});

	socket.on("disconnect", (reason) => {
		console.log("Socket disconnected:", reason);
	});

	socket.on("connect_error", (err) => {
		console.error("Socket connection error:", err);
	});

	listenersInitialized = true;
};

export const initializeSocket = (token: string) => {
	// Disconnect existing socket if any
	if (socket) {
		socket.disconnect();
		socket = null;
		listenersInitialized = false;
	}

	socket = io(SOCKET_SERVER_URL, {
		auth: { token },
		autoConnect: true,
		reconnection: true,
		reconnectionAttempts: 5,
		reconnectionDelay: 1000,
		path: "/socket.io",
		transports: ["websocket", "polling"], // Allow fallback to polling
	});

	initializeListeners();
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
		socket.removeAllListeners();
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
