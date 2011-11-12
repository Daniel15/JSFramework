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
		// Modified to set target using srcElement
		eventHandling = {
			add: function(obj, type, fn)
			{
				obj['e'+type+fn] = fn;
				obj[type+fn] = function()
				{
					var e = window.event;
					e.target = e.srcElement;
					obj['e'+type+fn](e);
				}
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

var EventDelegation = 
{
	delegates: {},
	/**
	 * Attach a handler to all tagNames with a class of className, by attaching the event 
	 * listener to containerEl. Works for both current elements, and new elements added in the
	 * future.
	 * @param	Element		Container element to add event listener to
	 * @param	String		Type of event listener (eg. "click")
	 * @param	String		Tag name to add events to (eg. "a")
	 * @param	String		Class name to add events to, or null for none
	 * @param	String		Event handler function
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
	},
	
	/**
	 * Handle a delegated event
	 * @param	Event data
	 */
	handle: function(e)
	{
		// TODO: Handle IE6-8 which don't support currentTarget
		var container = $(e.currentTarget);
		var containerId = container.getElementId();
		var target = $(e.target);
		
		if (!this.delegates[containerId] || !this.delegates[containerId][e.type])
		{
			// TODO: Remove this debug message
			alert('Couldn\'t find delegate for ' + container.getElementId());
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
Util.extend(ElementWrapper.prototype, 
{
	/**
	 * Add an event handler to this element.
	 * @param	Type of event handler (eg. "click")
	 * @param	Function for handling these events
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
	 * @param	String		Type of event listener (eg. "click")
	 * @param	String		Tag name to add events to (eg. "a")
	 * @param	String		Class name to add events to, or null for none
	 * @param	String		Event handler function
	 */
	addDelegate: function(type, tagName, className, fn)
	{
		EventDelegation.add(this, type, tagName, className, fn);
		return this;
	}
});