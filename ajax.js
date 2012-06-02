/**
 * Daniel15 JavaScript Framework - By Daniel15, 2011
 * http://dl.vc/jsframework
 * Feel free to use any of this, but please link back to my site (dan.cx)
 */
 
/**
 * Create a new AJAX requester. 
 * @class Ajax
 * @constructor
 * @module JSFramework
 * @submodule AJAX
 * @param  {String} url URL to load
 * @param  {Object} options Options, which may consist of the following:
 *
 *  - method: `POST` or `GET`
 *  - onSuccess, onFailure, onComplete: Callbacks for when the specified event happens
 *  - format: `json` or `text`, format to interpret result as
 *  - data: GET or POST data to send when doing request
 *  - context: What "this" should be when callback is called
 * @example
	// Basic GET request:
	var request = new Ajax('test.php',
	{
		onSuccess: function(data)
		{
		    console.log(data);
		}
	});
	request.send();
 * @example
 	// POST request
 	// Uses Util.buildQueryString to encode POST data. Arrays and hashes are sent using PHP syntax
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
	
	// Alternatively, the data can be passed to the send() method directly:
	(new Ajax('test.php',
	{
		onSuccess: function(data)
		{
		    console.log(data);
		}
	})).send({hello: 'world'});
 */
var Ajax = function(url, options)
{
	/**
	 * URL the request will be to
	 * @property url
	 * @type String
	 */
	this.url = url;
	/**
	 * Current request, if any
	 * @property currentRequest
	 * @type XMLHttpRequest
	 * @private
	 */
	this.currentRequest = null;
	
	/**
	 * Options for the AJAX request
	 * @property options
	 * @type Object
	 */
	this.options = Util.extend(
	{
		// Default options:
		method: 'post',
		// Default the callbacks to empty functions
		onSuccess: Util.emptyFn,
		onFailure: Util.emptyFn,
		onComplete: Util.emptyFn,
		format: 'json',
		data: null,
		context: null
	}, options);
}

// Shared variables
/**
 * Count of how many requests have been done
 * @property requestCount
 * @type Integer
 * @static
 * @private
 */
Ajax.requestCount = 0;
/**
 * All the currently executing requests
 * @property requests
 * @type Object
 * @static
 * @private
 */
Ajax.requests = {};

Ajax.prototype = 
{
	/**
	 * Send this AJAX request
	 * @method send
	 * @param {Object} data	Query string data to send, optional.
	 */
	send: function(data)
	{
		// Abort any current request if required
		if (this.currentRequest)
		{
			this.currentRequest.onreadystatechange = Util.emptyFn;
			this.currentRequest.abort();
		}
		
		var xhr = this.currentRequest = this._getXHR();
		xhr.open(this.options.method, this.url, true);
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		if (this.options.method == 'post')
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			
		var self = this;
		// Save the request so we can abort it if the user switches page
		var requestId = ++Ajax.requestCount;
		Ajax.requests[requestId] = xhr;
		
		xhr.onreadystatechange = function()
		{
			// readyState 4 == complete
			if (xhr.readyState == 4)
			{
				self._onComplete(xhr, requestId);
			}
		}
		xhr.send(Util.buildQueryString(data || this.options.data));
	},
	
	/**
	 * Internal function, called when request completes
	 * @method _onComplete
	 * @param	{XMLHttpRequest} xhr        XHR object used to send request
	 * @param	{Integer}        requestId  Request ID
	 * @private
	 */
	_onComplete: function(xhr, requestId)
	{
		var callback = xhr.status == 200 ? this.options.onSuccess : this.options.onFailure;
		
		if (this.options.format == 'json')
		{
			try
			{
				var data = JSON.parse(xhr.responseText);
			}
			catch (e)
			{
				this.options.onFailure.call(this.options.context, xhr.responseText, xhr, e);
			}
			callback.call(this.options.context, data, xhr);
		}
		else
		{
			callback.call(this.options.context, xhr.responseText, xhr);
		}
		
		this.options.onComplete(xhr);
		this.currentRequest = null;
		// Remove this request from the currently executing requests
		Ajax.requests[requestId] = null;
		delete Ajax.requests[requestId];
	},
	
	/**
	 * Internal function, get an XMLHttpRequest object
	 * @method _getXHR
	 * @return XMLHttpRequest object
	 * @private
	 */
	_getXHR: (function()
	{
		// W3C
		if (window.XMLHttpRequest)
		{
			return function()
			{
				return new XMLHttpRequest();
			}
		}
		// Internet Explorer
		// Reference: http://blogs.msdn.com/b/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
		else if (window.ActiveXObject)
		{
			return function()
			{
				try { return new ActiveXObject("Msxml2.XMLHTTP.6.0") } catch (e) { }
				try { return new ActiveXObject("Msxml2.XMLHTTP.3.0") } catch (e) { }
				try { return new ActiveXObject("Microsoft.XMLHTTP") } catch (e) { }
				
				alert('Could not create AJAX requester!');
			}
		}
	})()
};

// Abort all the requests when navigating away
// Needs to be done this way as this is a non-standard event :(
window.onunload = function()
{
	for (var i in Ajax.requests)
	{
		Ajax.requests[i].onreadystatechange = Util.emptyFn;
		Ajax.requests[i].abort();
	}
}

// No native JSON support (eg. Internet Explorer < 8)
// Very simple JSON.parse polyfill
if (!window.JSON)
	window.JSON = {};
if (!window.JSON.parse)
{
	window.JSON.parse = function(data)
	{
		//\n's in JSON string, when evaluated will create errors in IE
		var data = data.replace(/[\n\r]/g, '');
		return eval('(' + data + ')');
	}
}
