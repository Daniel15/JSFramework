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
	var Class = window.Class = function(proto, extendThis)
	{
		// Create the class constructor
		//var NewClass = proto.init ? proto.init : function() {};
		function NewClass()
		{				
			if (this.init)
				this.init.apply(this, arguments);
		}
		NewClass.extend = Class.extend;
		
		// If not extending, easy - Just assign the prototype directly
		if (!extendThis)
		{
			NewClass.prototype = proto;
			return NewClass;
		}
		// First create the new class with a copy of the original prototype
		NewClass.prototype = Object.create(extendThis.prototype);
		
		// Add all the new methods to the prototype
		for (var name in proto)
		{
			if (!proto.hasOwnProperty(name))
				continue;
				
			// Does this function already exist on the parent class?
			if (extendThis.prototype[name])
				NewClass.prototype[name] = Class.wrapFn(extendThis.prototype[name], proto[name]);
			else
				// No parent method with the same name, so we can just copy it directly
				NewClass.prototype[name] = proto[name];
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
			return new Class(proto, this);
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
		}
	});
})();
