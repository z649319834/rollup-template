import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'
import image from '@rollup/plugin-image'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import pkg from './package.json'
import { DEFAULT_EXTENSIONS } from '@babel/core'

const ENV = process.env.NODE_ENV
const isProd = ENV === 'production'

console.log('NODE_ENV', ENV)

export default {
  // 入口文件
  input: 'src/index.ts',
  // 输出文件配置
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'MyLib', // 请更改模块名称
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  watch: {
    include: 'src/**',
  },
  plugins: [
    alias({
      entries: {
        '@': './src',
        '~': './',
      },
    }),
    resolve(),
    commonjs(),
    json(),
    image(),
    typescript(),
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
      babelHelpers: 'runtime',
      extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
    }),
    isProd &&
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      }),
    !isProd &&
      serve({
        open: false, // 是否打开浏览器
        contentBase: ['./demo', './dist'], // 入口HTML 文件位置
        host: 'localhost',
        port: 8999,
        verbose: true,
      }),
    !isProd && livereload(),
  ],
  // 需要排除的模块
  external: [],
  // 警告提示
  onwarn({ loc, frame, message }) {
    // 打印位置信息
    if (loc) {
      console.warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`)
      if (frame) console.warn(frame)
    } else {
      console.warn(message)
    }
  },
}
