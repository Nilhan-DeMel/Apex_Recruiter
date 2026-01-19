const { initializeApp, deleteApp } = require("firebase/app");
const { getAuth, signInAnonymously } = require("firebase/auth");
const { execSync } = require("child_process");

// List of project IDs
const projects = [
    "apexhren-275cf"
];

async function checkProject(projectId) {
    console.log(`Checking ${projectId}...`);
    try {
        // App ID finding logic
        console.log("  Getting apps...");
        // Use npx firebase and pipe stdio to avoid spawning shell issues if possible, or just shell handling
        // On Windows cmd, npx should work if node is installed.
        let appsOutput;
        try {
            appsOutput = execSync(`npx firebase apps:list --project ${projectId} --json`, { stdio: 'pipe' }).toString();
        } catch (e) {
            // If npx fails, try firebase directly (if in path), or just fail
            console.log("  CLI command failed:", e.message.split('\n')[0]);
            return false;
        }

        const apps = JSON.parse(appsOutput);
        const webApp = apps.result.find(a => a.platform === "WEB");

        if (!webApp) {
            console.log("  No WEB app found. Skipping.");
            return false;
        }

        console.log("  Getting config...");
        const configOutput = execSync(`npx firebase apps:sdkconfig WEB ${webApp.appId} --project ${projectId}`, { stdio: 'pipe' }).toString();
        // Extract JSON
        const jsonStr = configOutput.substring(configOutput.indexOf('{'), configOutput.lastIndexOf('}') + 1);
        const sdkConfig = JSON.parse(jsonStr);

        // Init App & Try Login
        const app = initializeApp(sdkConfig, projectId);
        const auth = getAuth(app);

        console.log("  Attempting sign-in...");
        await signInAnonymously(auth);
        console.log("  SUCCESS! Anonymous auth works.");

        console.log("VALID_CONFIG_START");
        console.log(JSON.stringify(sdkConfig));
        console.log("VALID_CONFIG_END");

        await deleteApp(app);
        return true;
    } catch (e) {
        // Check for specific error codes if needed, but any error means "not working"
        console.log("  Auth check failed:", e.code || e.message);
        return false;
    }
}

async function main() {
    for (const pid of projects) {
        if (await checkProject(pid)) {
            process.exit(0);
        }
    }
    console.log("No working project found.");
    process.exit(1);
}

main();
