/**
 * Daniel15 JavaScript Framework - By Daniel15, 2011
 * http://dl.vc/jsframework
 * Feel free to use any of this, but please link back to my site (dan.cx)
 */

// Based off Simple JavaScript Templating by John Resig
// http://ejohn.org/blog/javascript-micro-templating/
var Template = 
{
	/**
	 * Cache of all parsed templates
	 */
	cache: {},
	
	/**
	 * Get a template
	 * @param	Name of the template
	 * @param	(optional) Data to use in the template.
	 * @return	If data is specified, call template with data and return its HTML. If data is not
	 *          specified, return the template itself.
	 */
	get: function(name, data)
	{
		// Get template either from cache, or parse it (if not in cache)
		var tmpl = this.cache[name] || this.parse(name, document.getElementById(name).innerHTML);
		
		// If data was passed, use it in the template
		// Otherwise, just return the template itself
		return data ? tmpl(data) : tmpl;
	},
	
	/**
	 * Parse a template, returning a JavaScript function to execute it. Also caches the template in
	 * case it's used later
	 * @param	Name of the template, used to cache it
	 * @param	Template code
	 * @return	JavaScript function for executing the template
	 */
	parse: function(name, tmpl)
	{
		// Generate a reusable function that will serve as a template
		// generator (and which will be cached).
		var fn = new Function("obj",
			"var p=[];" +
         
			// Introduce the data as local variables using with(){}
			"with(obj){p.push('" +
         
			// Convert the template into pure JavaScript
			tmpl
				.replace(/[\r\t\n]/g, " ")
				.split("<%").join("\t")
				.replace(/((^|%>)[^\t]*)'/g, "$1\r")
				.replace(/\t=(.*?)%>/g, "',$1,'")
				.split("\t").join("');")
				.split("%>").join("p.push('")
				.split("\r").join("\\'")
			+ "');}return p.join('');");

		return this.cache[name] = fn;
	}
};