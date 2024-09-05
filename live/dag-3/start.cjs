#!/usr/bin/env node

const { exec, spawn } = require("child_process");
const { promisify } = require("util");
const readline = require("readline");

const execAsync = promisify(exec);

// Function to get user input
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

// Check if zx is installed
async function isZxInstalled() {
	try {
		require("zx");
		return true;
	} catch (e) {
		return false;
	}
}

// Install zx locally
async function installZx(pm) {
	console.log("Installing zx locally...");
	await execAsync(`${pm} add zx`);
}

// Function to install dependencies in a directory
async function installInDir(dir, pm) {
	console.log(`Installing dependencies in ${dir}...`);
	try {
		await execAsync(`cd ${dir} && ${pm} install`);
	} catch (error) {
		console.error(`Error in ${dir}:`, error.message);
	}
}

// Main script
async function main() {
	try {
		// Get package manager from user input
		const pm = await question(
			"Which package manager do you want to use? (npm/pnpm): ",
		);

		if (pm !== "npm" && pm !== "pnpm") {
			console.error("Invalid package manager. Please use npm or pnpm.");
			process.exit(1);
		}

		if (!(await isZxInstalled())) {
			await installZx(pm);
		}

		console.log("Starting setup process...");

		// Install dependencies in backend
		await installInDir("backend", pm);

		// Install dependencies in frontend-ts
		await installInDir("frontend-ts", pm);

		// Install dependencies in frontend-react
		await installInDir("frontend-react", pm);

		// Install dependencies in current directory
		console.log("Setting up current directory...");
		await execAsync(`${pm} install`);

		console.log(
			"Setup complete. You can now run '${pm} run dev' to start the development server.",
		);

		// Ask if the user wants to start the dev server
		const startDev = await question(
			"Do you want to start the dev server now? (y/n): ",
		);
		if (startDev.toLowerCase() === "y") {
			console.log("Starting dev server...");
			const child = spawn(pm, ["run", "dev"], {
				stdio: "inherit",
				shell: true,
			});
			console.log(`Dev server started. Process ID: ${child.pid}`);
			console.log("You can stop the server with Ctrl+C");
		} else {
			console.log(
				`You can start the dev server later by running '${pm} run dev'`,
			);
		}
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

// Run the main function
main();
