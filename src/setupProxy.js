const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	app.use(
		createProxyMiddleware('/iotApi', {
			target: '',
			changeOrigin: true,
			pathRewrite: { '^/iotApi': '' }
		})
	);
};
