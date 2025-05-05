const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "../"); // adapte selon la position du script
const clientMarker = "'use client'";
const relevantExtensions = [".tsx"];

const containsClientOnlyCode = (code) => {
    const reactHooks = ["useState", "useEffect", "useRef", "useLayoutEffect", "useContext"];
    const browserGlobals = ["window", "document", "localStorage", "sessionStorage", "navigator"];

    return reactHooks.some(h => code.includes(h)) || browserGlobals.some(g => code.includes(g));
};

const scanDir = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            scanDir(fullPath);
        } else if (
            entry.isFile() &&
            relevantExtensions.includes(path.extname(entry.name))
        ) {
            const content = fs.readFileSync(fullPath, "utf8");

            if (content.includes(clientMarker) && !containsClientOnlyCode(content)) {
                console.log(`⚠️  'use client' possibly unnecessary in: ${fullPath}`);
            }
        }
    }
};

console.log("🔍 Scanning for unnecessary 'use client'...");
scanDir(path.join(projectRoot, "components"));
scanDir(path.join(projectRoot, "pages"));
