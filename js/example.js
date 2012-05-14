$(function() {
	
	template.js(function() {
	
	var a = templatejs.model.extend({
		"elementType" : "node",
		"childElementView" : "template-js-tabview",
		"elementEvents" : {
			"click" : function(event) {
				console.log("click detected in model");
			}
		},
		"childElements" : [ {
			"elementId" : "1",
			"elementModel" : { "title" : "One" },
			"childElementView" : "my-listview",
			"elementType" : "node",
			"callerRender" : function(view) {
				console.log("WooHoo", view);
			},
			"elementEvents" : {
				"click" : function(event) {
					console.log("click detected in model 2");
					event.preventDefault();
				}
			},
			"childElements" : [ { 
				"elementId" : "11",
				"elementModel" : { "title" : "OneOne" },
				"childElementView" : "template-js-tabview",
				"elementType" : "node",
				"childElements" : [ { 
					"elementId" : "111",
					"elementModel" : { "title" : "OneOneOne" },
					"elementView" : "my-element-view",
					"childElementView" : "template-js-containerview",
					"elementType" : "node",
					"childElements" : [{ 
						"elementId" : "1111",
						"elementView" : "my-inner-element-view",
						"elementModel" : { "title" : "OneOneOneOne" }
					},{ 
						"elementId" : "1112",
						"elementView" : "my-inner2-element-view",
						"elementModel" : { "title" : "OneOneOneTwo" }
					}]
				} , { 
					"elementId" : "112",
					"elementModel" : { "title" : "OneOneTwo" }
				} ]
			} , { 
				"elementId" : "12",
				"elementModel" : { "title" : "OneTwo" }
			} ]
		}, {
			"elementId" : "2",
			"elementModel" : { "title" : "Two" }
		}, {
			"elementId" : "3",
			"elementModel" : { "title" : "Three" }
		}, {
			"elementId" : "4",
			"elementModel" : { "title" : "Four" }
		}, {
			"elementId" : "5",
			"elementModel" : { "title" : "Five" }
		}, {
			"elementId" : "6",
			"elementModel" : { "title" : "Six" }
		} ]
	});
	
	a.render($("#container"));
	
	});
});
