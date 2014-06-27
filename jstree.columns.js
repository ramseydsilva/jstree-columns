/*
 * http://github.com/ramseydsilva/jstree-columns
 *
 * This plugin handles adds additional columns to your jstree
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 * 
 * Author Ramsey D'silva (ramseydsilva.com)
 *
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'jstree'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    
    var _triggerSelect = true;
	
    $.jstree.defaults.columns = {};

	$.jstree.plugins.columns = function(options,parent) {
        
        var getNodeName = function(toReplace, mainInstance, newInstance) {
			if (typeof toReplace == "string") {
				return toReplace.replace('j'+mainInstance._id+'_', 'j'+newInstance._id+'_');
			} else if (Object.prototype.toString.call( toReplace ) === '[object Array]') {
				for(var i=0; i<toReplace.length; i++) {
					toReplace[i] = getNodeName(toReplace[i], mainInstance, newInstance);
				}
				return toReplace;
			} else {
				return toReplace;
			}
		}
		
		var replaceKeyValues = function(object, key, mainInstance, newInstance, textKey) {
			var newKey = getNodeName(key, mainInstance, newInstance); // replace key
			if (newKey != key) {
				object[newKey] = object[key]; // copy data into new key				
				delete object[key];
			} else {
				newKey = key;
			}
			if (newKey == "text") {
				object[newKey] = object.data ? object.data[textKey] : "";
			}
			
			object[newKey] = getNodeName(object[newKey], mainInstance, newInstance); // replace value of the key
			return newKey;
		}
		
		var generateDataModel = function(object, mainInstance, newInstance, textKey) {
			for (var key in object) {
				if (object.hasOwnProperty(key)) {
					var newKey = replaceKeyValues(object, key, mainInstance, newInstance, textKey);
					if (newKey.indexOf('data') != -1 || newKey.indexOf("#") != -1 || newKey.indexOf("j"+newInstance._id+"_") != -1
						|| newKey.indexOf("children") != -1 || newKey.indexOf("parent") != -1)
						generateDataModel(object[newKey], mainInstance, newInstance, textKey);
				}
			}			
		}
		
		var redraw = function(mainInstance, newInstance, textKey) {
			var _model = $.extend(true, {}, mainInstance._model);
			generateDataModel(_model, mainInstance, newInstance, textKey);
			newInstance._model = _model;
			newInstance.redraw(true);			
		}
		
		var redrawParent = function(parentNode, mainInstance, newInstance, textKey) {
			var _model = $.extend(true, {}, mainInstance._model);
			generateDataModel(_model, mainInstance, newInstance, textKey);
			newInstance._model = _model;
			newInstance.redraw_node(parentNode);					
		}
		
		var getNode = function(node, mainInstance, newInstance) {
			return newInstance.get_node(getNodeName(node.id, mainInstance, newInstance));
		}
		
        var bind = function(column) {
			var mainInstance = this;
			var instance = column.instance;
			var textKey = column.key;
			
			mainInstance.element
				.on("open_node.jstree", function(e, data) {
					var node = getNode(data.node, mainInstance, instance);
					redrawParent(node, mainInstance, instance, textKey);
				})
				.on("close_node.jstree", function(e, data) {
					var node = getNode(data.node, mainInstance, instance);				
					instance.close_node(node);
				})
				.on("delete_node.jstree", function(e, data) {
					redraw(mainInstance, instance, textKey);	
				})
				.on("move_node.jstree", function(e, data) {
					redraw(mainInstance, instance, textKey);
				})
				.on("model.jstree", function(e, args) {										
					redraw(mainInstance, instance, textKey);
				});
				
			instance.element
				.on("rename_node.jstree", function(e, args) {
					var node = getNode(args.node, instance, mainInstance);
					node.data[textKey] = instance.get_text(args.node);
				}).on("click", function(e) {
					e.preventDefault();
					return false;
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
			parent.init.call(this, el, options);
			initialize.call(this, el, options);
		};

	};
    
}));
