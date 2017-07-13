/*
  eslint
  no-console: 0,
  consistent-return: 0,
  import/imports-first: 0
*/

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const { argv } = require('yargs')
const emoji = require('node-emoji')
const chalk = require('chalk')
const express = require('express')
const webpack = require('webpack')
const { exit } = require('shelljs')
const historyApiFallback = require('connect-history-api-fallback')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

const config = require('../config/webpack.config')
const paths = require('../config/paths')

let compiler
let handleCompile

const DEFAULT_PORT = argv.port
const DEBUG_BUNDLE = argv.debugBundle

if (!checkRequiredFiles([paths.app.htmlFile, paths.app.mainJSFile])) {
  exit(1)
}

const setupCompiler = () => {
  const url = `http://localhost:${DEFAULT_PORT}/`

  compiler = webpack(config, handleCompile)

  let isFirstCompile = true

  compiler.plugin('done', stats => {
    const messages = formatWebpackMessages(stats.toJson({}, true))
    const isSuccessful = !messages.errors.length && !messages.warnings.length
    const showInstructions = isSuccessful && (isFirstCompile)

    if (showInstructions) {
      console.log('The app is running at:')
      console.log()
      console.log(`   ${emoji.get(':earth_americas:')}   ` + chalk.cyan(url))
      console.log()
      console.log('Note that the development build is not optimized.')
      console.log('To create a production build, use ' + chalk.cyan('yarn run build') + '.')
      console.log()

      isFirstCompile = false
    }

    if (messages.errors.length) {
      console.log(chalk.red('Failed to compile.'))
      console.log()

      messages.errors.forEach(message => {
        console.log(message)
        console.log()
      })

      return
    }

    if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.'))
      console.log()

      messages.warnings.forEach(message => {
        console.log(message)
        console.log()
      })

      console.log('You may use special comments to disable some warnings.')
      console.log('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.')
      console.log('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.')
    }
  })
}

const runDevServer = port => {
  const stats = {
    colors: true,
    chunks: false,
    chunkModules: false
  }

  if (DEBUG_BUNDLE) {
    Object.assign(stats, {
      modules: true,
      modulesSort: 'field'
    })
  }

  const app = express()

  app.use(historyApiFallback())
  app.use(hotMiddleware(compiler, { log: false, heartbeat: 2000 }))
  app.use(devMiddleware(compiler, {
    compress: true,
    noInfo: true,
    hot: true,
    quiet: !DEBUG_BUNDLE,
    contentBase: paths.app.build,
    publicPath: config.output.publicPath,
    watchOptions: {
      ignored: /node_modules/
    },
    stats
  }))

  app.listen(port, err => {
    if (err) {
      console.log(chalk.red(err))
      exit(1)
    }
  })
}

const start = () => {
  setupCompiler(DEFAULT_PORT)
  runDevServer(DEFAULT_PORT)
}

module.exports = start
