/**
 * Daniel15 JavaScript Framework - By Daniel15, 2011
 * http://dl.vc/jsframework
 * Feel free to use any of this, but please link back to my site (dan.cx)
 */
 
var DOM =
{
	/** Cache of ElementWrappers */
	cache: [],
	/** Name of the attribute used to store an element ID number in the cache */
	JS_ELEMENT_ID: 'js-element-id',
	
	/**
	 * Create and return a new wrapped DOM element
	 * @param	Tag name to create (eg. "span")
	 * @param	Properties to set on the new element
	 * @param	Whether to extend the element or not
	 * @return ElementWrapper The new element
	 */
	create: function(tag, options, extend)
	{
		if (extend == undefined)
			extend = true;
			
		var el = document.createElement(tag);
		Util.extend(el, options);
		return extend ? new ElementWrapper(el) : el;
	},
	
	/**
	 * Get an element on the page and wrap it with useful functions
	 * @param	ID of the element
	 */
	get: function(el)
	{
		// If it's already wrapped, just return the element
		if (el instanceof ElementWrapper)
			return el;
		
		// If it's a string, assume it's an ID
		if (typeof(el) == "string")
			el = document.getElementById(el);
			
		// Check if a wrapper was already created for this
		var elId = el.getAttribute(this.JS_ELEMENT_ID);
		if (elId)
			return this.cache[elId];
			
		// Otherwise, create a new wrapper and cache it
		var wrapper = new ElementWrapper(el);
		el.setAttribute(this.JS_ELEMENT_ID, this.cache.push(wrapper) - 1);
		return wrapper;
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
		return this;
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
		return this;
	},
	
	/**
	 * Append some HTML to the element
	 */
	append: function(html)
	{
		var newContent = document.createElement('div');
		newContent.innerHTML = html;
		while (newContent.firstChild)
		{
			this.element.appendChild(newContent.firstChild);
		}
		return this;
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
		return this;
	},
	
	/**
	 * Get the position of this element
	 * @return	Hash with x and y values
	 */
	getPosition: function()
	{
		var obj = this.element,
			x = 0,
			y = 0;
		do
		{
			x += obj.offsetLeft;
			y += obj.offsetTop;
		}
		while (obj = obj.offsetParent);
		
		return {x: x, y: y};
	},
	
	/**
	 * Set a CSS style on this element
	 * @param	Style to set
	 * @param	New style value
	 */
	setStyle: function(style, value)
	{
		// TODO: Support converting hyphenated-keys to camelCase
		this.element.style[style] = value;
		return this;
	},
	
	/**
	 * Set multiple CSS styles at once
	 * @param	Hash of styles
	 */
	setStyles: function(styles)
	{
		for (var key in styles)
		{
			this.setStyle(key, styles[key]);
		}
		return this;
	},
	
	/***** Normal DOM method wrappers *****/
	appendChild: function(newNode)
	{
		this.element.appendChild(newNode);
		return this;
	},
	
	removeChild: function(node)
	{
		this.element.removeChild(node);
		return this;
	},
	
	getElementsByTagName: function(tag)
	{
		return this.element.getElementsByTagName(tag);
	}
}

function $(el)
{
	return DOM.get(el);
}