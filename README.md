#Favourites
Glorious fun for all the family.

## Installation
* Installation is via ``npm``.
```
$ npm install
$ npm start
```

* A ``favourites.json`` file must exist for the program to work.
* They should be populated in such a way that the sentence "My favourite
  *key* is *value*" makes sense.
  
```json
{
    "apple": "Braeburn",
    "castle": "Camelot"
}
```
* The listening port can be edited within ``package.json``.

* The contents of ``warning.txt`` will be displayed to all clients until manually
  dismissed by the client, or until the file contents is changed. It can be used
  to inject HTML.

