Simple JavaScript Framework
===========================

Simple JavaScript framework I use when I don't need a heavyweight framework like MooTools. Currently 
contains a very limited feature set (mostly AJAX) which won't be growing much.

Features
========
 - AJAX
   - Both GET and POST
 - Cross-browser event handling
 - DOM functions and DOM object wrapping
 - General utilities
 - Templating (based off Simple JavaScript Templating by John Resig)
   

Examples
========

AJAX - GET
----------
	Ajax.load('test.php',
	{
		onSuccess: function(data)
		{
			console.log(data);
		}
	});


AJAX - POST
-----------
Uses Util.buildQueryString to encode POST data. Arrays and hashes are sent using PHP syntax

	Ajax.load('test.php',
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
	});

DOM
---

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
	
	// Appending HTML
	newEl.append('Some more HTML here');
	
General utilities
-----------------

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
	

Licence
=======
Please feel free to use any bits of this code in your own work, but if you do, link to my site
(dan.cx)