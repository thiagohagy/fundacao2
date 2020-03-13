
# Technologies

* Backend in nodejs
* Frontend in javascript (Vuejs) and BootstrapVue

# Support

* Uploads with authenticated routes
* Https

# Features

* Generic components on frontend: Nav, Pagination, CrudHeader and AlertMessage
* Global Mixin
* Complete user and client CRUD (User with upload, I'm using Multer on backend )
* Authentication using Vuex
* Http with axios
* VueRouter for route manage

# SETUP

```
sudo npm install -g nodemon
```

```
cd backend
cp config.js.dist config.js
npm install
nodemon index.js

cd ..
cd frontend
npm install
npm run serve
```

## Go to:

{project folder}/backend/app/produtor/

## OBS:

Tem um backup do banco na pasta root do projeto e um arquivo de exemplo para importação na hora das compras (notas.csv)


## then run 

node createRoot.js

### this is just to create the frst user, login: fundacao, pass: 123

## Access

http://localhost:8080


And thats all folks!
