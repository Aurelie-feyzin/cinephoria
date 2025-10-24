const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Folders
const projectRoot = path.resolve(__dirname, "../")
const folders = [
    {
        input: path.join(projectRoot, "public/poster"),
        output: path.join(projectRoot, "public/poster-optimized"),
        sizes: [
            { name: "small", width: 300, height: 450 },
        ]
    },
    {
        input: path.join(projectRoot, "public/backdrop"),
        output: path.join(projectRoot, "public/backdrop-optimized"),
        sizes: [
            { name: "medium", width: 600, height: 300 }
        ]
    }
];


const forceRebuild = process.argv.includes("--force");
folders.forEach(async (folder) => {
    const { input, output, sizes } = folder;

    if (forceRebuild && fs.existsSync(output)) {
        fs.rmSync(output, { recursive: true });
        console.log(`📦 Dossier ${output} supprimé pour rebuild complet`);
    }
    if (!fs.existsSync(output)) fs.mkdirSync(output);

    fs.readdirSync(input).forEach(async (file) => {
        const ext = path.extname(file).toLowerCase();
        if (![".jpg", ".jpeg", ".png"].includes(ext)) return;

        const inputPath = path.join(input, file);
        const baseName = path.basename(file, path.extname(file));
        const image = sharp(inputPath);

        // 1️⃣ Blur tiny (16px)
        const blurBuffer = await image
            .resize(16)
            .webp({ quality: 50 })
            .toBuffer();
        const blurBase64 = `data:image/webp;base64,${blurBuffer.toString("base64")}`;
        const blurFilePath = path.join(output, `${baseName}-blur.json`);
        fs.writeFileSync(blurFilePath, JSON.stringify({ blurDataURL: blurBase64 }));

        // 2️⃣ Générer images optimisées
        for (const size of sizes) {
            const outputFileName = `${baseName}-${size.name}.webp`;
            const outputPath = path.join(output, outputFileName);

            if (!fs.existsSync(outputPath) || forceRebuild) {
                await image
                    .resize(size.width, size.height, { fit: "cover", withoutEnlargement: true })
                    .sharpen()
                    .webp({ quality: 90 })
                    .toFile(outputPath);
                console.log(`✅ ${outputFileName} créé dans ${output}`);
            } else {
                console.log(`⚠ ${outputFileName} existe déjà, skip`);
            }
        }

        console.log(`✨ blurDataURL pour ${baseName} généré dans ${output}`);
    });
});