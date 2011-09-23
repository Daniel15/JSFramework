/**
 * Daniel15 JavaScript Framework - By Daniel15, 2011
 * http://dl.vc/jsframework
 * Feel free to use any of this, but please link back to my site (dan.cx)
 */
 
/**
 * General utilities
 */
var Util = 
{
	/**
	 * Add all elements from "a" to "b" and return the new "b"
	 */
	extend: function(b, a)
	{
		for (var key in a || {})
		{
			if (a.hasOwnProperty(key))
				b[key] = a[key];
		}
		return b;
	},
	
	/**
	 * URL encode some data, for POSTing or use in a GET querystring. Supports a single level of 
	 * arrays or objects in the data hash. These will be formatted as a PHP array.
	 * @param	Hash of data
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
						result.push(key + '[]=' + data[key][i]);
					}
				}
				// Add objects in PHP notation - key[innerKey1]=value1&key[innerKey2]=value2
				else if (typeof(data[key]) == 'object')
				{
					for (var innerKey in data[key])
					{
						if (data.hasOwnProperty(key))
						{
							result.push(key + '[' + innerKey + ']=' + data[key][innerKey]);
						}
						
					}
				}
				else
					result.push(key + '=' + data[key]);
			}
		}
		
		return result.join('&');
	}
};

/**
 * Browser-specific stuff. Mainly IE hacks
 */
var Browser =
{
	/**
	 * The IE version in use, or 'undefined' if using a non-IE browser
	 * Based off http://james.padolsey.com/javascript/detect-ie-in-js-using-conditional-comments/
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