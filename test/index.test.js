const Arqile = require('../dist/index.js');
const arqile = new Arqile();
const _ = require('lodash');
const { AuthorModel, BookModel, create, settings } = require('./utils')

test('Pass empty array to arqile', () => {
  expect.assertions(1);

  const expected = []

  return arqile.pass([], {
    "*" : {
      title : "",
      description : ""
    }
  }).then((result) => {
    expect(result).toEqual( expected )
  })

})

test('Restructure data by select items', () => {
  expect.assertions(1);

  const expected = [{
    title : BookModel.title,
    description : BookModel.description,
  }]

  return arqile.pass([ BookModel ], {
    "*" : {
      title : "",
      description : ""
    }
  }).then((result) => {
    expect(result).toEqual( expected )
  })

})

test('Deep restructure data by select items', () => {
  expect.assertions(1);

  const expected = [{
    title : BookModel.title,
    publisher : { name : BookModel.publisher.name }
  }]

  return arqile.pass([ BookModel ], {
    "*" : {
      title : '',
      publisher : { name : '' }
    }
  }).then(result => {
    expect(result).toEqual( expected )
  })

})

test('Deep restructure data by select items ( array )', () => {
  expect.assertions(1);

  const expected = [{
    books : AuthorModel.books.map( book => ({ name : book.name }) )
  }]

  return arqile.pass([ AuthorModel ], {
   "*" : {
     books : {
       "*" : {
         name : ''
       }
     }
   }
  }).then(result => {
    expect(result).toEqual( expected )
  })

})

test('Lazy loading', () => {
  expect.assertions(1);

  const expectedLength = 10
  let length = 0

  return arqile.pass( create(AuthorModel, expectedLength), {
    '*' : {
      name : ''
    }
  }, () => {
    length += 1
    if ( length == 10 ) expect( length ).toEqual(expectedLength)
  })

})

describe('Test ( $take )', () => {

  describe('With Array', () => {

    test('First three items', () => {
      expect.assertions(1);
    
      const expected = create({
        title : BookModel.title,
        id : BookModel.id
      }, 3)
    
      return arqile.pass( create(BookModel) , {
        $take : 3,
        "*" : {
          title : "",
          id : ""
        }
      }).then(result => {
        expect(result).toEqual( expected )
      })
    })
    
    test('All items except last three items', () => {
      expect.assertions(1);
    
      // |> 0 1 2 3 4 5 6 7 | 8 9 10
      const expected = create({
        title : BookModel.title,
        id : BookModel.id
      }, settings.length - 3 )
    
      return arqile.pass( create(BookModel), {
        $take : [ -3 ],
        "*" : {
          title : "",
          id : ""
        }
      }).then(result => {
        expect(result).toEqual( expected )
      })
    })
    
    test('Item in index 4 with 3 items after it', () => {
      expect.assertions(1);
    
      const expected = create({
        title : BookModel.title,
        id : 4
      }, 4)
    
      return arqile.pass( create(BookModel, 20), {
        $take : [ 4, 3 ],
        "*" : {
          title : "",
          id : ""
        }
      }).then(result => {
        expect(result).toEqual( expected )
      })
    })

  })

  describe('With Object', () => {

    test('Pick properties from object', () => {
      expect.assertions(1);

      const expected = [
        {
          name : AuthorModel.name,
          age : AuthorModel.age
        }
      ]

      return arqile.pass([ AuthorModel ], {
        '*' : {
          $take : ['name', 'age']
        },
      }).then(result => {
        expect(result).toEqual( expected )
      })

    })

  })

  describe('With String', () => {

    test('Take first three characters', () => {
      expect.assertions(1);

      const expected = [
        {
          title : BookModel.title.slice(0, 3)
        }
      ]

      return arqile.pass([ BookModel ], {
        '*' : {
          title : {
            $take : 3
          }
        },
      }).then(result => {
        expect(result).toEqual( expected )
      })
    })

    test('Take character in index 7 and three characters after it', () => {
      expect.assertions(1);

      const expected = [
        {
          title : BookModel.title.slice(7, 7 + 4)
        }
      ]

      return arqile.pass([ BookModel ], {
        '*' : {
          title : {
            $take : [ 7, 3 ]
          }
        },
      }).then(result => {
        expect(result).toEqual( expected )
      })
    })

    test('Take all characters expect last 3 characters', () => {
      expect.assertions(1);

      const expected = [
        {
          title : BookModel.title.slice(0, BookModel.title.length - 3)
        }
      ]

      return arqile.pass([ BookModel ], {
        '*' : {
          title : {
            $take : -3
          }
        },
      }).then(result => {
        expect(result).toEqual( expected )
      })
    })
    
  })

})

describe('Test ( $ignore )', () => {

  test('With object properties', () => {
    expect.assertions(1);
  
    const expected = [{
      title : BookModel.title,
      publisher : BookModel.publisher,
      id : BookModel.id,
    }]
  
    return arqile.pass([ BookModel ], {
      "*" : {
        $ignore : ['tags', 'description', 'author']
      }
    }).then(result => {
      expect(result).toEqual( expected )
    })
  
  })
  
  test('With array items', () => {
    expect.assertions(1);
  
    const expected = [{
      tags : BookModel.tags.slice(1)
    }]
  
    return arqile.pass([ BookModel ], {
      "*" : {
        tags : {
          $ignore : BookModel.tags[0]
        }
      }
    }).then(result => {
      expect(result).toEqual( expected )
    })
  
  })

  test('With strings', () => {
    expect.assertions(1);

    const expected = [{
      title : ' ' + BookModel.title.split(' ').slice(1).join(' ')
    }]

    return arqile.pass([ BookModel ], {
      "*" : {
        title : {
          $ignore : [ BookModel.title.split(' ')[0] ]
        }
      }
    }).then(result => {
      expect(result).toEqual( expected )
    })
  })

})


describe('Test ( $include )', () => {
  
  test('With object', () => {
    expect.assertions(1);
  
    const expected = [{
      tags_length : BookModel.tags.length
    }]
  
    return arqile.pass([ BookModel ], {
      "*" : {
        $include : payload => ({ tags_length : payload.value.tags.length })
      }
    }).then(result => {
      expect(result).toEqual( expected )
    })
  
  })

  describe('With Array', () => {
    
    test('Include item at the begining of array', () => {
      expect.assertions(1);

      const expected = [
        {
          tags : [ 'Another Tag', ...BookModel.tags ]
        }
      ]
  
      return arqile.pass([ BookModel ], {
        "*" : {
          tags : {
            $include : { 0 : 'Another Tag' }
          }
        }
      }).then(result => {
        expect(result).toEqual( expected )
      })
    })

    test('Include item at the end of array', () => {
      expect.assertions(1);

      const expected = [
        {
          tags : [ ...BookModel.tags, 'Another Tag' ]
        }
      ]
  
      return arqile.pass([ BookModel ], {
        "*" : {
          tags : {
            $include : ['Another Tag']
          }
        }
      }).then(result => {
        expect(result).toEqual( expected )
      })
    })

    test('Include items at different positions', () => {
      expect.assertions(1);

      const expected = [
        {
          tags : [ 'Tag 1', ...BookModel.tags, 'Tag 2' ]
        }
      ]
  
      return arqile.pass([ BookModel ], {
        "*" : {
          tags : {
            $include : { 0 : 'Tag 1', [ BookModel.tags.length + 1 ] : 'Tag 2' }
          }
        }
      }).then(result => {
        expect(result).toEqual( expected )
      })
    })
  })

  describe('With String', () => {

    test('Include characters at the begining of string', () => {
      expect.assertions(1);

      const expected = [
        {
          title : 'Start ' + BookModel.title
        }
      ]
  
      return arqile.pass([ BookModel ], {
        "*" : {
          title : {
            $include : { 0 : 'Start ' }
          }
        }
      }).then(result => {
        expect(result).toEqual( expected )
      })
    })

    test('Include characters at the end of string', () => {
      expect.assertions(1);

      const expected = [
        {
          title : BookModel.title + ' End'
        }
      ]
  
      return arqile.pass([ BookModel ], {
        "*" : {
          title : {
            $include : [' End']
          }
        }
      }).then(result => {
        expect(result).toEqual( expected )
      })
    })

    test('Include characters at different positions', () => {
      expect.assertions(1);

      const expected = [
        {
          title : 'Start ' + BookModel.title + ' End'
        }
      ]
  
      return arqile.pass([ BookModel ], {
        "*" : {
          title : {
            $include : { 0 : 'Start ', [ BookModel.title.length + 1 ] : ' End' }
          }
        }
      }).then(result => {
        expect(result).toEqual( expected )
      })
    })

  })

})

describe('Test ( aliases )', () => {

  test('Without reference', () => {
    expect.assertions(1);
  
    const expected = [
      {
        "my Publisher" : BookModel.publisher,
        author : BookModel.author
      }
    ]
  
    return arqile.pass([ BookModel ], {
      "*" : {
        "publisher : my Publisher" : '',
        author : ''
      }
    }).then(result => {
      expect(result).toEqual( expected )
    })
  
  })
  
  test('With reference', () => {
    expect.assertions(1);
  
    const expected = [
       {
        [BookModel.publisher.name] : BookModel.publisher,
        author : BookModel.author
      }
    ]
  
    return arqile.pass([ BookModel ], {
      "*" : {
        "publisher : @name" : '',
        author : ''
      }
    }).then(result => {
      expect(result).toEqual( expected )
    })
  
  })

})

describe('Test ( $value )', () => {

  test('With function', () => {
    expect.assertions(1);
  
    const expected = [{
      nameBook : BookModel.title
    }]
  
    return arqile.pass([ BookModel ], {
      "*" : {
        $value : (payload) => ({ nameBook : payload.value.title }),
      }
    }).then(result => {
      expect(result).toEqual( expected )
    })
  
  })
  
  test('With reference', () => {
    expect.assertions(1);
  
    const expected = [ BookModel.title ]
  
    return arqile.pass([ BookModel ], {
      "*" : {
        $value : '@title'
      }
    }).then(result => {
      expect(result).toEqual( expected )
    })
  
  })
  
  test('With string', () => {
    expect.assertions(1);
  
    const expected = [ 'value' ]
  
    return arqile.pass([ BookModel ], {
      "*" : {
        $value : 'value'
      }
    }).then(result => {
      expect(result).toEqual( expected )
    })
  
  })

  describe('Shorthands', () => {

    test('Recipe as a function', () => {
      expect.assertions(1);
    
      const expected = [{
        nameBook : BookModel.title
      }]
    
      return arqile.pass([ BookModel ], {
        "*" : (payload) => ({ nameBook : payload.value.title })
      }).then(result => expect(result).toEqual( expected ))
    })

    test('Recipe as a string', () => {
      expect.assertions(1);
    
      const expected = [ 'value' ]
    
      return arqile.pass([ BookModel ], {
        "*" : 'value'
      }).then(result => expect(result).toEqual( expected ))
    })

    
    test('Recipe as a reference', () => {
      expect.assertions(1);
    
      const expected = [ BookModel.title ]
    
      return arqile.pass([ BookModel ], {
        "*" : '@title'
      }).then(result => expect(result).toEqual( expected ))
    })

  })

})

describe('Test ( $keyname )', () => {

  test('Change keyname of items', () => {
    expect.assertions(1);
  
    const expected = {
        [ BookModel.publisher.name ] : BookModel
    }
  
    return arqile.pass([ BookModel ], {
      "*" : {
        $keyname : '@publisher.name',
        $ignore : []
      }
    }).then(result => expect(result).toEqual( expected ))

  })

  it('Using Reference', () => {
    expect.assertions(1);
  
    const expected = [
      {
        [ BookModel.publisher.name ] : BookModel.publisher
      }
    ]
  
    return arqile.pass([ BookModel ], {
      "*" : {
        publisher : {
          $keyname : '@name',
          $ignore : []
        }
      }
    }).then(result => expect(result).toEqual( expected ))
  })

  it('Using Function', () => {
    expect.assertions(1);
  
    const expected = [
      {
        [ BookModel.publisher.name ] : BookModel.publisher
      }
    ]
  
    return arqile.pass([ BookModel ], {
      "*" : {
        publisher : {
          $keyname : () => '@name',
          $ignore : []
        }
      }
    }).then(result => expect(result).toEqual( expected ))
  })

  it('Using String', () => {
    expect.assertions(1);
  
    const expected = [
      {
        newPublisher : BookModel.publisher
      }
    ]
  
    return arqile.pass([ BookModel ], {
      "*" : {
        publisher : {
          $keyname : 'newPublisher',
          $ignore : []
        }
      }
    }).then(result => expect(result).toEqual( expected ))
  })

})

describe('Test ( Layers )', () => {

  test('Default', () => {
    expect.assertions(1);

    const arqile = new Arqile();

    arqile.addLayer(item => item.path.includes('author'), ( item ) => {
      if ( item.value === 0 ) item.value = AuthorModel
    })

    const expected = [{
      author : {
        name : AuthorModel.name,
        age : AuthorModel.age
      }
    }]

    return arqile.pass([ BookModel ], {
      "*" : {
        author : {
          name : '',
          age : ''
        }
      }
    }).then(result => {
      expect(result).toEqual(expected)
    })

  })

  
  test('With Array', () => {
    expect.assertions(1);

    const arqile = new Arqile();

    const books = create( BookModel, 10 )

    arqile.addLayer(
      (item, recipe) => item.path.includes('books') && recipe.keyname === '*',
      item => item.value = _.find(books, { id : item.value.id })
    )

    const expected = [{

      books : [
        { title : BookModel.title, id : AuthorModel.books[0].id },
        { title : BookModel.title, id : AuthorModel.books[1].id },
        { title : BookModel.title, id : AuthorModel.books[2].id }
      ]

    }]

    return arqile.pass([ AuthorModel ], {
      "*" : {
        books : {
          "*" : {
            title : '',
            id : '',
          }
        }
      }
    }).then(result => {
      expect(result).toEqual(expected)
    })

  })


  test('With referenced alias', () => {
    expect.assertions(1);

    const arqile = new Arqile();
  
    arqile.addLayer(item => item.path.includes('author'), (item) => {
      item.value = item.value + 1
    })
  
    arqile.addLayer(item => item.path.includes('author'), (item) => {
      if ( item.value === 1 ) return item.value = AuthorModel
    })
  
    const expected = [
       {
        [AuthorModel.name] : {
          age : AuthorModel.age
        }
      }
    ]

    return arqile.pass([ BookModel ], {
      "*" : {
        "author : @name" : {
          age : ''
        }
      }
    }).then(result => {
      expect(result).toEqual( expected )
    })
  
  })

})