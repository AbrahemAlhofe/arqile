# Arqile
-------------------------------
( arqile ) is a tiny package to restructure your json-based data

# Installation
-------------------------------
Use the [npm](https://www.npmjs.com/package/arqile) to install arqile.

```bash
npm install arqile --save
```

or you can use [yarn](https://yarnpkg.com/package/arqile) to install it

```bash
yarn add arqile
```

# Quick Start
-------------------------------
Restructure data by write the name of property

```typescript
class Arqile {
  pass (
    data: any[],
    recipe: Record<string, any>,
    callback: (key: any, item: any) => void
  ): Promise< any[] | Record< any, any > >
}
```

```javascript
const Arqile = require('arqile')
const arqile = new Arqile()
const data = [
   {
       name : 'abrahem ali',
       age : 15,
       address : { first : 'Egypt', second : 'Cairo' },
       techs : ['sass', 'node js', 'typescript']
   }
]

arqile.pass(data, {
  "*" : { // Every Item
    name : '',
    address : { first : '' }
  }
}).then( result => console.log(result) )

// result
[
    {
         name : 'abrahem ali',
         address : {
             first : 'Egypt',
         },
    },
    ...
]
```

# Actions
-------------------------------
Action is a query starts with "$" makes a mutations on data

## $take
`$take` provide you to specify a count of items to take

```javascript
const data = new Array(10).fill({
  name : 'abrahem ali',
  age : 15,
  address : { first : 'Egypt', second : 'Cairo' }
})

arqile.pass(data, {
  $take : 1 // take one item
  '*' : {
    name : {
      $take : 7 // take first three characters
    },
    address : {
      $take : [ 'first' ] // take "first" property
    }
  }
}).then( result => console.log(result) )

// result
[
  {
    name : 'abrahem',
    address : { first : 'Egypt' }
  }
]

```

## $ignore
`$ignore` provide you to ignore properties, items and strings

```javascript
arqile.pass(data, {
  "*" : {
    name : { $ignore : 'alhofe' },
    address : { $ignore : [ 'last' ] },
    techs : { $ignore : ['sass'] }
  }
}).then( result => console.log( result ) )

// result
[
  {
    name : 'abrahem ',
    address : { first : 'Egypt' },
    techs : ['node js', 'typescript']
  }
]
```

## $include
`$include` provide you to include item to object, array or even string

```javascript
arqile.pass(data, {
  '*' : {
    $include : (payload, recipe) => ({ adult : payload.value.age > 18 }),
    techs : { $include : ['python'] },
    name : { $include : ' alhofe' }
  }
}).then( result => console.log( result ) )

// result
[
  {
    adult: false,
    name: 'abrahem ali alhofe',
    techs: [ 'sass', 'node js', 'typescript', 'python' ]
  }
]
```

## $keyname
`$keyname` provide you to change key name of item

```javascript
arqile.pass(data, {
  '*' : {
    name : { $keyname : 'full_name' },
    address : {
        first : { $keyname : () => 'country' },
        second : { $keyname : () => 'city' }
    }
  }
}).then( result => console.log(result) )

// result
[
  {
    full_name: 'abrahem ali',
    address: { country: 'Egypt', city: 'Cairo' }
  }
]
```
## $value
`$value` provide you to set value of item

```javascript
arqile.pass(data, {
  '*' : {
    $value : (payload, recipe) => payload.value.name
  }
}).then( result => console.log(result) )

// result
[ 'abrahem ali' ]
```

# Aliases
-----------------------
`Aliases` provide you to change key name of item ( you can see it as a shorthand of keyname )

```javascript
arqile.pass(data, {
  '*' : {
    'name : full_name' : '',
    address : {
      'first : country' : '',
      'second : city' : ''
    }
  }
}).then( result => console.log(result) )

// result
[
  {
    full_name: 'abrahem alhofe',
    address: { country: 'Egypt', city: 'Cairo' }
  }
]
```

# Layers
-----------------------
`Layers` provide you to add layer to something before work on item

```typescript
class Arqile {
  addLayer(
    layerMatcher: (payload: Payload, recipe: Recipe) => Boolean,
    layerHandler: (payload: Payload, recipe: Recipe) => Promise<any>
  )
}
```
```javascript
const authors = [
  {
    name : 'George Orwell',
    age : 46,
    id : 0
  },
]
const books = [
  {
    title : "Animal Farm",
    description : "Is an allegoircal novella by George Orwell.",
    author : 0
  },
]

arqile.addLayer(
  payload => payload.path.includes('author'),
  payload => payload.value = authors[payload.value]
)

arqile.pass(books, {
  '*' : {
    title : '',
    author : { $ignore : ['id'] }
  }
}).then( result => console.log( result ) )

// result
[
  {
      title : "Animal Farm",
      author : {
          name : "George Orwell",
          age : 46
      }
  }
]
```

# References
-----------------------
`References` are strings start with '@' to get value from item,
so you can use it with Aliases
```javascript
const data = [
  {
    name : {
      value : 'abrahem ali',
      database_keyname : 'full_name'
    },
    address : {
      value : 'Egypt, Cairo',
      database_keyname : 'full_address'
    }
  }
]

arqile.pass(data, {
  '*' : {
    'name : @database_keyname' : '',
    'address : @database_keyname' : ''
  }
}).then( result => console.log(result) )

// result
[
  {
    full_name: { value: 'abrahem ali', database_keyname: 'full_name' },
    full_address: { value: 'Egypt, Cairo', database_keyname: 'full_address' }
  }
]
```
Or $value
```javascript
arqile.pass(data, {
  '*' : { $value : '@name' }
}).then( result => console.log(result) )

// result
[ 'abrahem ali' ]
```

Or $keyname
```javascript
const data = [
  {
    name : {
      value : 'abrahem ali',
      database_keyname : 'full_name'
    },
    address : {
      value : 'Egypt, Cairo',
      database_keyname : 'full_address'
    }
  }
]

arqile.pass(data, {
  '*' : {
    'name' : {
      $keyname : '@database_keyname',
      $ignore : [] // to get all properties inside "name"
    },
    'address' : {
      $keyname : '@database_keyname',
      $ignore : [] // to get all properties inside "address"
    }
  }
}).then( result => console.log(result) )

// result
[
  {
    full_name: { value: 'abrahem ali', database_keyname: 'full_name' },
    full_address: { value: 'Egypt, Cairo', database_keyname: 'full_address' }
  }
]
```

# Payload
-----------------------
Arqile does't work with data direct it convert data to `Payload`,
you will work with `Payload` on Layers and Actions ( like $include ) 
```typescript
class Payload {
  value : any,
  keyname : string,
  path : string[],
  parent : () => Payload,
  get : (keyname: string) => Payload,
  metadata : Record< string | symbol , any >
}
```

# Recipe
-----------------------
Arqile does't work with recipe direct it convert recipe to `Recipe`,
you will work with `Recipe` on Layers and Actions ( like $include ) 
```typescript
class Recipe {
  keyname : string,
  alias : string,
  value : any,
  path : string[],
  parent : () => Recipe,
  get : (keyname: string) => Recipe,
}
```

# License
[MIT](https://github.com/AbrahemAlhofe/arqile/blob/master/LICENSE)
