import { resolve } from "../deps.ts";
import { Hono } from "https://deno.land/x/hono@v2.5.1/mod.ts";
import type { Context, Next } from "https://deno.land/x/hono@v2.5.1/mod.ts";
import { renderToString } from "../deps.ts";
import { createShell } from "./createShell.ts";
import { serve } from "https://deno.land/std@0.173.0/http/server.ts";
import { serveStatic, compiler } from "./middleware.ts";
import h from "https://esm.sh/solid-js/h?bundle";

type KotaiConfig = {
	root?: string;
	importMap?: string;
	clientEntry?: string;
	serverEntry?: string;
	useJSX?: boolean;
	port?: number;
};

export class Kotai {
	// KOTAI CONFIG
	config: KotaiConfig = {
		root: Deno.cwd(),
		importMap: "./importMap.json",
		clientEntry: "./client.entry.tsx",
		serverEntry: "./server.entry.tsx",
		useJSX: true,
		port: 7777,
	};
	// HONO INSTANCE
	hono = new Hono();
	// CUSTOM SERVER HANDLER
	handler:
		| ((ctx: Context, next: Next) => Promise<Response> | Response)
		| null = null;
	// SERVER ENTRY (DYNAMIC IMPORT)
	ServerEntry: any;
	// IMPORT MAP CONTENT
	importMap: Promise<string>;

	constructor(kotaiConfig: KotaiConfig) {
		// Set config
		this.config = { ...this.config, ...kotaiConfig };
		// dynamically import the server entry
		this.ServerEntry = kotaiConfig.serverEntry;
		// Get import map content
		this.importMap = Deno.readTextFile(
			resolve(this.config.root! + "/importMap.json")
		);

		/*
		 ROUTE INITALIZATION
		*/

		// Serve static files
		this.hono.get(
			"*",
			serveStatic({
				root: resolve(this.config.root!, "./"),
			})
		);

		// If not using JSX, use the compiler middleware to transpile TypeScript
		if (!this.config.useJSX) {
			this.hono.get(
				"/_compiler/*",
				compiler({
					root: resolve(Deno.cwd(), "./"),
				})
			);
		}
	}

	private defaultHandler = async (ctx: Context) => {
		const ServerEntry = this.ServerEntry;
		return ctx.html(
			createShell({
				body: renderToString(ServerEntry),
				clientEntry: this.config.clientEntry!,
				importMap: await this.importMap,
				useJSX: this.config.useJSX!,
			})
		);
	};

	// CUSTOM SERVER HANDLER
	public fetch() {
		// Serve the app
		this.hono.get("*", this.handler ?? this.defaultHandler);
		return this.hono.fetch;
	}
	// DENO SERVER HANDLER
	public start() {
		// Serve the app
		this.hono.get("*", this.handler ?? this.defaultHandler);
		serve(this.hono.fetch, { port: this.config.port });
	}
}
