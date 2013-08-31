/* @preserve
 * Daniel15 JavaScript Framework - By Daniel15, 2011
 * http://dl.vc/jsframework
 * Feel free to use any of this, but please link back to my site (dan.cx)
 */
 
/**
 * General utilities
 * @module JSFramework
 * @submodule Core
 * @class Util
 * @static
 */
var Util = 
{
	emptyFn: function() { },
	
	/**
	 * Add all elements from source to destination and return the modified destination (for chaining)
	 * @method  extend
	 * @param	destination {Object} Object to copy properties to
	 * @param	source      {Object} Object to copy properties from
	 * @return  {Object}    An object with all the combined properties
	 * @example
	var first = { hello: 'world' };
	var second = { foo: 'bar' };
	var result = Util.extend(first, second);
	// first and result now both contain { hello: 'world', foo: 'bar'}
	 */
	extend: function(destination, source)
	{
		for (var key in source || {})
		{
			if (source.hasOwnProperty(key))
				destination[key] = source[key];
		}
		return destination;
	},
	
	/**
	 * URL encode some data, for POSTing or use in a GET querystring. Supports a single level of 
	 * arrays or objects in the data hash. These will be formatted as a PHP array.
	 * @method  buildQueryString
	 * @param	Hash {Object} Hash of data
	 * @return  {String} URL encoded querystring
	 * @example
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

	Util.buildQueryString(stuff) // returns hello=world&foo=bar&arrayTest[]=1&arrayTest[]=2&objectTest[one]=two&objectTest[three]=four
	 */
	buildQueryString: function(data)
	{
		var result = [];
		
		for (var key in data)
		{
			if (data.hasOwnProperty(key))
			{
				// Add arrays in PHP notation - key[]=value1&key[]=value2
				if (data[key] instanceof Array)
				{
					for (var i = 0, count = data[key].length; i < count; i++)
					{
						result.push(key + '[]=' + encodeURIComponent(data[key][i]));
					}
				}
				// Add objects in PHP notation - key[innerKey1]=value1&key[innerKey2]=value2
				else if (typeof(data[key]) == 'object')
				{
					for (var innerKey in data[key])
					{
						if (data.hasOwnProperty(key))
						{
							result.push(key + '[' + innerKey + ']=' + encodeURIComponent(data[key][innerKey]));
						}
						
					}
				}
				else
					result.push(key + '=' + encodeURIComponent(data[key]));
			}
		}
		
		return result.join('&');
	}
};

/**
 * Browser-specific stuff. Mainly IE hacks
 * @class Browser
 * @module JSFramework
 * @submodule Core
 * @static
 */
var Browser =
{
	/**
	 * The IE version in use, or 'undefined' if using a non-IE browser
	 * Based off http://james.padolsey.com/javascript/detect-ie-in-js-using-conditional-comments/
	 * @property ie
	 * @final
	 * @type Integer|undefined
	 */
	ie: (function()
	{
		var undef,
			v = 3,
			div = document.createElement('div'),
			all = div.getElementsByTagName('i');

		while (
			div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
			all[0]
		);

		return v > 4 ? v : undef;
	}())
};

/**
 * Function extensions - Extensions to JavaScript's native Function.prototype
 * @class Function
 */
Util.extend(Function.prototype, 
{
	/**
	 * Run this function after a certain delay
	 * @method delay
	 * @param delay {Double} Milliseconds to delay execution
	 * @example
	var helloWorld = function() { alert('Hello world!'); }
	helloWorld.delay(1000); // helloWorld will run after 1000 milliseconds
	 */
	delay: function(delay)
	{
		return setTimeout(this, delay);
	}
});

///////////////////////////////////////////////////////////////////////////////
// Polyfills

// Based off https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind)
{  
	Function.prototype.bind = function (oThis)
	{
		var aArgs = Array.prototype.slice.call(arguments, 1),
			fToBind = this,
			fNOP = function () {},
			fBound = function () {
			  return fToBind.apply(this instanceof fNOP ? this : oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)));
			};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};  
}

// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/Trim
if (!String.prototype.trim)
{
	String.prototype.trim = function ()
	{
		return this.replace(/^\s+|\s+$/g,'');
	};
}

// Based off https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create
if (!Object.create)
{
	Object.create = function (o)
	{
		function F() {}
		F.prototype = o;
		return new F();
	};
}


// Based off https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
if (!Array.prototype.filter)
{
	Array.prototype.filter = function(fn, thisObj)
	{
		var results = [];
		for (var i = 0, count = this.length; i < count; i++)
		{
			if (fn.call(thisObj, this[i], i, this))
			{
				results.push(this[i]);
			}
		}

		return results;
	};
}
