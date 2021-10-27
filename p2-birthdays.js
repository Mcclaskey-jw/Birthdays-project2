const express = require('express');

const service = express();

var words = [

];

const port = 5000;
service.listen(port, () => {
    console.log(`We're live on port ${port}!`);
});

service.use((request, response, next) => {
    response.set('Access-Control-Allow-Origin', '*');
    next();
  });

  service.options('*', (request, response) => {
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    response.sendStatus(200);
  });

service.post('/:word/:definition', (request, response) => {
    const word = request.params.word;
    const definition = request.params.definition
    postWord(word, definition);
    response.json({
        ok: true,
        results: {
            word: word,
            id: 0,
            likes: 0,
            definition: definition,
        }
    });
});

function postWord(word, def) {
    var index = words.indexOf(word)
    if (index === -1) {
        var wordObj = {};
        wordObj.word = word;
        var defArray = [];
        var defObj = {};
        defObj.definition = def;
        defObj.likes = 0;
        defObj.id = 0;
        defArray.push(defObj);
        wordObj.definition = defArray;
        words.push(wordObj);
    } else {
        var objdef = {};
        objdef.likes = 0;
        objdef.id = words[word].definitions.length;
        objdef.defininition = definition;
        words[word].definitions.push(objdef);
    }
}

service.get('/words/:word', (request, response) => {
    const word = request.params.word;
    for (let k = 0; k < words.length; k++){
        var entry = words[k];
        if (entry.word === word) {
            response.json({
                ok: true,
                results:words[entry],
            })
          return;
        }
    }
    response.status(404);
    response.json({
       ok: false,
       results: `Word does not exist: ${word}`,
    });
});

service.get('/all', (request, response) => {
    response.json({
        ok: true,
        result: getwords(),
    })
});

function getwords() {
    var wordlist = [];
  for (let entry of words) {
      wordlist.push(entry.word);
  }
   return wordlist;
}

service.patch('/:word/:definitionId/like', (request, response) => {
    const word = request.params.word;
    const id = request.params.definitionId;
    if (words.indexOf(word) === -1) {
        response.status(404);
        response.json({
          ok: false,
          results: `Word does not exist: ${word}`,
        });
    } else if (words[word].definitions.length <= id) {
        response.status(404);
        response.json({
          ok: false,
          results: `Definition does not exist: ${id}`,
        });
    } else {
        words[word].definitions[definitions.indexOf(id)].likes += 1;
        respose.json({
            ok: true,
            results: {
                word: word,
                id: id,
                likes: words[word].definitions[id].likes,
            }
        })
    }
});

service.patch('/:word/:definitionId', (request, response) => {
    const word = request.params.word;
    const id = request.params.definitionId;
    if (words.indexOf(word) === -1) {
        response.status(404);
        response.json({
          ok: false,
          results: `Word does not exist: ${word}`,
        });
    } else {
        respose.json({
            ok: true,
            results: words[word].defininition[definitions.indexOf(id)]
        })
    }
});

postWord("test", "blah");