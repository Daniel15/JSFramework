/**
 * Daniel15 JavaScript Framework - By Daniel15, 2011
 * http://dl.vc/jsframework
 * Feel free to use any of this, but please link back to my site (dan.cx)
 */
 
var Events = 
{
	/**
	 * Add an event handler to this object.
	 * Based off http://www.quirksmode.org/blog/archives/2005/10/_and_the_winner_1.html
	 * @param	Object to add handler to
	 * @param	Type of event handler (eg. "click")
	 * @param	Function for handling these events
	 */
	add: (function()
	{
		// W3C
		if (document.addEventListener)
		{
			return function(obj, type, fn)
			{
				obj.addEventListener(type, fn, false);
			}
		}
		// Internet Explorer
		else
		{
			return function(obj, type, fn)
			{
				obj['e'+type+fn] = fn;
				obj[type+fn] = function() { obj['e'+type+fn]( window.event ); }
				obj.attachEvent('on'+type, obj[type+fn]);
			}
		}
	})()
}