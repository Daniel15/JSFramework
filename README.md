Simple JavaScript Framework
===========================

Simple JavaScript framework I use when I don't need a heavyweight framework like MooTools. Currently 
contains a very limited feature set (mostly AJAX) which won't be growing much. In general, I aim to
support IE 6 and above, as well as the latest versions of Opera, Firefox and Chrome.

Automatically generated API documentation is available at http://dan.cx/projects/jsframework/docs/,
this is most likely more up-to-date than the information in this README. Please refer to the code 
and unit tests for the latest features.

Features
========
 - AJAX
   - Both GET and POST
 - Cross-browser event handling
   - Normalisation of events in IE (target, currentTarget, pageX and pageY properties)
   - Onload handler that automatically calls functions based on body ID
   - Event delegation
 - DOM functions and DOM object wrapping
   - getElementsByClassName polyfill for IE6 and 7
 - General utilities
 - Templating (based off Simple JavaScript Templating by John Resig)
 - Polyfills for old browsers
   - getElementsByClassName for IE6 and 7
   - HTML5 window.localStorage polyfill
   - Function.prototype.bind, String.prototype.trim
   - JSON.parse
 - Simple "class" (prototypal inheritance) implementation

Examples
========

AJAX - GET
----------
```javascript
var request = new Ajax('test.php',
{
	onSuccess: function(data)
	{
		console.log(data);
	}
});
request.send();
```

AJAX - POST
-----------
Uses Util.buildQueryString to encode POST data. Arrays and hashes are sent using PHP syntax

```javascript
(new Ajax('test.php',
{
	data:
	{
		'hello': 'world',
		// Supports arrays
		'arrayTest': [1, 2, 3, 4, 5],
		// Supports hashes
		'hashText': 
		{
			'awesome': true,
			'something': 'else'
		}
	},
	onSuccess: function(data)
	{
		console.log(data);
	}
})).send();
```
	
Alternatively, the data can be passed to the send() method directly:

```javascript
(new Ajax('test.php',
{
	onSuccess: function(data)
	{
		console.log(data);
	}
})).send({hello: 'world'});
```

DOM
---
```javascript
// Obtaining existing elements
var container = $('container'); // or DOM.get('container')
	
// Element creation
var newEl = DOM.create('div',
{
	id: 'hello-world',
	className: 'awesome',
	innerHTML: 'This is a test!'
});
	
// Element insertion
container.appendChild(newEl); // Insert inside container
container.insertAfter(newEl); // Insert *after* container

// Event handling
newEl.addEvent('click', function() { alert('Clicked!'); });

// Event handling using delegates
DOM.body.addEvent('click', 'a', 'hello', function() { alert('A link with class "hello" was clicked' });

// Appending HTML
newEl.append('Some more HTML here');
```
	
Classes
-------
Creation:

```javascript
var Person = new Class(
{
	init: function(name)
	{
		this.name = name;
	},
	helloWorld: function()
	{
		return 'Hello';
	},
	helloWorld2: function()
	{
		return 'Hello2';
	}
});
```
	
Instantiation:

```javascript
var me = new Person('Daniel');
console.log('me.name = ', me.name); // Daniel
console.log('me.helloWorld() = ', me.helloWorld()); // Hello
console.log('me.helloWorld2() = ', me.helloWorld2()); // Hello2
console.log('me instanceof Person = ', me instanceof Person); // true
```
	
Inheritance:

```javascript
var Ninja = Person.extend(
{
	helloWorld2: function()
	{
		return 'Ninja helloWorld2, original = ' + this.parent();
	},
	helloWorld3: function()
	{
		return 'Ninja helloWorld3';
	}
});
	
var awesome2 = new Ninja('Awesome');
console.log('awesome2.name = ', awesome2.name); // Awesome
console.log('awesome2.helloWorld() = ', awesome2.helloWorld()); // Hello
console.log('awesome2.helloWorld2() = ', awesome2.helloWorld2()); // Ninja helloWorld2, original = Hello2
console.log('awesome2.helloWorld3() = ', awesome2.helloWorld3()); // Ninja helloWorld3
console.log('awesome2 instanceof Ninja = ', awesome2 instanceof Ninja); // true
console.log('awesome2 instanceof Person = ', awesome2 instanceof Person); // true
```
	
General utilities
-----------------

```javascript
// Building query strings
var stuff = 
{
	hello: 'world',
	foo: 'bar',
	arrayTest: [1, 2, 3],
	objectTest: 
	{
		one: 'two',
		three: 'four'
	}
};

Util.buildQueryString(stuff) // returns hello=world&foo=bar&arrayTest[]=1&arrayTest[]=2&
                             // objectTest[one]=two&objectTest[three]=four


// IE detection
Browser.ie // Contains IE version, or 'undefined' if not using IE
```	

Tests
=====
Jasmine is being used for unit tests. They are all located in the "tests" directory - Open 
"index.htm" in your browser to run them.

Licence
=======
(The MIT licence)

Copyright (C) 2011-2012 Daniel Lo Nigro (Daniel15)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
