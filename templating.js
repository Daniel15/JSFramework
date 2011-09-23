/**
 * Daniel15 JavaScript Framework - By Daniel15, 2011
 * http://dl.vc/jsframework
 * Feel free to use any of this, but please link back to my site (dan.cx)
 */

// Based off Simple JavaScript Templating by John Resig
// http://ejohn.org/blog/javascript-micro-templating/
/*
(function(){
   var cache = {};
   
   this.tmpl = function tmpl(str, data){

   };
 })();*/
var Template = 
{
	cache: {},
	get: function(str, data)
	{
		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.		
		var fn = !/\W/.test(str) ?
			this.cache[str] = this.cache[str] ||
			this.get(document.getElementById(str).innerHTML) :
       
		// Generate a reusable function that will serve as a template
		// generator (and which will be cached).
		new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};" +
         
			// Introduce the data as local variables using with(){}
			"with(obj){p.push('" +
         
			// Convert the template into pure JavaScript
			str
				.replace(/[\r\t\n]/g, " ")
				.split("<%").join("\t")
				.replace(/((^|%>)[^\t]*)'/g, "$1\r")
				.replace(/\t=(.*?)%>/g, "',$1,'")
				.split("\t").join("');")
				.split("%>").join("p.push('")
				.split("\r").join("\\'")
			+ "');}return p.join('');");
     
		// Provide some basic currying to the user
		return data ? fn( data ) : fn;
	}
};