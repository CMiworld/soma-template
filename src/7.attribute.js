var Attribute = function(name, value, node, data) {
	this.name = name;
	this.value = value;
	this.node = node;
	this.interpolationName = new Interpolation(this.name, null, this);
	this.interpolationValue = new Interpolation(this.value, null, this);
	this.invalidate = false;
};
Attribute.prototype = {
	toString: function() {
		return '[object Attribute]';
	},
	dispose: function() {
		if (this.interpolationName) this.interpolationName.dispose();
		if (this.interpolationValue) this.interpolationValue.dispose();
		this.interpolationName = null;
		this.interpolationValue = null;
		this.name = null;
		this.value = null;
		this.node = null;
	},
	update: function() {
		this.interpolationName.update();
		this.interpolationValue.update();
	},
	render: function() {
		if (this.node.repeater) return;
		var element = this.node.element;
		if (this.invalidate) {
			this.invalidate = false;
			this.name = this.interpolationName.render() || this.name;
			this.value = this.interpolationValue.render() || this.value;
			if (this.name === attributes.src) {
				renderSrc(this.name, this.value);
			}
			else if (this.name === attributes.href) {
				renderHref(this.name, this.value);
			}
			else {
				this.node.element.removeAttribute(this.interpolationName.value);
				renderAttribute(this.name, this.value);
			}
		}
		// cloak
		if (this.name === 'class' && this.value.indexOf(settings.attributes.cloak) !== -1) {
			removeClass(this.node.element, settings.attributes.cloak);
		}
		// hide
		if (this.name === attributes.hide) {
			element.style.display = (!isDefined(this.value) || this.value === "" || this.value === true || this.value === "true") ? "none" : "block";
		}
		// show
		if (this.name === attributes.show) {
			element.style.display = (!isDefined(this.value) || this.value === "" || this.value === true || this.value === "true") ? "block" : "none";
		}
		// normal attribute
		function renderAttribute(name, value) {
			if (name == "class") {
				element.className = value;
			}
			else {
				element.setAttribute(name, value);
			}
		}
		// src attribute
		function renderSrc(name, value) {
			element.setAttribute('src', value);
		}
		// href attribute
		function renderHref(name, value) {
			element.setAttribute('href', value);
		}
	}
};