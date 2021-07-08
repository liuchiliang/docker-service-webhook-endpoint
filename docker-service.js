const http = require('http');

/**
 * Send request to docker daemon
 */
async function requestDockerApi(opt, data) {
  const body = data ? JSON.stringify(data) : null;
  return new Promise(function(resolve, reject){
    const options = {
      socketPath: '/var/run/docker.sock',
      ...opt,
      headers: {
        'Content-Length': body ? Buffer.byteLength(body) : 0,
        'Content-Type': 'application/json',
        ...opt.headers
      }
    };
    const clientRequest = http.request(options, (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk; 
        });
        res.on('end', () => {
          resolve(JSON.parse(rawData))
        });
    });
    clientRequest.on('error', (e) => {
        reject(e);
    });

    if (body) {
      clientRequest.write(body);
    }
    clientRequest.end();
  });
}

/**
 * Get docker service list.
 */
async function getServices() {
  return requestDockerApi({
    path: `http:/services`,
    method: 'GET'
  });
}

/**
 * Update docker service.
 */
async function updateService(service) {
  return requestDockerApi(
    {
      path: `http:/services/${service.ID}/update?version=${service.Version.Index}`,
      method: 'POST'
    },
    {
      ...service.Spec,
      TaskTemplate: {
        ...service.Spec.TaskTemplate,
        ForceUpdate: service.Spec.TaskTemplate.ForceUpdate + 1,
      }
    }
  );
}

/**
 * Update docker services that use pushed images.
 */
async function executeServiceUpdate(data) {
  const services = await getServices();
  const servicesShouldUpdate = services.filter(s => data.event_data.resources.some(r => s.Spec.TaskTemplate.ContainerSpec.Image.startsWith(r.resource_url) ));

  console.log(`There are ${servicesShouldUpdate.length}/${services.length} services will update.`);
  for (const service of servicesShouldUpdate) {
    try {
      console.log(`update service ${service.Spec.Name}`);
      const result = await updateService(service);
      console.log(result);
    } catch(e) {
      console.error(e);
    }
  }
}

module.exports=executeServiceUpdate;