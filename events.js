/**
 * Daniel15 JavaScript Framework - By Daniel15, 2011
 * http://dl.vc/jsframework
 * Feel free to use any of this, but please link back to my site (dan.cx)
 */

var Events = (function()
{
	// W3C
	if (document.addEventListener)
	{
		return {
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
		return {
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
})();