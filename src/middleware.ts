import { Context, Next } from "https://deno.land/x/hono@v2.5.1/mod.ts";
import {
  extname,
  join,
  toFileUrl,
} from "https://deno.land/std@0.164.0/path/mod.ts";
import { getFilePath } from "https://deno.land/x/hono@v2.5.1/utils/filepath.ts";
import { getMimeType } from "https://deno.land/x/hono@v2.5.1/utils/mime.ts";

import babel from "https://esm.sh/@babel/core";
import babelPresetTs from "https://esm.sh/@babel/preset-typescript";
import babelPresetSolid from "https://esm.sh/babel-preset-solid";

export const serveStatic = (options: any = { root: "" }) => {
  return async (
    context: Context,
    next: Next,
  ): Promise<Response | undefined> => {
    // Do nothing if Response is already set
    if (context.res && context.finalized) {
      await next();
    }
    const regex = /[server]+$/i
    if(regex.test(context.req.url)){
      await next();
    }
    const url = new URL(context.req.url);
    let path = getFilePath({
      filename: options.path ?? url.pathname,
      root: options.root,
    });
    path = `/${path}`;
    try {
      const response = await fetch(toFileUrl(path));
      const headers = new Headers(response.headers);
      if (response.ok) {
        const mimeType = getMimeType(path) || headers.get("content-type");
        if (mimeType) {
          headers.append("Content-Type", mimeType);
        } else {
          headers.append("Content-Type", "application/javascript");
        }
        return new Response(response.body, { status: 200, headers });
      } else {
        await next();
      }
      return;
    } catch (_error) {
      await next();
    }
  };
};

export const compiler = (options: { root: string }) => {
  const { root } = options;

  return async (context: Context, next: Next) => {
    const method = context.req.method;
    const requestPathname = new URL(context.req.url).pathname;
    const pathname = requestPathname.replace(`_compiler/`, "");

    const extension = extname(pathname);
    const path = join(root, pathname);
    const url = toFileUrl(path);

    const isCompilerTarget = [".ts", ".tsx", ".js", ".jsx"].includes(
      extension,
    );

    if (method === "GET" && isCompilerTarget) {
      const bytes = await fetch(url).then((response) => response.arrayBuffer());
      const source = new TextDecoder().decode(bytes);
      try {
        const code = babel.transform(source, {
          presets: [
            babelPresetTs,
          ],
          filename: path,
        });
        return new Response(code?.code, {
          status: 200,
          headers: {
            "content-type": "text/javascript; charset=utf-8",
          },
        });
      } catch (error) {
        console.log(error);
      }
    }

    await next();
  };
};
