# NamineJS
OpenCart modification parser.
I made it to parse modifications from dev files. 
So for the start you need two versions of your project: dev and work.

In dev you are writing your modifications with certain commentaries.

## Quick start

```
npm install namine

```

Write in your dev code your modifications

Modification for .php files:
```
...
//-nmn MODIFICATION_NAME pos:"POSITION" line:"LINE"
MODIFICATION_TEXT
//-nmn
...
```

Modification for .tpl and .twig files
```
...
<!--//-nmn MODIFICATION_NAME pos:"POSITION" line:"LINE"-->
MODIFICATION_TEXT
<!--//-nmn-->
...
```
* MODIFICATION_NAME - name of your modification without spaces
* POSITION - position of modification (after, before, replace)
* LINE - line after, before or replaced of your modification
* MODIFICATION_TEXT - just your modification
