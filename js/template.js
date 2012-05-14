$(function() {
	
	var Util = Object.create(Object.prototype,  {
		"uvidGenerator" : {
			value : function() {
				var characterSet = "abcdefghijklmnopqrstuvwxyz0123456789";
				var i = 0;
				var uvid = "";
				for(i = 0; i < 16; i++) {
					uvid = uvid + characterSet.charAt(Math.floor((Math.random()*100)+1)%36);
				}
				return uvid;
			}
		}
	});
	
	var V = {};

	V.listView = Backbone.View.extend({

		template:_.template($('#template-js-listview').html()),
		
		itemView:Backbone.View.extend({
		    template:_.template($('#template-js-listviewitem').html()),
		    render:function () {
		        this.setElement(this.template(this.model.elementModel));
		        return this;
		    }
		}),
		
		render:function () {
			var self = this;
			//console.log(this.model);
			var events = Object.create(this.model.elementEvents ? this.model.elementEvents : Object.prototype);
			
			events["click div"] = function (event) {
				//console.log("event clicked", event);
				if(event.target.tagName == "LI") {
					//console.log(self.model.childElements);
			        _.each(self.model.childElements, function (element) {
			        	if(element.elementId == event.target.id) {
			        		element.render($("#template-js-listview-container-" + self.uvid));
			        	} 
			        });
				}
			};
			
			this.delegateEvents(events);
			//console.log(this.model, this);
			
			var templateModel = Object.create(this.model.elementModel ? this.model.elementModel : Object.prototype);
			this.uvid = Util.uvidGenerator();
			templateModel.uvid = this.uvid;
			console.log(templateModel);
	        $(this.el).html(this.template(templateModel));
	        
	        _.each(this.model.childElements, function (element) {
	        	if(!element.elementModel.id) {
	        		element.elementModel.id = element.elementId;
	        	} 
	        	var listViewItem = new self.itemView({model:element}).render();

	        	this.$("#template-js-listview-ul-" + self.uvid).append(listViewItem.el);
	        }, this);
	        
	        this.model.childElements[0].render($("#template-js-listview-container-" + this.uvid));
	    	
	        return this;
	    }
	});
	
	V.tabView = Backbone.View.extend({

		template:_.template($('#template-js-tabview').html()),
		
		itemView:Backbone.View.extend({
		    template:_.template($('#template-js-tabviewitem').html()),
		    render:function () {
		        this.setElement(this.template(this.model.elementModel));
		        return this;
		    }
		}),
		
		render:function () {
			var self = this;
			var events = Object.create(this.model.elementEvents ? this.model.elementEvents : Object.prototype);
			
			events["click div"] = function (event) {
				console.log("tab : event clicked", event);
				if(event.target.tagName == "LI") {
			        _.each(self.model.childElements, function (element) {
			        	if(element.elementId == event.target.id) {
			        		element.render($("#template-js-tabview-container-" + self.uvid));
			        	} 
			        });
				}
			};
			
			this.delegateEvents(events);
			//console.log(this.model, this);
			
			var templateModel = Object.create(this.model.elementModel ? this.model.elementModel : Object.prototype);
			this.uvid = Util.uvidGenerator();
			templateModel.uvid = this.uvid;
			console.log(templateModel);
	        $(this.el).html(this.template(templateModel));
	        
	        _.each(this.model.childElements, function (element) {
	        	if(!element.elementModel.id) {
	        		element.elementModel.id = element.elementId;
	        	} 
	        	var tabViewItem = new self.itemView({model:element}).render();

	        	this.$("#template-js-tabview-ul-" + self.uvid).append(tabViewItem.el);
	        }, this);
	        
	        this.model.childElements[0].render($("#template-js-tabview-container-" + this.uvid));
	    	
	        return this;
	    }
	});

	V.containerView = Backbone.View.extend({

		render:function () {
			var self = this;

			var events = Object.create(this.model.elementEvents ? this.model.elementEvents : Object.prototype);
			
			/*events["click div"] = function (event) {

				if(event.target.tagName == "LI") {
					//console.log(self.model.childElements);
			        _.each(self.model.childElements, function (element) {
			        	if(element.elementId == event.target.id) {
			        		element.render($("#template-js-listview-container-" + self.uvid));
			        	} 
			        });
				}
			};*/
			
			this.delegateEvents(events);
			//console.log(this.model, this);
			var templateModel = Object.create(this.model.elementModel ? this.model.elementModel : Object.prototype);
			this.uvid = Util.uvidGenerator();
			templateModel.uvid = this.uvid;
			
			var template = _.template($('#' + this.model.elementView).html());
	        $(this.el).html(template(templateModel));
	        
	        _.each(this.$('[data-container]'), function (element) {
	        	var $el = self.$("#" + element.id);
	        	if($el.attr("data-container-template")) {
	        		var childViewName = $el.attr("data-container-template");
	        		var foundChild = false;
	        		_.each(self.model.childElements, function(child) {
	        			if(child.elementView == childViewName) {
	        				foundChild = true;
	        				console.log(child);
	        				child.view = new V.containerView({el : $el, model : child }).render();
	        			}
	        		});
	        		if(!foundChild) {
				        $el.append($("#" + $el.attr("data-container-template")).html());
	        		}
	        	}
	        }, this);
	        
	        return this;
	    }
	});	
	
	V.extend = function(propertyObject) {
		var view = Backbone.View.extend({
			template:_.template($("#" + propertyObject.childElementView).html()),
			render:function () {
				var self = this;

				if(this.model.elementModel) {
					this.uvid = Util.uvidGenerator();
					this.model.elementModel.uvid = this.uvid;
				}

				$(this.el).html(this.template(this.model.elementModel));


				var myEvents = Object.create(this.model.elementEvents ? this.model.elementEvents : Object.prototype);
				myEvents["click div"] = function (event) {
					if(event.target.tagName == "LI") {
						//console.log(self.model.childElements);
				        _.each(self.model.childElements, function (element) {
				        	if(element.elementId == event.target.id) {
				        		element.render(self.$('[data-container]'));
				        	} 
				        });
					}
				};
				this.delegateEvents(myEvents);

				var holder = this.$('[data-holder]');
		        var repeater = _.template($("#" + holder.attr("data-repeater-template")).html());

		        _.each(this.model.childElements, function (element) {
		        	if(!element.elementModel.id) {
		        		element.elementModel.id = element.elementId;
		        	} 
		        	holder.append(repeater(element.elementModel));
		        }, this);
		        
		        this.model.childElements[0].render(this.$('[data-container]'));
		    	
		        if(this.options.callerRender) {
		        	return this.options.callerRender(this);
		        }
		        return this;
		    }
		});

		return new view({el : propertyObject.container, model : propertyObject, callerRender : propertyObject.callerRender});
	}

	V.leaf = {};
	
	V.leaf.extend = function(propertyObject) {
		var view = Backbone.View.extend({
			render:function () {
				var self = this;

				if(this.model.elementModel) {
					this.uvid = Util.uvidGenerator();
					this.model.elementModel.uvid = this.uvid;
				}
				
				$(this.el).empty();
				if(this.model.elementView) {
					var template = _.template($("#" + this.model.elementView).html());
					$(this.el).html(template(this.model.elementModel));
				}

		        _.each(this.$('[data-container]'), function (element) {
		        	var $el = self.$("#" + element.id);
		        	if($el.attr("data-container-template")) {
			        	$el.append($("#" + $el.attr("data-container-template")).html());
		        	}
		        }, this);
		        
				this.delegateEvents(this.model.elementEvents);

		        if(this.options.callerRender) {
		        	return this.options.callerRender(this);
		        }
		        return this;
		    }
		});

		return new view({el : propertyObject.container, model : propertyObject, callerRender : propertyObject.callerRender});
	}

	
	var element = Object.create(Object.prototype, {
		"elementController" : {
			value : function () {
				return true;
			}
		},
		"_childElements" : {
			value : [],
			writable : true 
		},
		"childElements" : {
			get : function() {
				return this._childElements;
			},
			set : function (childElements) {
				if(childElements) {
					this._childElements = [];
					var i = 0;
					for(i = 0; i < childElements.length; i++) {
						if(!this.isPrototypeOf(childElements[i])) {
							this._childElements.push(this.extend(childElements[i]));
						} else {
							this._childElements.push(childElements[i]);
						}
					}
				}
			}
		},
		"extend" : {
			value : function(propertyObject) {
				var keys = Object.keys(propertyObject);
				var m = Object.create(element);
				_.extend(m, Backbone.Events);
				
				/** Set the obvious defaults first, later they would get overriden by actual values if any*/
				m.elementType = "leaf";
				m.elementClass = "template-js-default";
				m.elementModel = {};
				m.elementView = "template-js-stubview";
				m.elementId = Math.floor((Math.random()*10000)+1);
				m.childElementView = "template-js-stubview";
				m.childElementClass = "template-js-default";
				m.events = {};

				var j = 0;
				for(j = 0; j < keys.length; j++) {
					m[keys[j]] = propertyObject[keys[j]];
				}
				return m;
			}
		},
		"render" : {
			value : function(jQueryContainerElement) {
				this.container = jQueryContainerElement;
				if(!jQueryContainerElement) {
					this.container = $("<div class=\"template-js-default\"></div>");
				}
				
				if(this.elementType == "node") {
					if(this.childElements.length >= 0) {
						if(this.childElementView == "template-js-listview") {
							new V.listView({el : this.container, model : this }).render();
						} else if(this.childElementView == "template-js-tabview") {
							new V.tabView({el : this.container, model : this }).render();
						} else if(this.childElementView == "template-js-containerview") {
							new V.containerView({el : this.container, model : this }).render();
						} else {
							this.view = V.extend(this).render();
						}
					}
				} else if(this.elementType == "leaf") {
					this.view = V.leaf.extend(this).render();
				}
				
				return this;
			}
		}
	});
	
	
	var a = element.extend({
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
	//$("#container").html(a.render());
});


/*
 * 	V.blockView = Backbone.View.extend({

		template:_.template($('#template-js-tabview').html()),
		
		itemView:Backbone.View.extend({
		    template:_.template($('#template-js-tabviewitem').html()),
		    render:function () {
		        this.setElement(this.template(this.model.elementModel));
		        return this;
		    }
		}),
		
		render:function () {
			var self = this;
			var events = Object.create(this.model.elementEvents ? this.model.elementEvents : Object.prototype);
			
			events["click div"] = function (event) {
				//console.log("event clicked", event);
				if(event.target.tagName == "LI") {
			        _.each(self.model.childElements, function (element) {
			        	if(element.elementId == event.target.id) {
			        		element.render($("#template-js-tabview-container-" + self.uvid));
			        	} 
			        });
				}
			};
			
			this.delegateEvents(events);
			//console.log(this.model, this);
			
			var templateModel = Object.create(this.model.elementModel ? this.model.elementModel : Object.prototype);
			this.uvid = Util.uvidGenerator();
			templateModel.uvid = this.uvid;
			console.log(templateModel);
	        $(this.el).html(this.template(templateModel));
	        
	        _.each(this.model.childElements, function (element) {
	        	if(!element.elementModel.id) {
	        		element.elementModel.id = element.elementId;
	        	} 
	        	var tabViewItem = new self.itemView({model:element}).render();

	        	this.$("#template-js-tabview-ul-" + self.uvid).append(tabViewItem.el);
	        }, this);
	        
	        this.model.childElements[0].render($("#template-js-tabview-container-" + this.uvid));
	    	
	        return this;
	    }
	});

*/
