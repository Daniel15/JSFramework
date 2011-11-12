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
	 * @param	Whether to wrap the element or not. Optional, default is true
	 * @return The new element (or a wrapper if wrap is true)
	 */
	create: function(tag, properties, wrap, attributes)
	{
		if (wrap == undefined)
			wrap = true;
			
		var el = document.createElement(tag);
		Util.extend(el, properties);
		if (attributes)
		{
			for (var i in attributes)
			{
				if (attributes.hasOwnProperty(i))
				{
					el.setAttribute(i, attributes[i]);
				}
			}
		}
		return wrap ? DOM.wrap(el) : el;
	},
	
	/**
	 * Wrap an element with useful functions
	 * @param	ID of the element
	 * @return	An ElementWrapper instance
	 */
	wrap: function(el)
	{
		if (!el)
			return null;
			
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
	},
	
	/**
	 * Wrap all the passed elements
	 * TODO: Use custom array class instead of a normal array?
	 * @param	Array of elements
	 * @return	Array of wrapped elements
	 */
	wrapAll: function(input)
	{
		var output = [];
		for (var i = 0, count = input.length; i < count; i++)
		{
			output.push(DOM.wrap(input[i]));
		}
		
		return output;
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
	 * Gets the internal element ID for this element. This is *not* the id in the HTML!
	 * @return The element ID
	 */
	getElementId: function()
	{
		return this.element.getAttribute(DOM.JS_ELEMENT_ID);
	},
	
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
	
	/**
	 * Check if this element has the specified CSS class name
	 * @param	Class name to look for
	 * @return	Whether this element has this class name as one of its classes
	 */
	hasClass: function(name)
	{
		return (' ' + (this.element || this).className.toUpperCase() + ' ').indexOf(' ' + name.toUpperCase() + ' ') > -1;
	},
	
	/**
	 * Add the specified class name to this element
	 * @param	Class name to add
	 */
	addClass: function(name)
	{
		this.element.className += ' ' + name;
		return this;
	},
	
	/**
	 * Remove the specified class name from this element
	 * @param	Class name to remove
	 */
	removeClass: function(name)
	{
		var newClass = (' ' + this.element.className + ' ').replace(' ' + name + '', '');
		this.element.className = newClass.trim();
		return this;
	},
	
	////////////////////////////////////////////////////////////////////////////////////////////////
	
	// TODO: Clean up the below blocks of code. Remove duplication.
	
	/**
	 * Get the first child element by tag name, or null if there is no matching child
	 * @param	Tag name to get
	 * @param	Whether to wrap the element or not. Optional, default is true
	 * @return	The element, or a wrapper around it if wrap is true.
	 */
	firstByTag: function(tag, wrap)
	{
		if (wrap == undefined)
			wrap = true;
			
		var els = this.getByTag(tag, false);
		return els && els[0] && (wrap ? DOM.wrap(els[0]) : els[0]);
	},
	
	/**
	 * Get all children by tag name
	 * @param	Tag name to get
	 * @param	Whether to wrap the element or not. Optional, default is true
	 * @return	An array of element, or wrappers around them if wrap is true.
	 */
	getByTag: function(tag, wrap)
	{
		if (wrap == undefined)
			wrap = true;
			
		var els = this.element.getElementsByTagName(tag);
		return wrap ? DOM.wrapAll(els) : els;
	},
	
	/**
	 * Get the first child element by class name, or null if there is no matching child
	 * @param	Tag name to get
	 * @param	Whether to wrap the element or not. Optional, default is true
	 * @return	The element, or a wrapper around it if wrap is true.
	 */
	firstByClass: function(className, wrap)
	{
		if (wrap == undefined)
			wrap = true;
			
		var els = this.getByClass(className, false);
		return els && els[0] && (wrap ? DOM.wrap(els[0]) : els[0]);
	},
	
	/**
	 * Get all children by class name
	 * @param	Class name to get
	 * @param	Whether to wrap the element or not. Optional, default is true
	 * @return	An array of element, or wrappers around them if wrap is true.
	 */
	getByClass: function(className, wrap)
	{
		if (wrap == undefined)
			wrap = true;
			
		var els = this._getByClass(this.element, className);			
		return wrap ? DOM.wrapAll(els) : els;
	},
	
	/**
	 * Internal function for getting elements by class name. Don't use externally (use getByClass
	 * instead)
	 */
	_getByClass: (function()
	{
		var tempEl = document.createElement('div');
		// Normal browsers
		if ('getElementsByClassName' in tempEl)
		{
			return function(el, className)
			{
				return el.getElementsByClassName(className);
			}
		}
		// IE8 supports querySelectorAll but not getElementsByClassName
		if ('querySelectorAll' in tempEl)
		{
			return function(el, className)
			{
				return el.querySelectorAll('.' + className);
			}
		}
		// IE 6 and 7... Naive polyfill
		// TODO: Unit test this!!
		return function(el, className)
		{
			var els = el.all || el.getElementsByTagName('*');
			var result = [];
			var hasClass = ElementWrapper.prototype.hasClass;
			
			for (var i = 0, count = els.length; i < count; i++)
			{
				if (hasClass.call(els[i], className))
				{
					result.push(els[i]);
				}
			}
			
			return result;
		}
	})(),
	
	/**
	 * Get the first child element by a selector or null if there is no matching child
	 * @param	Tag name to get
	 * @param	Whether to wrap the element or not. Optional, default is true
	 * @return	The element, or a wrapper around it if wrap is true.
	 */
	firstBySelector: function(className, wrap)
	{
		if (wrap == undefined)
			wrap = true;
		
		// TODO: Polyfill for IE
		var el = this.element.querySelectorAll(selectors);
		return el && (wrap ? DOM.wrap(el) : el);
	},
	
	/**
	 * Get all children by selector
	 * @param	Selector to use
	 * @param	Whether to wrap the element or not. Optional, default is true
	 * @return	An array of element, or wrappers around them if wrap is true.
	 */
	getBySelector: function(selectors, wrap)
	{
		if (wrap == undefined)
			wrap = true;
			
		// TODO: Polyfill for IE
		var els = this.element.querySelectorAll(selectors);
		return wrap ? DOM.wrapAll(els) : els;
	},
	
	////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Get all the children of this element
	 * @return Array of the children
	 */
	children: function()
	{
		return DOM.wrapAll(this.element.children);
	},
	
	/**
	 * Get the parent element of this element. If a tag name is passed, get the first parent that
	 * matches this tag name.
	 * @param	String		Name of tag to look for
	 * @param	The parent element
	 */
	parent: function(tagName)
	{
		if (!tagName)
			return DOM.wrap(this.element.parentNode);
			
		tagName = tagName.toUpperCase();
		var parent = this.element.parentNode;
		while (parent && parent.nodeName.toUpperCase() != tagName)
			parent = parent.parentNode;
			
		return DOM.wrap(parent);
	},
	
	/**
	 * Get the sibling element before this one
	 */
	previous: (function()
	{
		var tempEl = document.createElement('div');
		if ('previousElementSibling' in tempEl)
		{
			return function()
			{
				return DOM.wrap(this.element.previousElementSibling);
			}
		}
		else
		{
			return function()
			{
				var sibling = this.element;
				while (sibling = sibling.previousSibling)
				{
					if (sibling.nodeType === 1)
					{
						return DOM.wrap(sibling);
					}
				}
				return null;
			}
		}
	})(),
	
	/**
	 * Get the sibling element after this one
	 */
	next: (function()
	{
		var tempEl = document.createElement('div');
		if ('nextElementSibling' in tempEl)
		{
			return function()
			{
				return DOM.wrap(this.element.nextElementSibling);
			}
		}
		else
		{
			return function()
			{
				var sibling = this.element;
				while (sibling = sibling.nextSibling)
				{
					if (sibling.nodeType === 1)
					{
						return DOM.wrap(sibling);
					}
				}
				return null;
			}
		}
	})(),
	
	/**
	 * Remove this element from the DOM.
	 */
	remove: function()
	{
		// Ensure the wrapper is removed from the cache
		DOM.cache[this.element.getAttribute(DOM.JS_ELEMENT_ID)] = null;
		
		// Actually delete it
		this.element.parentNode.removeChild(this.element);
		delete this.element;
	},
	
	/**
	 * Add a child to the start of this element
	 * @param	New element to add
	 */
	prependChild: function(newNode)
	{
		if (newNode instanceof ElementWrapper)
			newNode = newNode.element;
		
		this.element.insertBefore(newNode, this.element.firstChild);
		return this;
	},
	
	cloneNode: function(deep)
	{
		return new ElementWrapper(this.element.cloneNode(deep));
	},
	
	/***** Normal DOM method wrappers *****/
	setAttribute: function(attribute, value)
	{
		this.element.setAttribute(attribute, value);
		return this;
	},
	getAttribute: function(attribute)
	{
		return this.element.getAttribute(attribute);
	},
	appendChild: function(newNode)
	{
		if (newNode instanceof ElementWrapper)
			newNode = newNode.element;
		
		this.element.appendChild(newNode);
		return this;
	},
	
	removeChild: function(node)
	{
		this.element.removeChild(node);
		return this;
	}
}

// Body is used frequently
DOM.body = DOM.wrap(document.body);

function $(el)
{
	return DOM.wrap(el);
}