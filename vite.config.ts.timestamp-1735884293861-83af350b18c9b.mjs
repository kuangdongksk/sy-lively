// vite.config.ts
import react from "file:///C:/A/sy/sy-lively/node_modules/.pnpm/@vitejs+plugin-react@4.3.4_vite@5.4.11_@types+node@22.10.3_less@4.2.1_terser@5.37.0_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import fg from "file:///C:/A/sy/sy-lively/node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/index.js";
import jotaiDebugLabel from "file:///C:/A/sy/sy-lively/node_modules/.pnpm/jotai@2.11.0_@types+react@18.3.18_react@18.3.1/node_modules/jotai/esm/babel/plugin-debug-label.mjs";
import jotaiReactRefresh from "file:///C:/A/sy/sy-lively/node_modules/.pnpm/jotai@2.11.0_@types+react@18.3.18_react@18.3.1/node_modules/jotai/esm/babel/plugin-react-refresh.mjs";
import minimist from "file:///C:/A/sy/sy-lively/node_modules/.pnpm/minimist@1.2.8/node_modules/minimist/index.js";
import { resolve } from "path";
import livereload from "file:///C:/A/sy/sy-lively/node_modules/.pnpm/rollup-plugin-livereload@2.0.5/node_modules/rollup-plugin-livereload/dist/index.cjs.js";
import { defineConfig } from "file:///C:/A/sy/sy-lively/node_modules/.pnpm/vite@5.4.11_@types+node@22.10.3_less@4.2.1_terser@5.37.0/node_modules/vite/dist/node/index.js";
import { viteStaticCopy } from "file:///C:/A/sy/sy-lively/node_modules/.pnpm/vite-plugin-static-copy@2.2.0_vite@5.4.11_@types+node@22.10.3_less@4.2.1_terser@5.37.0_/node_modules/vite-plugin-static-copy/dist/index.js";
import zipPack from "file:///C:/A/sy/sy-lively/node_modules/.pnpm/vite-plugin-zip-pack@1.2.4_vite@5.4.11_@types+node@22.10.3_less@4.2.1_terser@5.37.0_/node_modules/vite-plugin-zip-pack/dist/esm/index.mjs";
var __vite_injected_original_dirname = "C:\\A\\sy\\sy-lively";
var args = minimist(process.argv.slice(2));
var isWatch = args.watch || args.w || false;
var devDistDir = "dev";
var distDir = isWatch ? devDistDir : "dist";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  },
  plugins: [
    react({ babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] } }),
    viteStaticCopy({
      targets: [
        {
          src: "./README*.md",
          dest: "./"
        },
        {
          src: "./plugin.json",
          dest: "./"
        },
        {
          src: "./preview.png",
          dest: "./"
        },
        {
          src: "./icon.png",
          dest: "./"
        }
      ]
    })
  ],
  css: {
    modules: {
      hashPrefix: "hash",
      generateScopedName: isWatch ? "[name]__[local]" : "[hash:base64:5]"
    },
    devSourcemap: isWatch
  },
  // https://github.com/vitejs/vite/issues/1930
  // https://vitejs.dev/guide/env-and-mode.html#env-files
  // https://github.com/vitejs/vite/discussions/3058#discussioncomment-2115319
  // 在这里自定义变量
  define: {
    "process.env.DEV_MODE": `"${isWatch}"`,
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
  },
  build: {
    // 输出路径
    outDir: distDir,
    emptyOutDir: false,
    // 构建后是否生成 source map 文件
    sourcemap: isWatch ? "inline" : false,
    // 设置为 false 可以禁用最小化混淆
    // 或是用来指定是应用哪种混淆器
    // boolean | 'terser' | 'esbuild'
    // 不压缩，用于调试
    minify: !isWatch,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__vite_injected_original_dirname, "src/index.tsx"),
      // the proper extensions will be added
      fileName: "index",
      formats: ["cjs"]
    },
    rollupOptions: {
      plugins: [
        ...isWatch ? [
          livereload(devDistDir),
          {
            //监听静态资源文件
            name: "watch-external",
            async buildStart() {
              const files = await fg([
                "public/i18n/**",
                "./README*.md",
                "./plugin.json"
              ]);
              for (let file of files) {
                this.addWatchFile(file);
              }
            }
          }
        ] : [
          zipPack({
            inDir: "./dist",
            outDir: "./",
            outFileName: "package.zip"
          })
        ]
      ],
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["siyuan", "process"],
      output: {
        entryFileNames: "[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "index.css";
          }
          return assetInfo.name;
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxBXFxcXHN5XFxcXHN5LWxpdmVseVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcQVxcXFxzeVxcXFxzeS1saXZlbHlcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0Evc3kvc3ktbGl2ZWx5L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgZmcgZnJvbSBcImZhc3QtZ2xvYlwiO1xyXG5pbXBvcnQgam90YWlEZWJ1Z0xhYmVsIGZyb20gXCJqb3RhaS9iYWJlbC9wbHVnaW4tZGVidWctbGFiZWxcIjtcclxuaW1wb3J0IGpvdGFpUmVhY3RSZWZyZXNoIGZyb20gXCJqb3RhaS9iYWJlbC9wbHVnaW4tcmVhY3QtcmVmcmVzaFwiO1xyXG5pbXBvcnQgbWluaW1pc3QgZnJvbSBcIm1pbmltaXN0XCI7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgbGl2ZXJlbG9hZCBmcm9tIFwicm9sbHVwLXBsdWdpbi1saXZlcmVsb2FkXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB7IHZpdGVTdGF0aWNDb3B5IH0gZnJvbSBcInZpdGUtcGx1Z2luLXN0YXRpYy1jb3B5XCI7XHJcbmltcG9ydCB6aXBQYWNrIGZyb20gXCJ2aXRlLXBsdWdpbi16aXAtcGFja1wiO1xyXG5cclxuY29uc3QgYXJncyA9IG1pbmltaXN0KHByb2Nlc3MuYXJndi5zbGljZSgyKSk7XHJcbmNvbnN0IGlzV2F0Y2ggPSBhcmdzLndhdGNoIHx8IGFyZ3MudyB8fCBmYWxzZTtcclxuY29uc3QgZGV2RGlzdERpciA9IFwiZGV2XCI7XHJcbmNvbnN0IGRpc3REaXIgPSBpc1dhdGNoID8gZGV2RGlzdERpciA6IFwiZGlzdFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCh7IGJhYmVsOiB7IHBsdWdpbnM6IFtqb3RhaURlYnVnTGFiZWwsIGpvdGFpUmVhY3RSZWZyZXNoXSB9IH0pLFxyXG5cclxuICAgIHZpdGVTdGF0aWNDb3B5KHtcclxuICAgICAgdGFyZ2V0czogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHNyYzogXCIuL1JFQURNRSoubWRcIixcclxuICAgICAgICAgIGRlc3Q6IFwiLi9cIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHNyYzogXCIuL3BsdWdpbi5qc29uXCIsXHJcbiAgICAgICAgICBkZXN0OiBcIi4vXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBzcmM6IFwiLi9wcmV2aWV3LnBuZ1wiLFxyXG4gICAgICAgICAgZGVzdDogXCIuL1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgc3JjOiBcIi4vaWNvbi5wbmdcIixcclxuICAgICAgICAgIGRlc3Q6IFwiLi9cIixcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgfSksXHJcbiAgXSxcclxuXHJcbiAgY3NzOiB7XHJcbiAgICBtb2R1bGVzOiB7XHJcbiAgICAgIGhhc2hQcmVmaXg6IFwiaGFzaFwiLFxyXG4gICAgICBnZW5lcmF0ZVNjb3BlZE5hbWU6IGlzV2F0Y2ggPyBcIltuYW1lXV9fW2xvY2FsXVwiIDogXCJbaGFzaDpiYXNlNjQ6NV1cIixcclxuICAgIH0sXHJcbiAgICBkZXZTb3VyY2VtYXA6IGlzV2F0Y2gsXHJcbiAgfSxcclxuXHJcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3ZpdGVqcy92aXRlL2lzc3Vlcy8xOTMwXHJcbiAgLy8gaHR0cHM6Ly92aXRlanMuZGV2L2d1aWRlL2Vudi1hbmQtbW9kZS5odG1sI2Vudi1maWxlc1xyXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92aXRlanMvdml0ZS9kaXNjdXNzaW9ucy8zMDU4I2Rpc2N1c3Npb25jb21tZW50LTIxMTUzMTlcclxuICAvLyBcdTU3MjhcdThGRDlcdTkxQ0NcdTgxRUFcdTVCOUFcdTRFNDlcdTUzRDhcdTkxQ0ZcclxuICBkZWZpbmU6IHtcclxuICAgIFwicHJvY2Vzcy5lbnYuREVWX01PREVcIjogYFwiJHtpc1dhdGNofVwiYCxcclxuICAgIFwicHJvY2Vzcy5lbnYuTk9ERV9FTlZcIjogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYuTk9ERV9FTlYpLFxyXG4gIH0sXHJcblxyXG4gIGJ1aWxkOiB7XHJcbiAgICAvLyBcdThGOTNcdTUxRkFcdThERUZcdTVGODRcclxuICAgIG91dERpcjogZGlzdERpcixcclxuICAgIGVtcHR5T3V0RGlyOiBmYWxzZSxcclxuXHJcbiAgICAvLyBcdTY3ODRcdTVFRkFcdTU0MEVcdTY2MkZcdTU0MjZcdTc1MUZcdTYyMTAgc291cmNlIG1hcCBcdTY1ODdcdTRFRjZcclxuICAgIHNvdXJjZW1hcDogaXNXYXRjaCA/IFwiaW5saW5lXCIgOiBmYWxzZSxcclxuXHJcbiAgICAvLyBcdThCQkVcdTdGNkVcdTRFM0EgZmFsc2UgXHU1M0VGXHU0RUU1XHU3OTgxXHU3NTI4XHU2NzAwXHU1QzBGXHU1MzE2XHU2REY3XHU2REM2XHJcbiAgICAvLyBcdTYyMTZcdTY2MkZcdTc1MjhcdTY3NjVcdTYzMDdcdTVCOUFcdTY2MkZcdTVFOTRcdTc1MjhcdTU0RUFcdTc5Q0RcdTZERjdcdTZEQzZcdTU2NjhcclxuICAgIC8vIGJvb2xlYW4gfCAndGVyc2VyJyB8ICdlc2J1aWxkJ1xyXG4gICAgLy8gXHU0RTBEXHU1MzhCXHU3RjI5XHVGRjBDXHU3NTI4XHU0RThFXHU4QzAzXHU4QkQ1XHJcbiAgICBtaW5pZnk6ICFpc1dhdGNoLFxyXG5cclxuICAgIGxpYjoge1xyXG4gICAgICAvLyBDb3VsZCBhbHNvIGJlIGEgZGljdGlvbmFyeSBvciBhcnJheSBvZiBtdWx0aXBsZSBlbnRyeSBwb2ludHNcclxuICAgICAgZW50cnk6IHJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9pbmRleC50c3hcIiksXHJcbiAgICAgIC8vIHRoZSBwcm9wZXIgZXh0ZW5zaW9ucyB3aWxsIGJlIGFkZGVkXHJcbiAgICAgIGZpbGVOYW1lOiBcImluZGV4XCIsXHJcbiAgICAgIGZvcm1hdHM6IFtcImNqc1wiXSxcclxuICAgIH0sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICAuLi4oaXNXYXRjaFxyXG4gICAgICAgICAgPyBbXHJcbiAgICAgICAgICAgICAgbGl2ZXJlbG9hZChkZXZEaXN0RGlyKSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL1x1NzZEMVx1NTQyQ1x1OTc1OVx1NjAwMVx1OEQ0NFx1NkU5MFx1NjU4N1x1NEVGNlxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJ3YXRjaC1leHRlcm5hbFwiLFxyXG4gICAgICAgICAgICAgICAgYXN5bmMgYnVpbGRTdGFydCgpIHtcclxuICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCBmZyhbXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwdWJsaWMvaTE4bi8qKlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiLi9SRUFETUUqLm1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCIuL3BsdWdpbi5qc29uXCIsXHJcbiAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBmaWxlIG9mIGZpbGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRXYXRjaEZpbGUoZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICAgOiBbXHJcbiAgICAgICAgICAgICAgemlwUGFjayh7XHJcbiAgICAgICAgICAgICAgICBpbkRpcjogXCIuL2Rpc3RcIixcclxuICAgICAgICAgICAgICAgIG91dERpcjogXCIuL1wiLFxyXG4gICAgICAgICAgICAgICAgb3V0RmlsZU5hbWU6IFwicGFja2FnZS56aXBcIixcclxuICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgXSksXHJcbiAgICAgIF0sXHJcblxyXG4gICAgICAvLyBtYWtlIHN1cmUgdG8gZXh0ZXJuYWxpemUgZGVwcyB0aGF0IHNob3VsZG4ndCBiZSBidW5kbGVkXHJcbiAgICAgIC8vIGludG8geW91ciBsaWJyYXJ5XHJcbiAgICAgIGV4dGVybmFsOiBbXCJzaXl1YW5cIiwgXCJwcm9jZXNzXCJdLFxyXG5cclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6IFwiW25hbWVdLmpzXCIsXHJcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcclxuICAgICAgICAgIGlmIChhc3NldEluZm8ubmFtZSA9PT0gXCJzdHlsZS5jc3NcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJpbmRleC5jc3NcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBhc3NldEluZm8ubmFtZTtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2TyxPQUFPLFdBQVc7QUFDL1AsT0FBTyxRQUFRO0FBQ2YsT0FBTyxxQkFBcUI7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
