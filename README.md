Node JS Express JS and Mongo DB API
==================================

> This repo contains the code for Signup and Signin apis for the task

## Related modules

* express - web application framework for node
* pug - template engine
* stylus - pre-processor CSS
* sequelize - nodejs orm for mysql
* bower - a package manager for the web
* gulp - automate workflow

## Prerequisites

* Node.js `http://nodejs.org`
* MongoDB `Install mongoDB

## Project Structure
```sh
.
├── modules/
│   └── controllers           # contains controller files
│   └── models                # contains model files
│   └── middleware            # contains middleware file that check the body of request
│   └── routes.js             # routes config file
├── config/
│   ├── express.js            # Contains server configuration and creation
│   ├── config.js             # environment config Js file that include environment for db connections
│   └── passport.js           # passport authentication configuration
│   └── routes.js             # routes configuration
│   └── errors.js             # errors handling configuration
├── public/                   # contains static assets
│   ├── components            # bower components folder
│   ├── favicon               # favicon folder
│   ├── fonts                 # contains font files
│   ├── css                   # all files will generate from gulp
│   ├── styl                  # contains style sheets (stylus)
│   ├── js                    # contains js files
│   └── img                   # contains image files
├── test/
│   └── spec.js               # unit & func tests

```

## Getting Started

The easiest way to get started is to clone the repository:

```sh
# Get the latest snapshot
$ git clone 
$ cd Node-JS-API---Task

# Install dependencies
$ npm install
 
```
# Create Database
```sh
 
 # Database Table migrations
 $ Make sure you have installed mongodb databse localy

```
## Development

    npm start
    
Your app should now be running on [localhost:3200](http://localhost:3200/).

## Test

    npm test
## Deploy

Make sure you have the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

Plus make sure to run the Angular Final Build by `ng build --aot --prod --buildOptimizer`
after from this copy the folder from `dist` folder and paste in the `public` folder in the
directory and then follow the procedure below.

```

git add .
git commit -m '<message>'
git push heroku master
heroku open
```
