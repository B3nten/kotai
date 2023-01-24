import { generateHydrationScript } from "../deps.ts";

type createShellOptions = {
	body: string;
	importMap: string;
	useJSX: boolean;
	clientEntry: string;
}

export function createShell(options: createShellOptions) {
	const parsedClientEntry = options.clientEntry.split("./")[1]
	return `<!DOCTYPE html>
	<html>
		<head>
			<title>Solideno</title>
			<script type="importmap">
				${options.importMap}
			</script>
			<script async="" src="https://ga.jspm.io/npm:es-module-shims@1.6.2/dist/es-module-shims.js" crossorigin="anonymous"></script>
			${generateHydrationScript()}
		</head>
		<body>
			<div id="root">${options.body}</div>
			${
				options.useJSX
					? `<script type="module" src="/.kotai/client/${parsedClientEntry}"></script>`
					: `<script type="module" src="/_compiler/${parsedClientEntry}"></script>`
			}
		</body>
	</html>`;
}
