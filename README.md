Simple JavaScript Framework
===========================

Simple JavaScript framework I use when I don't need a heavyweight framework like MooTools. Currently 
contains a very limited feature set (mostly AJAX) which won't be growing much.

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

Licence
=======
Please feel free to use any bits of this code in your own work, but if you do, link to my site
(dan.cx)