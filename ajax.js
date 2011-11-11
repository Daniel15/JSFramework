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
	// Reference: http://blogs.msdn.com/b/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
	else if (window.ActiveXObject)
	{
		getXHR = function()
		{
			try { return new ActiveXObject("Msxml2.XMLHTTP.6.0") } catch (e) { }
			try { return new ActiveXObject("Msxml2.XMLHTTP.3.0") } catch (e) { }
			try { return new ActiveXObject("Microsoft.XMLHTTP") } catch (e) { }
			
			alert('Could not create AJAX requester!');
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
			var data = data.replace(/[\n\r]/g,"");
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
			options = Util.extend(
			{
				method: 'post',
				onSuccess: function() {},
				onFailure: function(text, xhr, e)
				{
					alert('Error occured while loading data: ' + text + ' [' + (e && e.message) + ']');
				},
				onComplete: function() {},
				format: 'json',
				data: null,
				// What "this" should be when callback is called
				context: null,
				abortPrev: false
			}, options);
			
			// Abort any current request if required
			if (options.abortPrev && this.currentRequest)
			{
				this.currentRequest.onreadystatechange = Util.emptyFn;
				this.currentRequest.abort();
			}
			
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
					var callback = xhr.status == 200 ? options.onSuccess : options.onFailure;
					
					if (options.format == 'json')
					{
						try
						{
							var data = JSON.parse(xhr.responseText);
						}
						catch (e)
						{
							options.onFailure.call(options.context, xhr.responseText, xhr, e);
						}
						callback.call(options.context, data, xhr);
					}
					else
					{
						callback.call(options.context, xhr.responseText, xhr);
					}
					
					options.onComplete(xhr);
					this.currentRequest = null;
				}
			}
			xhr.send(Util.buildQueryString(options.data));
		}
	}
})(window);
