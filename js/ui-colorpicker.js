'use strict';

(function ($) {
	var tpl =
			'<div class="container">' +
				'<div class="select-color"><div><div></div></div></div>' +
				'<div class="hue"></div>' +
				'<div class="preview">' +
					'<div class="new"></div>' +
					'<div class="current"></div>' +
				'</div>' +
				'<div class="field rgb r "><input type="text" maxlength="3" size="3"></div>' +
				'<div class="field hsb h"><input type="text" maxlength="3" size="3"></div>' +
				'<div class="field rgb g"><input type="text" maxlength="3" size="3"></div>' +
				'<div class="field hsb s"><input type="text" maxlength="3" size="3"></div>' +
				'<div class="field rgb b"><input type="text" maxlength="3" size="3"></div>' +
				'<div class="field hsb b"><input type="text" maxlength="3" size="3"></div>' +
				'<div class="opacity"><div></div></div>' +
				'<div class="field hex"><input type="text" maxlength="6"></div>' +
				'<div class="submit"><i class="material-icons md-18">invert_colors</i></div>' +
			'</div>',
		HexToRGB = function (hex) {
			hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
			return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
		},
		HexToHSB = function (hex) {
			return RGBToHSB(HexToRGB(hex));
		},
		RGBToHSB = function (rgb) {
			var hsb = {
				h: 0,
				s: 0,
				b: 0
			};
			var min = Math.min(rgb.r, rgb.g, rgb.b);
			var max = Math.max(rgb.r, rgb.g, rgb.b);
			var delta = max - min;
			hsb.b = max;
			if (max != 0) {

			}
			hsb.s = max != 0 ? 255 * delta / max : 0;
			if (hsb.s != 0) {
				if (rgb.r == max) {
					hsb.h = (rgb.g - rgb.b) / delta;
				} else if (rgb.g == max) {
					hsb.h = 2 + (rgb.b - rgb.r) / delta;
				} else {
					hsb.h = 4 + (rgb.r - rgb.g) / delta;
				}
			} else {
				hsb.h = -1;
			}
			hsb.h *= 60;
			if (hsb.h < 0) {
				hsb.h += 360;
			}
			hsb.s *= 100/255;
			hsb.b *= 100/255;
			return hsb;
		},
		HSBToRGB = function (hsb) {
			var rgb = {};
			var h = Math.round(hsb.h);
			var s = Math.round(hsb.s*255/100);
			var v = Math.round(hsb.b*255/100);
			if(s == 0) {
				rgb.r = rgb.g = rgb.b = v;
			} else {
				var t1 = v;
				var t2 = (255-s)*v/255;
				var t3 = (t1-t2)*(h%60)/60;
				if(h==360) h = 0;
				if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
				else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
				else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
				else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
				else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
				else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
				else {rgb.r=0; rgb.g=0;	rgb.b=0}
			}
			return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
		},
		RGBToHex = function (rgb) {
			var hex = [
				rgb.r.toString(16),
				rgb.g.toString(16),
				rgb.b.toString(16)
			];
			$.each(hex, function (nr, val) {
				if (val.length == 1) {
					hex[nr] = '0' + val;
				}
			});
			return hex.join('');
		},
		HSBToHex = function (hsb) {
			return RGBToHex(HSBToRGB(hsb));
		};


	var init = function (parent, options) {
		parent.data('colorpicker', this);

		this.hsb = {
			start: {
				h: 0,
				s: 100,
				b: 100
			},
			current: {
				h: 0,
				s: 100,
				b: 100
			},
			new: {
				h: 0,
				s: 100,
				b: 100
			}
		};

		this.opacity = {
			start: 1,
			current: 1,
			new: 1
		};

		parent.uidropdown({
            caller: parent,
			container: $(tpl).appendTo(parent),
			open: options && options.open ? options.open : false,
			close: options && options.close ? options.close : false,
			openEffect: options && options.openEffect ? options.openEffect : false,
			closeEffect: options && options.closeEffect ? options.closeEffect : false
		});
		this.dropdown = parent.data('dropdown');
		parent.removeData('dropdown');

		var cp = this.dropdown.container;
		this.ui = {
			select: {
				color: cp.find('.select-color'),
				picker: cp.find('.select-color > div > div')
			},
			hue: cp.children('.hue'),
			opacity: cp.find('.opacity > div'),
			fields: {
				rgb: {
					r: cp.find('.field.rgb.r > input'),
					g: cp.find('.field.rgb.g > input'),
					b: cp.find('.field.rgb.b > input')
				},
				hsb: {
					h: cp.find('.field.hsb.h > input'),
					s: cp.find('.field.hsb.s > input'),
					b: cp.find('.field.hsb.b > input')
				},
				hex: cp.find('.field.hex > input')
			},
			preview: {
				new: cp.find('.preview > .new'),
				current: cp.find('.preview > .current')
			},
			submit: cp.children('.submit')
		};

		if (options) {
			if (options.color) this.setColor(options.color);
			if (options.start) parent.on('colorchangestart', options.start);
			if (options.stop) parent.on('colorchangestop', options.stop);
			if (options.change) parent.on('change', options.change);
		}

		parent
			.on('open', function () {
				parent.trigger('colorchangestart', [this.getUi()])
			}.bind(this))
			.on('close', function () {
				parent.trigger('colorchangestop', [this.getUi()])
			}.bind(this))
			.on('colorchangestart', function () {
				this.hsb.start.h = this.hsb.current.h = this.hsb.new.h;
				this.hsb.start.s = this.hsb.current.h = this.hsb.new.s;
				this.hsb.start.b = this.hsb.current.h = this.hsb.new.b;

				this.opacity.start = this.opacity.current = this.opacity.new;
			}.bind(this));

		cp.find('.select-color > div').draggable({
			containment: cp.find('.select-color > div'),
			containmentFor: 'cursor',
			draggable: this.ui.select.picker,
			drag: function (e, ui) {
				var outer = {
					height: this.ui.select.color.outerHeight(),
					width: this.ui.select.color.outerWidth()
				};

				this.hsb.new.s = ui.position.left / outer.width * 100;
				this.hsb.new.b = (outer.height - ui.position.top) / outer.height * 100;

				this.setOpacityColor();
				this.setPreviewNew();
				this.ui.fields.hsb.s.val(this.hsb.new.s);
				this.ui.fields.hsb.b.val(this.hsb.new.b);
				this.setFildsRGB(this.hsb.new);
				this.setFildsHex();

				parent.trigger('change', [this.getUi()]);
			}.bind(this)
		});

		this.ui.hue.slider({
			orientation: 'vertical',
			max: 360,
			slide: function (e, ui) {
				this.hsb.new.h = ui.value;
				this.ui.select.color.css('backgroundColor', '#' + HSBToHex({h: this.hsb.new.h, s: 100, b: 100}));

				this.setOpacityColor();
				this.setPreviewNew();
				this.ui.fields.hsb.h.val(this.hsb.new.h);
				this.setFildsRGB(this.hsb.new);
				this.setFildsHex();

				parent.trigger('change', [this.getUi()]);
			}.bind(this)
		});

		this.ui.opacity.slider({
			max: 1000,
			value: 1000,
			slide: function (e, ui) {
				this.opacity.new = ui.value / 1000;
				this.setOpacityColor();
				this.setPreviewNew();
				this.setFildsHex();

				parent.trigger('change', [this.getUi()]);
			}.bind(this)
		});

		cp.find('.field.rgb > input').on('input', function () {
			this.hsb.new = RGBToHSB({
				r: this.ui.fields.rgb.r.val(),
				g: this.ui.fields.rgb.g.val(),
				b: this.ui.fields.rgb.b.val()
			});

			this.setH();
			this.setS();
			this.setB();
			this.setOpacityColor();
			this.setPreviewNew();
			this.setFildsHex();

			parent.trigger('change', [this.getUi()]);
		}.bind(this));

		this.ui.fields.hsb.h.on('input', function () {
			this.hsb.new.h = this.ui.fields.hsb.h.val();

			this.setH();
			this.setOpacityColor();
			this.setPreviewNew();
			this.setFildsRGB();
			this.setPreviewNew();

			parent.trigger('change', [this.getUi()]);
		}.bind(this));

		this.ui.fields.hsb.s.on('input', function () {
			this.hsb.new.s = this.ui.fields.hsb.s.val();

			this.setS();
			this.setOpacityColor();
			this.setPreviewNew();
			this.setFildsRGB();
			this.setPreviewNew();

			parent.trigger('change', [this.getUi()]);
		}.bind(this));

		this.ui.fields.hsb.b.on('input', function () {
			this.hsb.new.b = this.ui.fields.hsb.b.val();

			this.setB();
			this.setOpacityColor();
			this.setPreviewNew();
			this.setFildsRGB();
			this.setPreviewNew();

			parent.trigger('change', [this.getUi()]);
		}.bind(this));

		this.ui.fields.hex.on('input', function (e) {
			this.hsb.new = HexToHSB( this.ui.fields.hex.val() );

			this.setH();
			this.setS();
			this.setB();
			this.setPreviewCurrent();
			this.setPreviewNew();
			this.setFildsHSB();
			this.setFildsRGB();

			parent.trigger('change', [this.getUi()]);
		}.bind(this));

		this.ui.preview.current.click(function(){
			this.setColor( this.ui.preview.current.css('backgroundColor'));

			this.setH();
			this.setS();
			this.setB();
			this.setOpacity();
			this.setOpacityColor();
			this.setPreviewNew();
			this.setFildsHSB();
			this.setFildsRGB();
			this.setFildsHex();

			parent.trigger('change', [this.getUi()]);
		}.bind(this));

		this.ui.submit.click(function(){
			this.setPreviewCurrent();
		}.bind(this));

		this.setH();
		this.setS();
		this.setB();
		this.setOpacity();
		this.setOpacityColor();
		this.setPreviewCurrent();
		this.setPreviewNew();
		this.setFildsHSB();
		this.setFildsRGB();
		this.setFildsHex();
	};



	init.prototype = {
		setH: function () {
			this.ui.hue.slider('value', this.hsb.new.h);
			this.ui.select.color.css('backgroundColor', '#' + HSBToHex({h: this.hsb.new.h, s: 100, b: 100}));
			this.ui.fields.hsb.h.val(this.hsb.h);
		},
		setS: function () {
			this.ui.select.picker.css('left',  this.hsb.new.s / 100 * 150);
		},
		setB: function () {
			this.ui.select.picker.css('top', (100 - this.hsb.new.b) / 100 * 150);
		},

		setPreviewCurrent: function () {
			this.hsb.current.h = this.hsb.new.h;
			this.hsb.current.s = this.hsb.new.s;
			this.hsb.current.b = this.hsb.new.b;
			this.opacity.current = this.opacity.new;

			var rgb = HSBToRGB(this.hsb.current);
			this.ui.preview.current.css('backgroundColor', 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + this.opacity.current + ')')
		},
		setPreviewNew: function () {
			var rgb = HSBToRGB(this.hsb.new);
			this.ui.preview.new.css('backgroundColor', 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + this.opacity.new + ')')
		},
		setFildsRGB: function () {
			var rgb = HSBToRGB(this.hsb.new);
			this.ui.fields.rgb.r.val(rgb.r);
			this.ui.fields.rgb.g.val(rgb.g);
			this.ui.fields.rgb.b.val(rgb.b);
		},
		setFildsHSB: function () {
			this.ui.fields.hsb.h.val(this.hsb.new.h);
			this.ui.fields.hsb.s.val(this.hsb.new.s);
			this.ui.fields.hsb.b.val(this.hsb.new.b);
		},
		setFildsHex: function () {
			this.ui.fields.hex.val(HSBToHex(this.hsb.new));
		},
		setOpacityColor: function () {
			this.ui.opacity.css('backgroundImage', ' linear-gradient(to right, transparent, #' + HSBToHex(this.hsb.new) + ')');
		},
		setOpacity: function () {
			this.ui.opacity.slider('value', this.opacity.new * 1000);
		},
		setColor: function (color) {
			color.trim();
			if (color == 'transparent' ) {
				this.hsb.new = {
					h: 360,
					s: 0,
					b: 0
				};

				this.opacity.new = 0;
			} else if ( color[0] == '#' ) {
				this.hsb.new = HexToHSB(color.substr(1));

				this.opacity.new = 1;
			} else if (color.substr(0,4) == 'rgba') {
				color = color.slice(5, -1).split(',');

				this.hsb.new = RGBToHSB({
					r: parseInt(color[0]),
					g: parseInt(color[1]),
					b: parseInt(color[2])
				});

				this.opacity.new = parseFloat(color[3]);

			} else if (color.substr(0,3) == 'rgb') {
				color = color.slice(4, -1).split(',');

				this.hsb.new = RGBToHSB({
					r: parseInt(color[0]),
					g: parseInt(color[1]),
					b: parseInt(color[2])
				});

				this.opacity.new = 1;
			}
		},

		getColor: function (hsb, opacity) {
			var rgb = HSBToRGB(hsb);

			return {
				hsb: hsb,
				hex: '#' + HSBToHex(hsb),
				rgba: 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + opacity + ')'
			}
		},
		getUi: function () {

			return {
				parent: this.dropdown.parent,
				caller: this.dropdown.caller,
				colorpicker: this.dropdown.container,
				color: {
					start: this.getColor(this.hsb.start, this.opacity.start),
					current: this.getColor(this.hsb.current, this.opacity.current),
					new: this.getColor(this.hsb.new, this.opacity.new)
				}
			}
		}
	};

	$.fn.uicolorpicker = function () {

		if (this.data('colorpicker')) {
			var colorpicker = this.data('colorpicker');

			switch (arguments[0]) {
				case 'openEffect':
					if ($.isFunction( arguments[1] )) colorpicker.dropdown.effects.open = arguments[1];
					else console.error('Effect must be function');

					break;
				case 'closeEffect':
					if ($.isFunction( arguments[1] )) colorpicker.dropdown.effects.close = arguments[1];
					else console.error('Effect must be function');

					break;
				case 'open':
					colorpicker.dropdown.open();

					break;
				case 'close':
					colorpicker.dropdown.close();

					break;
				case 'disable':
					colorpicker.dropdown.disable();

					break;
				case 'enable':
					colorpicker.dropdown.enable();

					break;
				case 'color':
					if(arguments[1]) {
						colorpicker.setColor(arguments[1]);

						colorpicker.setH();
						colorpicker.setS();
						colorpicker.setB();
						colorpicker.setOpacity();
						colorpicker.setOpacityColor();
						colorpicker.setPreviewNew();
						colorpicker.setFildsHSB();
						colorpicker.setFildsRGB();
						colorpicker.setFildsHex();
					} else
						return colorpicker.getColor(colorpicker.hsb.new, colorpicker.opacity.new);

					break;
			}

		} else {
			var options = arguments[0];
			this.each(function () {
				new init($(this), options);
			})
		}

		return this;
	}
})(jQuery);
