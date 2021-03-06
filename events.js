/*
 * Daniel15 JavaScript Framework - By Daniel15, 2011
 * http://dl.vc/jsframework
 * Feel free to use any of this, but please link back to my site (dan.cx)
 */

/**
 * Normalises DOM event handling across browsers
 * @class Events
 * @static
 * @module JSFramework
 * @submodule DOM
 */
var Events = (function()
{
	var eventHandling;
	
	// First do the browser-specific stuff
	// W3C
	if (document.addEventListener)
	{
		eventHandling = {
			/**
			 * Add an event handler.
			 * @method add
			 * @param {HTMLElement} obj  Element to add event handler to
			 * @param {String}      type Type of event handler (eg. "click")
			 * @param {Function}    fn   Function that will handle the event
			 * @example
	var el = document.getElementById('blah');
	Events.add(el, 'click', function() { alert('I was clicked!'); });
			 */
			add: function(obj, type, fn)
			{
				obj.addEventListener(type, fn, false);
			},
			/**
			 * Stop this event from propagating or running the default action
			 * @method stop
			 * @param {Event} e The event
			 */
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
		eventHandling = {
			add: function(obj, type, fn)
			{
				/**
				 * @method normalizeEvent
				 * Normalize the event - Convert IE-specific properties into W3C properties. Only used
				 * if the browser is IE
				 * @param {Event} e The event
				 * @return {Event} A modified version of the event
				 * @private
				 */
				function normalizeEvent(e)
				{
					// target - What actually triggered the event
					e.target = e.srcElement;
					// currentTarget - Where the event has bubbled up to (always the object the
					// handler is attached to)
					// Reference: https://developer.mozilla.org/en/DOM/event.currentTarget
					e.currentTarget = obj;
					// Mouse location
					// Reference: http://www.quirksmode.org/js/events_properties.html
					e.pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
					e.pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
					return e;
				}
				
				// TODO: This can't be an anonymous function if we ever want to remove the handler
				obj.attachEvent('on' + type, function()
				{
					fn.call(obj, normalizeEvent(window.event));
				});
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
		 *
		 * @method initPage
		 * @param [id=document.body.id] Page ID
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

/**
 * Event delegation - Attach an event handler to a container element to handle events for inner
 * elements. This has several advantages, including improved performance when a lot of elements are
 * involved (as less event handlers are attached), and not having to attach event handlers to 
 * AJAX-loaded content.
 *
 * @class EventDelegation
 * @static
 * @module JSFramework
 * @submodule DOM
 */
var EventDelegation = 
{
	/**
	 * The current delegates
	 * @property delegates
	 * @type Object
	 * @private
	 */
	delegates: {},
	
	/**
	 * Attach a handler to all tagNames with a class of className, by attaching the event 
	 * listener to containerEl. Works for both current elements, and new elements added in the
	 * future.
	 * @method add
	 * @param	{Element}   containerEl Container element to add event listener to
	 * @param	{String}    type        Type of event listener (eg. "click")
	 * @param	{String}    tagName     Tag name to add events to (eg. "a")
	 * @param	{String}    className   Class name to add events to, or null for none
	 * @param	{Function}  fn          Event handler function
	 * @chainable
	 */
	add: function(containerEl, type, tagName, className, fn)
	{
		// Relies on ElementWrappers being cached, will break if they're not cached any more.
		// This is the internal unique ID, *not* the id in the HTML!
		var id = containerEl.getElementId();
		
		// Check if we have delegates for this element already
		if (!this.delegates[id])
		{
			this.delegates[id] = {};
		}
		
		// Check if we have delegates for this type already
		if (!this.delegates[id][type])
		{
			this.delegates[id][type] = [];
			// Add the handler
			containerEl.addEvent(type, this.handle.bind(this));
		}
		
		this.delegates[id][type].push({tagName: tagName.toUpperCase(), className: className, fn: fn});
		return this;
	},
	
	/**
	 * Handle a delegated event
	 * @method handle
	 * @param	{Event} e Event data
	 * @private
	 */
	handle: function(e)
	{
		var container = $(e.currentTarget);
		var containerId = container.getElementId();
		var target = $(e.target);
		
		// Ensure the element actually has delegates for this event type
		if (!this.delegates[containerId] || !this.delegates[containerId][e.type])
		{
			return;
		}
		
		var delegates = this.delegates[containerId][e.type];
		for (var i = 0, count = delegates.length; i < count; i++)
		{
			var del = delegates[i];
			
			// Check that tag name is the same
			if (target.get('nodeName').toUpperCase() == del.tagName 
			// Check that class name is the same, IF a class name was specified
				&& (!del.className || target.hasClass(del.className)))
			{
				del.fn.call(target, e);
			}
		}
	}
};

// Extend the element wrapper prototype
/**
 * @class ElementWrapper
 */
Util.extend(ElementWrapper.prototype, 
{
	/**
	 * Add an event handler to this element.
	 * @method addEvent
	 * @param	{String}   type Type of event handler (eg. "click")
	 * @param	{Function} fn   Function for handling these events
	 * @chainable
	 */
	addEvent: function(type, fn)
	{
		Events.add(this.element, type, fn);
		return this;
	},
	
	/**
	 * Add a delegated event handler to this element. Attach a handler to all tagNames with a class
	 * of className, by attaching the event listener to "this" element. Works for both current 
	 * elements, and new elements added in the future.
	 * @method addDelegate
	 * @param	{String} type      Type of event listener (eg. "click")
	 * @param	{String} tagName   Tag name to add events to (eg. "a")
	 * @param	{String} className Class name to add events to, or null for none
	 * @param	{String} fn        Event handler function
	 * @chainable
	 */
	addDelegate: function(type, tagName, className, fn)
	{
		EventDelegation.add(this, type, tagName, className, fn);
		return this;
	}
});

// Extend the window
/**
 * Add an event handler to the window
 * @param	Type of event handler (eg. "click")
 * @param	Function for handling these events
 */
window.addEvent = function(type, fn)
{
	Events.add(window, type, fn);
}
