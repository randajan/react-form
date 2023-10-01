import slib from "@randajan/simple-lib";
import { sassPlugin } from 'esbuild-sass-plugin';

import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';

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
                sassPlugin({
                    transform: async (source, resolveDir) => {
                        const { css } = await postcss([autoprefixer, postcssPresetEnv({ stage: 0 })]).process(source, {from: undefined})
                        return css
                    }
                })
            ],

        }
    }
)