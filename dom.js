/**
 * Daniel15 JavaScript Framework - By Daniel15, 2011
 * http://dl.vc/jsframework
 * Feel free to use any of this, but please link back to my site (dan.cx)
 */
 
var DOM =
{
	/**
	 * Create and return a new wrapped DOM element
	 * @param	Tag name to create (eg. "span")
	 * @param	Properties to set on the new element
	 * @return ElementWrapper The new element
	 */
	create: function(tag, options)
	{
		var el = document.createElement(tag);
		Util.extend(el, options);
		return new ElementWrapper(el);
	}
}

/**
 * Class that wraps DOM elements and provides additional functionality
 */
function ElementWrapper(element)
{
	this.element = element;
	
}

ElementWrapper.prototype =
{
	/**
	 * Set a property on this element
	 * @param	Property name
	 * @param	Value to set
	 */
	set: function(key, value)
	{
		this.element[key] = value;
	},
	
	/**
	 * Get a property on this element
	 * @param	Property name
	 * @return	Property value
	 */
	get: function(key)
	{
		return this.element[key];
	},
	
	/**
	 * Insert a DOM node after this node
	 * @param	Wrapped DOM node
	 */
	insertAfter: function(newNode)
	{
		this.element.parentNode.insertBefore(newNode.element, this.element.nextSibling);
	},
	
	/**
	 * Add an event handler to this element.
	 * Based off http://www.quirksmode.org/blog/archives/2005/10/_and_the_winner_1.html
	 * @param	Type of event handler (eg. "click")
	 * @param	Function for handling these events
	 */
	addEvent: function(type, fn)
	{
		Events.add(this.element, type, fn);
	}
}



function $(el)
{
	// If it's already wrapped, just return the element
	if (el instanceof ElementWrapper)
		return el;
		
	return new ElementWrapper(document.getElementById(el));
}