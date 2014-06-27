JSTree Columns Plugin
=====================

Overview
--------

Plugin for [jstree](jstree) to allow multiple column layout.

Prerequisites
-------------

* [Jquery](jquery)
* [JStree](jstree)
* [Twitter bootstrap](bootstrap) (optional) but recommended


Screenshot
----------

![Screenshot](screenshot.png?raw=true "Js Columns Screenshot")


Concept
-------

This plugin works by creating simultaneous trees for each additional column, while sharing the data model of the original tree. This allows a clean layout whereby you can manage any additional columns as its own individual tree, style it appropriately, use all the other jstree features out of the box.

Usage
-----

If you want 2 additional columns, layout your html like so:

```
    <div class="panel-body row">
        <div class="col-md-6 mainTree">&nbsp;</div>
        <div class="col-md-3 jstree-column column1Tree hidden-sm hidden-xs">&nbsp;</div>
        <div class="col-md-3 jstree-column column2Tree hidden-sm hidden-xs">&nbsp;</div>
    </div>
```

Include jstree.columns.js in your javascript stack. Instantiate trees for your additional columns seperately and include them in your columns settings for your main tree. Ensure that you lspecify data attributes for additional columns in the JSON for each node in your main tree. Your javascript will look something like this:

```
    var column1Tree = $('.column1Tree').jstree({
        contextmenu: { ... } // use seperate contextmenu plugin for column1 if you wish
        plugins: [ 'contextmenu' ]
    });
    
    var column2Tree = $('.column2Tree').jstree();
    
    var getNodeJSON = function(model) {
        return {
            text: model.get("name"),
            data: {
                column1text: model.get("column1value"),
                column2text: model.get("column2value")
            }
        }
    }
    
    var mainTree = $('.mainTree').jstree({
    
        core: {
            animation: 0,
            data: getNodeJSON,
            multiple: true
        },
        
        contextmenu: { ... } // use contextmenu plugin if you wish
        search: { ... } // use search plugin if you wish
        
        columns: [
            { title: "Column 1 Title", key: "column1text", tree: column1Tree },
            { title: "Column 2 Title", key: "column2text", tree: column2Tree }
        ],
        
        plugins: [ 'contextmenu', 'search', 'columns' ] // include columns plugin
        
    });
    
```

Use styling to hide unnecessary tree stuff from columns (ex: icons, tree structure, list padding etc.)

```
.jstree-column.jstree-default .jstree-node {
    background-image: none !important;
}

.jstree-column i {
    display: none;
}
```

Feel free to report any [issues].

***

[jquery]: http://jquery.com
[jstree]: http://jstree.com
[bootstrap]: http://getbootstrap.com
[issues]: https://github.com/ramseydsilva/jstree-columns/issues




