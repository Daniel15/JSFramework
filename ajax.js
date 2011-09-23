/**
 * Daniel15 JavaScript Framework - By Daniel15, 2011
 * http://dl.vc/jsframework
 * Feel free to use any of this, but please link back to my site (dan.cx)
 */
 
var Ajax = (function(window)
{
	var getXHR;
	
	// W3C
	if (window.XMLHttpRequest)
	{
		getXHR = function()
		{
			return new XMLHttpRequest();
		}
	}
	// Internet Explorer
	else if (window.ActiveXObject)
	{
		getXHR = function()
		{
			try
			{
				return new ActiveXObject("Msxml2.XMLHTTP")
			}
			catch (e)
			{
				try
				{
					return new ActiveXObject("Microsoft.XMLHTTP") 
				} 
				catch (e) 
				{
					alert('Could not create AJAX requester!');
				}
			}
		}
	}
	
	/**
	 * Handle AJAX response. Passes data to callback.
	 * @param	Callback to pass data to
	 * @param	Format data is in (json, xml, text)
	 * @param	XMLHttpRequest response is coming from
	 */
	function handleResponse(callback, format, xhr)
	{
		if (format == 'json')
		{
			var data = JSON.parse(xhr.responseText);
			callback(data, xhr);
		}
		else
		{
			callback(xhr.responseText, xhr);
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
			var data = xhr.responseText.replace(/[\n\r]/g,"");
			return eval('(' + data + ')');
		}
	}
	
	// Public functions
	return {
		/**
		 * Send an AJAX request.
		 * @param	URL to send request to
		 * @param	Options for the request
		 * @todo Document available options
		 */
		load: function(url, options)
		{
			// Abort any current request
			if (this.currentRequest)
			{
				this.currentRequest.onreadystatechange = null;
				this.currentRequest.abort();
			}
			
			options = Util.extend(
			{
				method: 'post',
				onSuccess: function() {},
				onFailure: function() {},
				onComplete: function() {},
				format: 'json',
				data: null
			}, options);
			
			var xhr = this.currentRequest = getXHR();
			xhr.open(options.method, url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			if (options.method == 'post')
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function()
			{
				// readyState 4 == complete
				if (xhr.readyState == 4)
				{
					handleResponse((xhr.status == 200 ? options.onSuccess : options.onFailure), options.format, xhr);
					options.onComplete(xhr);
				}
			}
			xhr.send(Util.buildQueryString(options.data));
		}
	}
})(window);