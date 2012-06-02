/*
 * Daniel15 JavaScript Framework - By Daniel15, 2011
 * http://dl.vc/jsframework
 * Feel free to use any of this, but please link back to my site (dan.cx)
 */
 
(function()
{
	// Check for native support
	if (window.localStorage)
		return;
		
	// userData storage (IE-specific)
	if (Browser.ie)
	{
		var storageEl = document.createElement('span');
		storageEl.id = '__daniel15_storage';
		storageEl.style.behavior = 'url(#default#userData)';
		document.body.appendChild(storageEl);
		//storageEl.load(window.location.hostname);

		window.localStorage = 
		{
			setItem: function(name, value)
			{
				storageEl.setAttribute(name, value);
				storageEl.save(window.location.hostname);
			},
			getItem: function(name)
			{
				return storageEl.getAttribute(name);
			}
		};
	}
	// When all else fails, cookies...
	else
	{
		// TODO: Implement using cookies
		window.localStorage = 
		{
			setItem: function(name, value)
			{
			},
			getItem: function(name)
			{
				return 'null';
			}
		};
	}
})();
