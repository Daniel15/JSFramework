/**
 * Daniel15 JavaScript Framework - By Daniel15, 2011
 * http://dl.vc/jsframework
 * Feel free to use any of this, but please link back to my site (dan.cx)
 */

var Events = (function()
{
	var eventHandling;
	
	// First do the browser-specific stuff
	// W3C
	if (document.addEventListener)
	{
		eventHandling = {
			add: function(obj, type, fn)
			{
				obj.addEventListener(type, fn, false);
			},
			stop: function(e)
			{
				e.preventDefault();
				e.stopPropagation();
			}
		};
	}
	// Internet Explorer
	else
	{
		// Based off http://www.quirksmode.org/blog/archives/2005/10/_and_the_winner_1.html
		eventHandling = {
			add: function(obj, type, fn)
			{
				obj['e'+type+fn] = fn;
				obj[type+fn] = function() { obj['e'+type+fn]( window.event ); }
				obj.attachEvent('on'+type, obj[type+fn]);
			},
			stop: function(e)
			{
				e.returnValue = false;
				e.cancelBubble = true;
			}
		};
	}
	
	// Now add the custom methods
	return Util.extend(eventHandling, 
	{
		/**
		 * Onload handler for Daniel15 framework. Calls onload functions depending on the current page.
		 * Splits the body ID by hyphen (-), uses first piece as the main object, and other pieces as 
		 * sub-objects. Non-existant init methods are ignored (no error is thrown).
		 *
		 * Example: An ID of "site-projects" would call Page.Site.init() and Page.Site.Projects.init().
		 * site-projects-foo would call Page.Site.init(), Page.Site.Projects.init() and Page.Site.Foo.init().
		 * "blog" would call Page.Blog.init().
		 */
		initPage: function(id)
		{
			// Everything here is in the Page object. No Page object, nothing can be done
			if (!window.Page)
				return;
			
			// First call the global page init function
			Page.Global && Page.Global.init();
			
			// Ensure the ID is set
			id || (id = document.body.id);
			
			var id_pieces = id.split('-');
			// First piece is the main object
			var obj_name = id_pieces.shift();
			obj_name = obj_name.charAt(0).toUpperCase() + obj_name.slice(1);
			
			// If we don't have the object, just die
			if (!(obj = Page[obj_name]))
				return;
			
			// Call the base object initialisation function
			obj.init && obj.init();
			// Go through each piece, and call the initialisation on it.
			for (var i = 0, count = id_pieces.length; i < count; i++)
			{
				// Make the first letter uppercase
				var piece = id_pieces[i].charAt(0).toUpperCase() + id_pieces[i].slice(1);
				// Call the init method if it exists
				obj[piece] && obj[piece].init && obj[piece].init();
			}
		}
	});
})();