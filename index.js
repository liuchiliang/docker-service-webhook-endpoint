const http = require('http');
const executeServiceUpdate = require('./docker-service');

/**
 * Process request from harbor webhook.
 */
function process(req, res) {
  let rawData = "";
  req.on('data', function (chunk) {
    rawData += chunk;
  });
  
  req.on('end', async function () {
    try {
      console.log(rawData);
      const webhookData = JSON.parse(rawData);
      
      if (webhookData.type === 'PUSH_ARTIFACT') {
        await executeServiceUpdate(webhookData)
      }
  
      res.writeHead(200);
      res.end();
    } catch(e) {
      console.error(e);
    }
  })
}

/**
 * Start http server.
 */
http.createServer(function (req, res) {
  process(req, res);
}).listen(80);

console.log('Server running at port 80');