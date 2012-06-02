/**
 * Daniel15 JavaScript Framework - By Daniel15, 2012
 * http://dl.vc/jsframework
 * Feel free to use any of this, but please link back to my site (dan.cx)
 */
 
(function()
{
	/**
	 * Create a new class instance
	 * @class Class
	 * @constructor
	 * @module JSFramework
	 * @submodule Class
	 * @param	{Object} Functions to add to the class
	 * @return	{Class}  Class instance
	 * @example
	// Creation
	var Person = new Class(
	{
		init: function(name)
		{
			this.name = name;
		},
		helloWorld: function()
		{
			return 'Hello';
		},
		helloWorld2: function()
		{
			return 'Hello2';
		}
	});
	
	// Instantiation
	var me = new Person('Daniel');
	console.log('me.name = ', me.name); // Daniel
	console.log('me.helloWorld() = ', me.helloWorld()); // Hello
	console.log('me.helloWorld2() = ', me.helloWorld2()); // Hello2
	console.log('me instanceof Person = ', me instanceof Person); // true
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
		 * @method extend
		 * @param	{Object} proto Prototype methods of new class
		 * @return	{Class} Class instance
		 * @example
	// Base class
	var Person = new Class(
	{
		init: function(name)
		{
			this.name = name;
		},
		helloWorld: function()
		{
			return 'Hello';
		},
		helloWorld2: function()
		{
			return 'Hello2';
		}
	});
	
	// Class that inherits from base
	var Ninja = Person.extend(
	{
		helloWorld2: function()
		{
		    return 'Ninja helloWorld2, original = ' + this.parent();
		},
		helloWorld3: function()
		{
		    return 'Ninja helloWorld3';
		}
	});

	var awesome2 = new Ninja('Awesome');
	console.log('awesome2.name = ', awesome2.name); // Awesome
	console.log('awesome2.helloWorld() = ', awesome2.helloWorld()); // Hello
	console.log('awesome2.helloWorld2() = ', awesome2.helloWorld2()); // Ninja helloWorld2, original = Hello2
	console.log('awesome2.helloWorld3() = ', awesome2.helloWorld3()); // Ninja helloWorld3
	console.log('awesome2 instanceof Ninja = ', awesome2 instanceof Ninja); // true
	console.log('awesome2 instanceof Person = ', awesome2 instanceof Person); // true
		 */
		extend: function(proto)
		{
			proto.Extends = this;
			return new Class(proto);
		},
		/**
		 * Create a wrapper for this function. This wrapper saves the parent function into .parent 
		 * (so it can be called from the overriding function) before calling the overriden function.
		 * @method wrapFn
		 * @param	{Function} superFn Function on the superclass
		 * @param	{Function} fn      Function on the overriding class
		 * @return	{Function} Function that saves superFn to .parent, runs fn, then unsets parent
		 * @private
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
		 * @method mixin
		 * @param	{Object} source Object containing functions to add
		 * @param	{Object} destination Object whose prototype will receive the new functions
		 * @private
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
