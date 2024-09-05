#!/usr/bin/env node

import { exec, spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import readline from "readline";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
		await import("zx");
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

// Main script content
const getScriptContent = (pm) => `
import { $ } from 'zx';

// Disable zx's default output
$.verbose = false;

// Function to install dependencies in a directory
async function installInDir(dir) {
  console.log(\`Installing dependencies in \${dir}...\`);
  try {
    await $\`cd \${dir} && ${pm} install\`;
  } catch (error) {
    console.error(\`Error in \${dir}:\`, error.message);
  }
}

// Main script
(async () => {
  console.log("Starting setup process...");

  // Install dependencies in backend
  await installInDir('backend');

  // Install dependencies in frontend-ts
  await installInDir('frontend-ts');

  // Install dependencies in frontend-react
  await installInDir('frontend-react');

  // Install dependencies in current directory
  console.log("Setting up current directory...");
  await $\`${pm} install\`;

  console.log("Setup complete. You can now run '${pm} run dev' to start the development server.");
})();
`;

// Check and install zx if necessary, then run the script
(async () => {
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

		// Write the script content to a temporary file
		const tempScriptPath = path.join(__dirname, "temp-script.mjs");
		await fs.writeFile(tempScriptPath, getScriptContent(pm));

		// Run the script using Node.js
		console.log("Running the main script...");
		const { stdout, stderr } = await execAsync(`node ${tempScriptPath}`);
		console.log(stdout);
		if (stderr) console.error(stderr);

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
	} finally {
		// Clean up the temporary script file
		const tempScriptPath = path.join(__dirname, "temp-script.mjs");
		try {
			await fs.unlink(tempScriptPath);
		} catch (error) {
			console.error("Error cleaning up temporary file:", error);
		}
	}
})();
