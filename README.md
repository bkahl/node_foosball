# node_foosball
Foosball app using mongodb and nodejs.

## How to setup

### Step 1 (Initial App Setup)
```html
npm install
bower install
```

### Step 2 (Setup MongoDB)
Install MongoDB and set a PATH variable to it in your .bash_profile
```html
export PATH="/Users/username/Downloads/mongodb-osx-x86_64-3.0.5/bin:$PATH"
```

Setup MongoDB within Express App
```html
npm install mongo --save
npm install mongodb --save
npm install monk --save
mkdir data within project root
```

Start MongoDB and Mongo
```html
mongod --dbpath /path/to/project/data
Open another Terminal and run mongo
```

DB commands to use within Terminal to interact with foosball DB
```html
- use foosball
- db.usercollection.find().pretty()
```

Start App
```html
npm start
```