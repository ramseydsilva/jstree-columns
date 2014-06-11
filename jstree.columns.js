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
        
        var getNew = function(toReplace, oldInstance, newInstance) {
			if (typeof toReplace == "string") {
				return toReplace.replace('j'+oldInstance._id+'_', 'j'+newInstance._id+'_');
			} else if (Object.prototype.toString.call( toReplace ) === '[object Array]') {
				for(var i=0; i<toReplace.length; i++) {
					toReplace[i] = getNew(toReplace[i], oldInstance, newInstance);
				}
				return toReplace;
			} else {
				return toReplace;
			}
		}
		
		var replaceKeyValues = function(object, key, oldInstance, newInstance, textKey) {
			var newKey = getNew(key, oldInstance, newInstance); // replace key
			if (newKey != key) {
				object[newKey] = object[key]; // copy data into new key				
				delete object[key];
			} else {
				newKey = key;
			}
			if (newKey == "text") {
				object[newKey] = object.data[textKey];
			}
			
			object[newKey] = getNew(object[newKey], oldInstance, newInstance); // replace value of the key
			return newKey;
		}
		
		var generateDataModel = function(object, oldInstance, newInstance, textKey) {
			for (var key in object) {
				if (object.hasOwnProperty(key)) {
					var newKey = replaceKeyValues(object, key, oldInstance, newInstance, textKey);
					if (newKey.indexOf("#") != -1 || newKey.indexOf("j"+newInstance._id+"_") != -1
						|| newKey.indexOf("children") != -1 || newKey.indexOf("parent") != -1)
						generateDataModel(object[newKey], oldInstance, newInstance, textKey);
				}
			}			
		}
		
        var bind = function(column) {
			var that = this;
			var instance = column.instance;
			var data = instance._model.data;
			var textKey = column.key;
			
			this.element
				.on("redraw.jstree", function (e, data) {
					console.log("redraw", column.title, "as well");
					instance.redraw(true);
				})
				.on("model.jstree", function(e, args) {					
					data = $.extend(true, {}, that._model.data);
					generateDataModel(data, that, instance, textKey);
					instance._model.data = data;
					console.log(data);
				});
		};
		
        var initialize = function(el, options) {
			for(var i=0; i < this.settings.columns.length; i++) {
				var tree = this.settings.columns[i].tree;
				if (typeof tree.on != "function") {
					tree = tree.element;
				}
				this.settings.columns[i].instance = $.jstree.reference(tree);	
				var column = this.settings.columns[i];
				bind.call(this, column);
			};	
		};
		
		this.init = function (el,options) { 
			parent.init.call(this,el,options);
			initialize.call(this, el, options);
		};

	};
    
}));