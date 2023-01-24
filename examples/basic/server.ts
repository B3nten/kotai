import Kotai from "kotai"

const kotai = new Kotai({
	serverEntry: "./src/server.entry.tsx",
	clientEntry: "./src/client.entry.tsx",
	importMap: "./importMap.json",
	port: 8000,
})

kotai.start()