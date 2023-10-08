import slib from "@randajan/simple-lib";
import { sassPlugin } from 'esbuild-sass-plugin';

slib(
    process.env.NODE_ENV !== "dev",
    {
        port:4009,

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