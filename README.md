# docker-service-webhook-endpoint

With docker-service-webhook-endpoint, When harbor webhook is triggered, docker services that use pushed images will be updated.

[![Pulls from DockerHub](https://img.shields.io/docker/pulls/mities/docker-service-webhook-endpoint.svg)](https://hub.docker.com/r/mities/docker-service-webhook-endpoint)

## Quick Start

Run the docker-service-webhook-endpoint container with the following command:
```
docker run -v /var/run/docker.sock:/var/run/docker.sock -p 8888:80 mities/docker-service-webhook-endpoint
```

Then, you can config following address as harbor webhook endpoint address:
```
http://<domain or ip>:8888
```
