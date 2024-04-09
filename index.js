import slib, { argv } from "@randajan/simple-lib";
import { sassPlugin } from 'esbuild-sass-plugin';

slib(
    argv.isBuild,
    {
        loader:{
            ".js":"jsx",
            '.png': 'file',
            ".jpg": "file",
            ".gif": "file",
            ".eot": "file",
            ".woff": "file",
            ".ttf": "file",
            ".svg": "file"
        },
        lib: {
            minify: false,
            entries: ["index.js"],
            plugins: [
                sassPlugin()
            ],

        }
    }
)