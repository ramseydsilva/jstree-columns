/*
 * http://github.com/ramseydsilva/jstree-columns
 *
 * This plugin handles adds additional columns to your jstree
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'jstree'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    
    $.jstree.defaults.columns = {
	};

	$.jstree.plugins.columns = function(options,parent) {
        
		this.init = function (el,options) { 
			parent.init.call(this,el,options);
		};

		this.bind = function () {
			parent.bind.call(this);
		};
        
	};
    
}));