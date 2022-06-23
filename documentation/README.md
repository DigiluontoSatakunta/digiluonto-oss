# Frontend
The frontend is comprised of the following:
- proxy (setting up the domain names, communication with backend, etc.)
- app (client application, `app.example.org`)
- editor (application for content management, `editor.example.org`)

## Proxy
Example tree structure of proxy:

```
caddy/
|-- Caddyfile
|-- docker-compose-frontend.yml
`-- sites
    |-- app
    `-- editor
```

Once configured, execute by running `docker-compose -f docker-compose-frontend.yml up -d`

### Caddyfile
Example of `Caddyfile`:
```
app.example.org {
	encode gzip
	file_server
	root * /data/sites/app

	route {
		header           Cache-Control max-age=3600
		header /static/* Cache-Control max-age=31536000
	}

	try_files {path} /index.html
}

editor.example.org {
	encode gzip
	file_server
	root * /data/sites/editor

	header Cache-Control max-age=31536000

	try_files {path} /index.html
}

api.example.org {
	encode gzip
	reverse_proxy {
		to mesh:4000
	}
}

cms.example.org {
	encode gzip
	reverse_proxy {
		to strapi:1337
	}

	header /uploads/* Cache-Control max-age=31536000 {
		defer
	}
}
```

### Docker Compose
Example of `docker-compose-frontend.yml`

```
version: "3.7"

services:
  proxy:
    container_name: proxy
    hostname: proxy
    image: caddy:2.5.1-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - $PWD/Caddyfile:/etc/caddy/Caddyfile
      - $PWD/sites:/data/sites
    networks:
      - digiluonto

networks:
  default:
    external:
      name: digiluonto
  digiluonto:
    external: true
```

## App (digiluonto-client)
You can build app:
- install npm (v14)
- edit & update `.env`
- run `npm ci`
- run `npm run build`
- copy folder `build` to `sites/app` folder of proxy (see above, defined by `$PWD/sites`)

## Editor (digiluonto-editor)
You can build editor:
- install npm (v14)
- install yarn (`sudo npm install -g yarn`)
- edit & update `.env.sample` to `.env.local`
- run `yarn install --frozen-lockfile`
- run `yarn export`
- copy folder `out` to `sites/editor` folder of proxy (see above, defined by `$PWD/sites`)
