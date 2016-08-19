/*
*
* @function webpackConfig
*
* @param { env }
* @result 'development' | 'production'
*
* @return { object };
*
*/

exports.webpackConfig = (env) => ({
  /* your config */
});

/*
*
* @function envConfig
*
* @param { env }
* @result 'development' | 'production'
*
* @return { object };
*
*/

exports.envConfig = (env) => ({
  api: {
    hostname: 'http://localhost:3000'
  }
});

/*
*
* @function htmlData
*
* @param { env }
* @result 'development' | 'production'
*
* @return { object };
*
*/

exports.htmlData = (env) => ({
  title: (env === 'development') ? 'Dev Title' : 'Prod Title'
});
