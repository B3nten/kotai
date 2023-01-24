import Kotai from "kotai"
import serverEntry from "./.kotai/server/src/server.entry.tsx"

const kotai = new Kotai({
	serverEntry: serverEntry,
	clientEntry: "./src/client.entry.tsx",
	importMap: "./importMap.json",
	port: 8000,
})

kotai.start()