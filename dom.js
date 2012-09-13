/*
 * Daniel15 JavaScript Framework - By Daniel15, 2011
 * http://dl.vc/jsframework
 * Feel free to use any of this, but please link back to my site (dan.cx)
 */
(function(window) {
/**
 * DOM methods
 * @class DOM
 * @static
 * @module JSFramework
 * @submodule DOM
 */ 
	var DOM = window.DOM =
	{
		/**
		 * Cache of ElementWrappers
		 * @property cache
		 * @type Array
		 * @private
		 */
		cache: [],
		/**
		 * Name of the attribute used to store an element ID number in the cache 
		 * @property JS_ELEMENT_ID
		 * @final
		 */
		JS_ELEMENT_ID: 'js-element-id',
		
		/**
		 * Create and return a new wrapped DOM element
		 * @method create
		 * @param	{String}  tag                Tag name to create (eg. "span")
		 * @param	{Object}  [properties={}]    Properties to set on the new element
		 * @param	{Boolean} [wrap=true]        Whether to wrap the element or not. Optional, default is true
		 * @param   {Object}  [attributes={}]    Attributes to set on the new element
		 * @return  {ElementWrapper|HTMLElement} The new element (or a wrapper if wrap is true)
		 * @example
		var newEl = DOM.create('div',
		{
			id: 'hello-world',
			className: 'awesome',
			innerHTML: 'This is a test!'
		}); // Creates <div id="hello-world" class="awesome">This is a test!</div>
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
		 * Wrap an element with useful functions. This creates an instance of {{#crossLink "ElementWrapper"}}{{/crossLink}} 
		 * that "wraps" the passed element. The `$` method can be used as a shortcut to this.
		 * @method wrap
		 * @param	{HTMLElement|ElementWrapper|String} el Either the ID of the element, or the element itself
		 * @return	{ElementWrapper} An ElementWrapper instance
		 * @example
		var containerEl = DOM.wrap('container'); // Gets the element with an ID of "container"
		var containerEl = $('container');        // Exact same as above - $ is an alias for DOM.wrap
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
		 * @method wrapAll
		 * @param	{Array of HTMLElement} input Array of elements
		 * @return	{Array of ElementWrapper} Array of wrapped elements
		 * @example
		// Get all DIVs on the page, and create an ElementWrapper for each
		var wrapped = DOM.wrapAll(document.getElementsByTagName('div'));
		 */
		wrapAll: function(input)
		{
			return new ElementWrapperList(input);
		},
		
		// Set below ElementWrapper, here just to make YUIDoc happy
		/**
		 * Body of the page
		 * @property body
		 * @type ElementWrapper
		 */
		body: null 
	}

	/**
	 * Class that wraps DOM elements and provides additional functionality. Should not be constructed
	 * directly - Instead use {{#crossLink "DOM/wrap"}}{{/crossLink}} or {{#crossLink "DOM/create"}}{{/crossLink}}
	 * @class ElementWrapper
	 * @constructor
	 * @module JSFramework
	 * @submodule DOM
	 */
	var ElementWrapper = window.ElementWrapper = function ElementWrapper(element)
	{
		/**
		 * The element being wrapped
		 * @property {HTMLElement} element
		 * @private
		 */
		this.element = element;
	}

	ElementWrapper.prototype =
	{
		/**
		 * Gets the internal element ID for this element. This is *not* the id in the HTML!
		 * @method getElementId
		 * @return {String} The element ID
		 */
		getElementId: function()
		{
			return this.element.getAttribute(DOM.JS_ELEMENT_ID);
		},
		
		/**
		 * Set a property on this element
		 * @method set
		 * @param {String} key   Property name
		 * @param {String} value Value to set
		 * @chainable
		 * @example
		var containerEl = $('container');
		containerEl.set('id', 'foobar'); // Changes ID of #container
		 */
		set: function(key, value)
		{
			this.element[key] = value;
			return this;
		},
		
		/**
		 * Get a property on this element
		 * @method get
		 * @param {String} key Property name
		 * @return {String} Property value
		 */
		get: function(key)
		{
			return this.element[key];
		},
		
		/**
		 * Insert a DOM node after this node
		 * @method insertAfter
		 * @param  {ElementWrapper} Wrapped DOM node
		 * @chainable
		 * @example
		// Insert a new element after #container
		var containerEl = $('container');
		var newEl = DOM.create('div', { id: 'helloWorld' });
		containerEl.insertAfter(newEl);
		 */
		insertAfter: function(newNode)
		{
			this.element.parentNode.insertBefore(newNode.element, this.element.nextSibling);
			return this;
		},
		
		/**
		 * Insert a DOM node before node
		 * @method insertBefore
		 * @param  {ElementWrapper} Wrapped DOM node
		 * @chainable
		 * @example
		// Insert a new element before #container
		var containerEl = $('container');
		var newEl = DOM.create('div', { id: 'helloWorld' });
		containerEl.insertBefore(newEl);
		 */
		insertBefore: function(newNode)
		{
			this.element.parentNode.insertBefore(newNode.element || newNode, this.element);
			return this;
		},
		
		/**
		 * Append some HTML to the element
		 * @method append
		 * @param  {String}  html  HTML to append
		 * @chainable
		 * @example
		$('container').append('<p>More content</p>');
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
		 * @method getPosition
		 * @return	{Object} X and Y values
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
		 * @method setStyle
		 * @param	{String} style  Style to set
		 * @param	{mixed}  value  New style value
		 * @chainable
		 * @example
		$('container').setStyle('backgroundColor', 'red');
		 */
		setStyle: function(style, value)
		{
			// TODO: Support converting hyphenated-keys to camelCase
			this.element.style[style] = value;
			return this;
		},
		
		/**
		 * Set multiple CSS styles at once
		 * @method setStyles
		 * @param {Object} styles  Styles to set
		 * @chainable
		 * @example
		$('container').setStyles({
			backgroundColor: red,
			fontSize: '18px'
		});
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
		 * @method hasClass
		 * @param	{String} name Class name to look for
		 * @return	{Boolean} Whether this element has this class name as one of its classes
		 * @example
		// HTML contains: <div id="test" class="hello">...</div>
		$('test').hasClass('blah'); // false
		$('test').hasClass('hello'); // true
		 */
		hasClass: function(name)
		{
			return (' ' + (this.element || this).className.toUpperCase() + ' ').indexOf(' ' + name.toUpperCase() + ' ') > -1;
		},
		
		/**
		 * Add the specified class name to this element
		 * @method addClass
		 * @param	{String} name Class name to add
		 * @chainable
		 */
		addClass: function(name)
		{
			this.element.className += ' ' + name;
			return this;
		},
		
		/**
		 * Remove the specified class name from this element
		 * @method removeClass
		 * @param	{String} name Class name to remove
		 * @chainable
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
		 * @method firstByTag
		 * @param	{String} tag Tag name to get
		 * @param	{Boolean} [wrap=true] Whether to wrap the element or not. Optional, default is true
		 * @return	{ElementWrapper|HTMLElement} The element, or a wrapper around it if wrap is true.
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
		 * @method getByTag
		 * @param	{String} tag Tag name to get
		 * @param	{Boolean} [wrap=true] Whether to wrap the elements or not. Optional, default is true
		 * @return	{Array of ElementWrapper|Array of HTMLElement} The elements, or wrappers around them if wrap is true.
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
		 * @method firstByClass
		 * @param	{String} className Class name to look for
		 * @param	{Boolean} [wrap=true] Whether to wrap the element or not. Optional, default is true
		 * @return	{ElementWrapper|HTMLElement} The element, or a wrapper around it if wrap is true.
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
		 * @method getByClass
		 * @param	{String} className Class name to look for
		 * @param	{Boolean} [wrap=true] Whether to wrap the elements or not. Optional, default is true
		 * @return	{Array of ElementWrapper|Array of HTMLElement} The elements, or wrappers around them if wrap is true.
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
		 * @method _getByClass
		 * @param  {HTMLElement} el        Element to search the children of
		 * @param  {String}      className Name of the class to search for
		 * @return {Array of HTMLElement} The matching elements
		 * @private
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
		 * Get the first child element by a selector or null if there is no matching child. Incomplete
		 * as there's not yet full IE support.
		 * @method firstBySelector
		 * @param	{String} selectors Selector to use
		 * @param	{Boolean} [wrap=true] Whether to wrap the elements or not. Optional, default is true
		 * @return	The element, or a wrapper around it if wrap is true.
		 * @beta
		 */
		firstBySelector: function(selectors, wrap)
		{
			if (wrap == undefined)
				wrap = true;
			
			// TODO: Polyfill for IE
			var el = this.element.querySelectorAll(selectors);
			return el && (wrap ? DOM.wrap(el) : el);
		},
		
		/**
		 * Get all children by selector. Incomplete as there's not yet full IE support.
		 * @method getBySelector
		 * @param	{String} selectors Selector to use
		 * @param	{Boolean} [wrap=true] Whether to wrap the elements or not. Optional, default is true
		 * @return	{Array of ElementWrapper|Array of HTMLElement} The elements, or wrappers around them if wrap is true.
		 * @beta
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
		 * @method children
		 * @return {Array of ElementWrapper} The children
		 */
		children: function()
		{
			return DOM.wrapAll(this.element.children);
		},
		
		/**
		 * Get the parent element of this element. If a tag name is passed, get the first parent that
		 * matches this tag name, traversing the tree
		 * @method parent
		 * @param	{String} [tagName=null] Name of tag to look for, or null to just get the first ancestor
		 * @return {ElementWrapper} The parent element
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
		 * @method previous
		 * @return {ElementWrapper} The previous element, or null if there's none.
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
		 * @method next
		 * @return {ElementWrapper} The next element, or null if there's none.
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
		 * @method remove
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
		 * @method prependChild
		 * @param	{ElementWrapper|HTMLElement} New element to add
		 * @chainable
		 */
		prependChild: function(newNode)
		{
			if (newNode instanceof ElementWrapper)
				newNode = newNode.element;
			
			this.element.insertBefore(newNode, this.element.firstChild);
			return this;
		},
		
		/**
		 * Clone this element
		 * @method cloneNode
		 * @param  {Boolean} deep Whether to perform a deep clone
		 * @return {ElementWrapper} The cloned node
		 */
		cloneNode: function(deep)
		{
			return new ElementWrapper(this.element.cloneNode(deep));
		},
		
		// Normal DOM method wrappers
		/**
		 * Set the value of the specified attribute
		 * @method setAttribute
		 * @param  {String} attribute Attribute to set
		 * @param  {mixed} value Value to set attribute to
		 * @chainable
		 */
		setAttribute: function(attribute, value)
		{
			this.element.setAttribute(attribute, value);
			return this;
		},
		/**
		 * Get the value of the specified attribute
		 * @method getAttribute
		 * @param  {String} attribute Attribute to get
		 * @return {mixed}  Attribute's value
		 */
		getAttribute: function(attribute)
		{
			return this.element.getAttribute(attribute);
		},
		/**
		 * Append a new child to the end of this element
		 * @method appendChild
		 * @param  {ElementWrapper|HTMLElement} newNode Node to append
		 * @chainable
		 */
		appendChild: function(newNode)
		{
			if (newNode instanceof ElementWrapper)
				newNode = newNode.element;
			
			this.element.appendChild(newNode);
			return this;
		},
		
		/**
		 * Remove the specified child from this element
		 * @method removeChild
		 * @param  {ElementWrapper|HTMLElement} node Child node to remove
		 * @chainable
		 */
		removeChild: function(node)
		{
			if (node instanceof ElementWrapper)
				node = node.element;
			
			this.element.removeChild(node);
			return this;
		}
	}

	if (Browser.ie)
	{
		// Setting innerHTML to empty string doesn't work properly in IE
		// http://www.nczonline.net/blog/2006/11/08/ie-s-innerhtml-problem/
		ElementWrapper.prototype.empty = function()
		{
			while (this.element.hasChildNodes())
				this.element.removeChild(this.element.lastChild);
				
			return this;
		}
	}
	else
	{
		/**
		 * Remove all the children from this element.
		 * @method empty
		 * @chainable
		 */
		ElementWrapper.prototype.empty = function()
		{
			this.element.innerHTML = '';
			return this;
		}
	}

	// Body is used frequently
	DOM.body = DOM.wrap(document.body);
	// Helper function (a la Prototype, MooTools, jQuery, etc.)
	var $ = window.$ = function(el) { return DOM.wrap(el); }

	/**
	 * List containing multiple elements, similar to an array. Allows calling methods like setStyle and
	 * addClass, which automatically call this method on every element in the list. Immutable.
	 * Available methods include:
	 * 
	 * - {{#crossLink "ElementWrapper/addClass"}}{{/crossLink}}
	 * - {{#crossLink "ElementWrapper/remove"}}{{/crossLink}}
	 * - {{#crossLink "ElementWrapper/removeClass"}}{{/crossLink}}
	 * - {{#crossLink "ElementWrapper/set"}}{{/crossLink}}
	 * - {{#crossLink "ElementWrapper/setAttribute"}}{{/crossLink}}
	 * - {{#crossLink "ElementWrapper/setStyle"}}{{/crossLink}}
	 * - {{#crossLink "ElementWrapper/setStyles"}}{{/crossLink}}
	 * 
	 * @class ElementWrapperList
	 * @constructor
	 * @module JSFramework
	 * @submodule DOM
	 */
	function ElementWrapperList(items)
	{
		// Add the items from the passed array
		for (var i = 0, count = items.length; i < count; i++)
			this[i] = DOM.wrap(items[i]);
		
		/**
		 * Number of items in this list
		 * @property length
		 * @type Integer
		 */
		this.length = items.length;
	}

	ElementWrapperList.prototype = {
		/**
		 * Convert this list into a proper array.
		 * @method toArray
		 * @return	{Array}	An array with the same elements as this list
		 */
		toArray: function()
		{
			return Array.prototype.slice.call(this);
		}
	};

	// Add all the functions that would make sense if called on a list of elements
	var toAdd = ['set', 'setAttribute', 'remove', 'addClass', 'removeClass', 'setStyle', 'setStyles'];
	
	for (var i = 0, count = toAdd.length; i < count; i++)
	{
		var func = toAdd[i];
		// Create a wrapper for this function
		ElementWrapperList.prototype[func] = (function(functionName)
		{
			return function()
			{
				for (var i = 0; i < this.length; i++)
				{
					this[i][functionName].apply(this[i], arguments);
				}
				return this;
			}
		})(func);
	}
})(window);