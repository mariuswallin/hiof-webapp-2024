#!/usr/bin/env node

const { exec, spawn } = require("node:child_process");
const { promisify } = require("node:util");
const readline = require("node:readline");

const execAsync = promisify(exec);

function question(query) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) =>
		rl.question(query, (ans) => {
			rl.close();
			resolve(ans);
		}),
	);
}

async function isZxInstalled() {
	try {
		require("zx");
		return true;
	} catch (e) {
		return false;
	}
}

async function installZx(pm) {
	console.log("Installerer ZX...");
	await execAsync(`${pm} add zx`);
}

async function installInDir(dir, pm) {
	console.log(`Installerer avhengigheter i ${dir}...`);
	try {
		await execAsync(`cd ${dir} && ${pm} install`);
	} catch (error) {
		console.error(`Error in ${dir}:`, error.message);
	}
}

async function main() {
	try {
		const pm = await question("Velg (npm/pnpm): ");

		if (pm !== "npm" && pm !== "pnpm") {
			console.error("Invalid package manager. Bruk npm eller pnpm.");
			process.exit(1);
		}

		if (!(await isZxInstalled())) {
			await installZx(pm);
		}

		console.log("Starter setup...");

		await installInDir("backend", pm);
		await installInDir("frontend-ts", pm);
		await installInDir("frontend-react", pm);

		console.log("Installing dependencies i mappen du startet scriptet...");
		await execAsync(`${pm} install`);

		console.log("Setup ferdig");

		const startDev = await question("Starte applikasjonene? (y/n): ");
		if (startDev.toLowerCase() === "y") {
			console.log("Starter applikasjoner...");
			const child = spawn(pm, ["run", "dev"], {
				stdio: "inherit",
				shell: true,
			});
			console.log(`Dev server startet. Process ID: ${child.pid}`);
			console.log("Du kan stoppe applikasjonene med Ctrl+C");
		} else {
			console.log(`Du kan starter applikasjonene seinere med '${pm} run dev'`);
		}
	} catch (error) {
		console.error("Noe gikk galt:", error);
	}
}

main();
