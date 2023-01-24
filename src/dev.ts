import babel from "https://esm.sh/@babel/core";
import babelPresetTs from "https://esm.sh/@babel/preset-typescript";
import babelPresetSolid from "https://esm.sh/babel-preset-solid";
import { walk } from "https://deno.land/std/fs/mod.ts";
import { resolve } from "https://deno.land/std@0.173.0/path/mod.ts";

async function createFile(path: string, clientContent: string, serverContent: string) {
  const clientPath = "./.kotai/client/" + path
  const serverPath = "./.kotai/server/" + path
  try {
    await Deno.mkdir(clientPath.substring(0, clientPath.lastIndexOf("/")), {
      recursive: true,
    });
  } catch {/* ignore */}
  try {
    await Deno.mkdir(serverPath.substring(0, serverPath.lastIndexOf("/")), {
      recursive: true,
    });
  } catch {/* ignore */}
  Deno.writeTextFile(clientPath, clientContent);
  Deno.writeTextFile(serverPath, serverContent);
}

function compileIsomorphic(src: string, fileName: string) {
  const server = babel.transform(src, {
    presets: [
      babelPresetTs,
      [babelPresetSolid, { generate: "ssr", hydratable: true }],
    ],
    filename: fileName,
  });
  const client = babel.transform(src, {
    presets: [
      babelPresetTs,
      [babelPresetSolid, { generate: "dom", hydratable: true }],
    ],
    filename: fileName,
  });
  return { server: server?.code, client: client?.code };
}

async function transform(sourcepath: string) {
  try{Deno.removeSync(resolve(Deno.cwd(), "./.kotai"), { recursive: true })}catch{}
  for await (const e of walk(sourcepath)) {
    if (e.isFile) {
      const src = await Deno.readTextFile(e.path);
      if (!e.path.endsWith(".ts") && !e.path.endsWith(".tsx")) {
        createFile(e.path, src, src);
        continue;
      }
      const { server, client } = compileIsomorphic(src, e.path);
      if (server && client) {
        await createFile(e.path, client, server);
      }
    }
  }
}

await transform("./src", "./.kotai");

const p = Deno.run({
  cmd: ["deno", "run", "-A", "./server.ts"],
});

await p.status();
