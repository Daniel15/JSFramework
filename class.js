/**
 * Daniel15 JavaScript Framework - By Daniel15, 2012
 * http://dl.vc/jsframework
 * Feel free to use any of this, but please link back to my site (dan.cx)
 */
 
(function()
{
	/**
	 * Create a new class instance
	 * @param	Object		Functions to add to the class
	 * @param	Class		Class to extend, if any
	 * @return	Class instance
	 */
	var Class = window.Class = function(proto)
	{
		// Create the class constructor
		function NewClass()
		{				
			if (this.init)
				this.init.apply(this, arguments);
		}
		// Add some helpful functions
		NewClass.extend = Class.extend;
		
		// If not extending, easy - Just assign the prototype directly
		if (!proto.Extends)
		{
			NewClass.prototype = proto;
		}
		else
		{
			// Create the new class with a copy of the original prototype
			NewClass.prototype = Object.create(proto.Extends.prototype);
			// Add all new functions onto the new class
			Class.mixin(proto, NewClass);
		}
		
		return NewClass;
	};
	
	// Add useful functions to the Class object
	Util.extend(Class, 
	{
		/**
		 * Extend the current class. Expected to be called in the context of an existing class.
		 * @param	Object		Prototype methods of new class
		 * @return	Class instance
		 */
		extend: function(proto)
		{
			proto.Extends = this;
			return new Class(proto);
		},
		/**
		 * Create a wrapper for this function. This wrapper saves the parent function into .parent 
		 * (so it can be called from the overriding function) before calling the overriden function.
		 * @param	Function	Function on the superclass
		 * @param	Function	Function on the overriding class
		 * @return	Function
		 */
		wrapFn: function(superFn, fn)
		{
			return function()
			{
				// Save the current parent method
				var tmp = this.parent;
				this.parent = superFn;
				
				var ret = fn.apply(this, arguments);
				
				// Restore whatever was in .parent before
				this.parent = tmp;
				return ret;
			};
		},
		/**
		 * Copy functions from the source to the destination prototype. If functions already exist 
		 * on the destination, a wrapper will be created that saves the old method into the .parent()
		 * method at runtime.
		 * @param	Object		Source - Object containing functions to add
		 * @param	Object		Destination - Object whose prototype will receive the new functions
		 */
		mixin: function(source, destination)
		{
			for (var name in source)
			{
				if (!source.hasOwnProperty(name))
					continue;
				
				// Does this function already exist on the parent class?
				if (destination.prototype[name] && typeof(destination.prototype[name]) == 'function')
					destination.prototype[name] = Class.wrapFn(destination.prototype[name], source[name]);
				else
					// No parent method with the same name, so we can just copy it directly
					destination.prototype[name] = source[name];
			}
		}
	});
})();
