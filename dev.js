const spawn = require('cross-spawn')
const path = require('path')
const webpack = require('webpack')
const webpackConfigClient = require('./webpack/client/webpack.dev')
const webpackConfigServer = require('./webpack/server/webpack.dev')
const { devBuildPath} = require('./config');

const compiler = webpack([
  {
    ...webpackConfigClient
  },
  {
    ...webpackConfigServer
  },
])
let node

compiler.hooks.watchRun.tap('Dev', (compiler) => {
  console.log(`Compiling ${compiler.name} ...`)
  if (compiler.name === 'server' && node) {
    node.kill()
    node = undefined
  }
})

compiler.watch({}, (err, stats) => {
    if (stats.hasErrors()) {
        let json = stats.toJson();
        json.children.map((child)=>{

            console.log(child.name)
            console.log(child.errors)
        })
       }
  if (err  || stats.hasErrors()) {
    //   console.log(stats.stats[0].children)
    console.error(err)
    process.exit(1)
  }else{
    console.log('Starting Node.js ...')
    node = spawn(
      'node',
      ['--inspect', path.join(devBuildPath, 'server.js')],
      {
        stdio: 'inherit',
      }
    )
  }
})