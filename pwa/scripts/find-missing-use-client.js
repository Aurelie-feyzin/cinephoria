const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "../"); // adapte si besoin
const relevantExtensions = [".tsx"];
const clientIndicators = [
    "useState",
    "useEffect",
    "useRef",
    "useLayoutEffect",
    "useContext",
    "window",
    "document",
    "localStorage",
    "sessionStorage",
    "navigator",
];

const hasClientCode = (code) =>
    clientIndicators.some((item) => code.includes(item));

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

            const hasUseClient = content.startsWith("'use client'") || content.startsWith('"use client"');
            const containsClientCode = hasClientCode(content);

            if (!hasUseClient && containsClientCode) {
                console.log(`🚨 Missing 'use client' in: ${fullPath}`);
            }
        }
    }
};

console.log("🔎 Scanning for missing 'use client'...");
scanDir(path.join(projectRoot, "components"));
scanDir(path.join(projectRoot, "pages"));
