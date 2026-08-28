import { defineConfig } from "@openapi-codegen/cli";
import {
    generateSchemaTypes,
    generateReactQueryComponents,
} from "@openapi-codegen/typescript";

export default defineConfig({
    spp: {
        from: {
            source: "url",
            url: "http://localhost:3000/api-json",
        },
        outputDir: "src/api/generated",
        to: async (context) => {
            const filenamePrefix = "spp";
            const { schemasFiles } = await generateSchemaTypes(context, {
                filenamePrefix,
            });
            await generateReactQueryComponents(context, {
                filenamePrefix,
                schemasFiles,
            });
        },
    },
});
