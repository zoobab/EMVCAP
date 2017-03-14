
!function ($) {
"use strict"; // jshint ;_;
$(function () {
$.support.transition = (function () {
var transitionEnd = (function () {
var el = document.createElement('bootstrap')
, transEndEventNames = {
'WebkitTransition' : 'webkitTransitionEnd'
,  'MozTransition'    : 'transitionend'
,  'OTransition'      : 'oTransitionEnd otransitionend'
,  'transition'       : 'transitionend'
}
, name
for (name in transEndEventNames){
if (el.style[name] !== undefined) {
return transEndEventNames[name]
}
}
}())
return transitionEnd && {
end: transitionEnd
}
})()
})
}(window.jQuery);
!function ($) {
"use strict"; // jshint ;_;
var dismiss = '[data-dismiss="alert"]'
, Alert = function (el) {
$(el).on('click', dismiss, this.close)
}
Alert.prototype.close = function (e) {
var $this = $(this)
, selector = $this.attr('data-target')
, $parent
if (!selector) {
selector = $this.attr('href')
selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
}
$parent = $(selector)
e && e.preventDefault()
$parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())
$parent.trigger(e = $.Event('close'))
if (e.isDefaultPrevented()) return
$parent.removeClass('in')
function removeElement() {
$parent
.trigger('closed')
.remove()
}
$.support.transition && $parent.hasClass('fade') ?
$parent.on($.support.transition.end, removeElement) :
removeElement()
}
var old = $.fn.alert
$.fn.alert = function (option) {
return this.each(function () {
var $this = $(this)
, data = $this.data('alert')
if (!data) $this.data('alert', (data = new Alert(this)))
if (typeof option == 'string') data[option].call($this)
})
}
$.fn.alert.Constructor = Alert
$.fn.alert.noConflict = function () {
$.fn.alert = old
return this
}
$(document).on('click.alert.data-api', dismiss, Alert.prototype.close)
}(window.jQuery);
!function ($) {
"use strict"; // jshint ;_;
var Button = function (element, options) {
this.$element = $(element)
this.options = $.extend({}, $.fn.button.defaults, options)
}
Button.prototype.setState = function (state) {
var d = 'disabled'
, $el = this.$element
, data = $el.data()
, val = $el.is('input') ? 'val' : 'html'
state = state + 'Text'
data.resetText || $el.data('resetText', $el[val]())
$el[val](data[state] || this.options[state])
setTimeout(function () {
state == 'loadingText' ?
$el.addClass(d).attr(d, d) :
$el.removeClass(d).removeAttr(d)
}, 0)
}
Button.prototype.toggle = function () {
var $parent = this.$element.closest('[data-toggle="buttons-radio"]')
$parent && $parent
.find('.active')
.removeClass('active')
this.$element.toggleClass('active')
}
var old = $.fn.button
$.fn.button = function (option) {
return this.each(function () {
var $this = $(this)
, data = $this.data('button')
, options = typeof option == 'object' && option
if (!data) $this.data('button', (data = new Button(this, options)))
if (option == 'toggle') data.toggle()
else if (option) data.setState(option)
})
}
$.fn.button.defaults = {
loadingText: 'loading...'
}
$.fn.button.Constructor = Button
$.fn.button.noConflict = function () {
$.fn.button = old
return this
}
$(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
var $btn = $(e.target)
if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
$btn.button('toggle')
})
}(window.jQuery);
!function ($) {
"use strict"; // jshint ;_;
var Carousel = function (element, options) {
this.$element = $(element)
this.options = options
this.options.pause == 'hover' && this.$element
.on('mouseenter', $.proxy(this.pause, this))
.on('mouseleave', $.proxy(this.cycle, this))
}
Carousel.prototype = {
cycle: function (e) {
if (!e) this.paused = false
this.options.interval
&& !this.paused
&& (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
return this
}
, to: function (pos) {
var $active = this.$element.find('.item.active')
, children = $active.parent().children()
, activePos = children.index($active)
, that = this
if (pos > (children.length - 1) || pos < 0) return
if (this.sliding) {
return this.$element.one('slid', function () {
that.to(pos)
})
}
if (activePos == pos) {
return this.pause().cycle()
}
return this.slide(pos > activePos ? 'next' : 'prev', $(children[pos]))
}
, pause: function (e) {
if (!e) this.paused = true
if (this.$element.find('.next, .prev').length && $.support.transition.end) {
this.$element.trigger($.support.transition.end)
this.cycle()
}
clearInterval(this.interval)
this.interval = null
return this
}
, next: function () {
if (this.sliding) return
return this.slide('next')
}
, prev: function () {
if (this.sliding) return
return this.slide('prev')
}
, slide: function (type, next) {
var $active = this.$element.find('.item.active')
, $next = next || $active[type]()
, isCycling = this.interval
, direction = type == 'next' ? 'left' : 'right'
, fallback  = type == 'next' ? 'first' : 'last'
, that = this
, e
this.sliding = true
isCycling && this.pause()
$next = $next.length ? $next : this.$element.find('.item')[fallback]()
e = $.Event('slide', {
relatedTarget: $next[0]
})
if ($next.hasClass('active')) return
if ($.support.transition && this.$element.hasClass('slide')) {
this.$element.trigger(e)
if (e.isDefaultPrevented()) return
$next.addClass(type)
$next[0].offsetWidth // force reflow
$active.addClass(direction)
$next.addClass(direction)
this.$element.one($.support.transition.end, function () {
$next.removeClass([type, direction].join(' ')).addClass('active')
$active.removeClass(['active', direction].join(' '))
that.sliding = false
setTimeout(function () { that.$element.trigger('slid') }, 0)
})
} else {
this.$element.trigger(e)
if (e.isDefaultPrevented()) return
$active.removeClass('active')
$next.addClass('active')
this.sliding = false
this.$element.trigger('slid')
}
isCycling && this.cycle()
return this
}
}
var old = $.fn.carousel
$.fn.carousel = function (option) {
return this.each(function () {
var $this = $(this)
, data = $this.data('carousel')
, options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
, action = typeof option == 'string' ? option : options.slide
if (!data) $this.data('carousel', (data = new Carousel(this, options)))
if (typeof option == 'number') data.to(option)
else if (action) data[action]()
else if (options.interval) data.cycle()
})
}
$.fn.carousel.defaults = {
interval: 5000
, pause: 'hover'
}
$.fn.carousel.Constructor = Carousel
$.fn.carousel.noConflict = function () {
$.fn.carousel = old
return this
}
$(document).on('click.carousel.data-api', '[data-slide]', function (e) {
var $this = $(this), href
, $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
, options = $.extend({}, $target.data(), $this.data())
$target.carousel(options)
e.preventDefault()
})
}(window.jQuery);
!function ($) {
"use strict"; // jshint ;_;
var Collapse = function (element, options) {
this.$element = $(element)
this.options = $.extend({}, $.fn.collapse.defaults, options)
if (this.options.parent) {
this.$parent = $(this.options.parent)
}
this.options.toggle && this.toggle()
}
Collapse.prototype = {
constructor: Collapse
, dimension: function () {
var hasWidth = this.$element.hasClass('width')
return hasWidth ? 'width' : 'height'
}
, show: function () {
var dimension
, scroll
, actives
, hasData
if (this.transitioning) return
dimension = this.dimension()
scroll = $.camelCase(['scroll', dimension].join('-'))
actives = this.$parent && this.$parent.find('> .accordion-group > .in')
if (actives && actives.length) {
hasData = actives.data('collapse')
if (hasData && hasData.transitioning) return
actives.collapse('hide')
hasData || actives.data('collapse', null)
}
this.$element[dimension](0)
this.transition('addClass', $.Event('show'), 'shown')
$.support.transition && this.$element[dimension](this.$element[0][scroll])
}
, hide: function () {
var dimension
if (this.transitioning) return
dimension = this.dimension()
this.reset(this.$element[dimension]())
this.transition('removeClass', $.Event('hide'), 'hidden')
this.$element[dimension](0)
}
, reset: function (size) {
var dimension = this.dimension()
this.$element
.removeClass('collapse')
[dimension](size || 'auto')
[0].offsetWidth
this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')
return this
}
, transition: function (method, startEvent, completeEvent) {
var that = this
, complete = function () {
if (startEvent.type == 'show') that.reset()
that.transitioning = 0
that.$element.trigger(completeEvent)
}
this.$element.trigger(startEvent)
if (startEvent.isDefaultPrevented()) return
this.transitioning = 1
this.$element[method]('in')
$.support.transition && this.$element.hasClass('collapse') ?
this.$element.one($.support.transition.end, complete) :
complete()
}
, toggle: function () {
this[this.$element.hasClass('in') ? 'hide' : 'show']()
}
}
var old = $.fn.collapse
$.fn.collapse = function (option) {
return this.each(function () {
var $this = $(this)
, data = $this.data('collapse')
, options = typeof option == 'object' && option
if (!data) $this.data('collapse', (data = new Collapse(this, options)))
if (typeof option == 'string') data[option]()
})
}
$.fn.collapse.defaults = {
toggle: true
}
$.fn.collapse.Constructor = Collapse
$.fn.collapse.noConflict = function () {
$.fn.collapse = old
return this
}
$(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
var $this = $(this), href
, target = $this.attr('data-target')
|| e.preventDefault()
|| (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
, option = $(target).data('collapse') ? 'toggle' : $this.data()
$this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
$(target).collapse(option)
})
}(window.jQuery);
!function ($) {
"use strict"; // jshint ;_;
var toggle = '[data-toggle=dropdown]'
, Dropdown = function (element) {
var $el = $(element).on('click.dropdown.data-api', this.toggle)
$('html').on('click.dropdown.data-api', function () {
$el.parent().removeClass('open')
})
}
Dropdown.prototype = {
constructor: Dropdown
, toggle: function (e) {
var $this = $(this)
, $parent
, isActive
if ($this.is('.disabled, :disabled')) return
$parent = getParent($this)
isActive = $parent.hasClass('open')
clearMenus()
if (!isActive) {
$parent.toggleClass('open')
}
$this.focus()
return false
}
, keydown: function (e) {
var $this
, $items
, $active
, $parent
, isActive
, index
if (!/(38|40|27)/.test(e.keyCode)) return
$this = $(this)
e.preventDefault()
e.stopPropagation()
if ($this.is('.disabled, :disabled')) return
$parent = getParent($this)
isActive = $parent.hasClass('open')
if (!isActive || (isActive && e.keyCode == 27)) return $this.click()
$items = $('[role=menu] li:not(.divider):visible a', $parent)
if (!$items.length) return
index = $items.index($items.filter(':focus'))
if (e.keyCode == 38 && index > 0) index--                                        // up
if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
if (!~index) index = 0
$items
.eq(index)
.focus()
}
}
function clearMenus() {
$(toggle).each(function () {
getParent($(this)).removeClass('open')
})
}
function getParent($this) {
var selector = $this.attr('data-target')
, $parent
if (!selector) {
selector = $this.attr('href')
selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
}
$parent = $(selector)
$parent.length || ($parent = $this.parent())
return $parent
}
var old = $.fn.dropdown
$.fn.dropdown = function (option) {
return this.each(function () {
var $this = $(this)
, data = $this.data('dropdown')
if (!data) $this.data('dropdown', (data = new Dropdown(this)))
if (typeof option == 'string') data[option].call($this)
})
}
$.fn.dropdown.Constructor = Dropdown
$.fn.dropdown.noConflict = function () {
$.fn.dropdown = old
return this
}
$(document)
.on('click.dropdown.data-api touchstart.dropdown.data-api', clearMenus)
.on('click.dropdown touchstart.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
.on('touchstart.dropdown.data-api', '.dropdown-menu', function (e) { e.stopPropagation() })
.on('click.dropdown.data-api touchstart.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
.on('keydown.dropdown.data-api touchstart.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)
}(window.jQuery);
!function ($) {
"use strict"; // jshint ;_;
var Modal = function (element, options) {
this.options = options
this.$element = $(element)
.delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
}
Modal.prototype = {
constructor: Modal
, toggle: function () {
return this[!this.isShown ? 'show' : 'hide']()
}
, show: function () {
var that = this
, e = $.Event('show')
this.$element.trigger(e)
if (this.isShown || e.isDefaultPrevented()) return
this.isShown = true
this.escape()
this.backdrop(function () {
var transition = $.support.transition && that.$element.hasClass('fade')
if (!that.$element.parent().length) {
that.$element.appendTo(document.body) //don't move modals dom position
}
that.$element
.show()
if (transition) {
that.$element[0].offsetWidth // force reflow
}
that.$element
.addClass('in')
.attr('aria-hidden', false)
that.enforceFocus()
transition ?
that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
that.$element.focus().trigger('shown')
})
}
, hide: function (e) {
e && e.preventDefault()
var that = this
e = $.Event('hide')
this.$element.trigger(e)
if (!this.isShown || e.isDefaultPrevented()) return
this.isShown = false
this.escape()
$(document).off('focusin.modal')
this.$element
.removeClass('in')
.attr('aria-hidden', true)
$.support.transition && this.$element.hasClass('fade') ?
this.hideWithTransition() :
this.hideModal()
}
, enforceFocus: function () {
var that = this
$(document).on('focusin.modal', function (e) {
if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
that.$element.focus()
}
})
}
, escape: function () {
var that = this
if (this.isShown && this.options.keyboard) {
this.$element.on('keyup.dismiss.modal', function ( e ) {
e.which == 27 && that.hide()
})
} else if (!this.isShown) {
this.$element.off('keyup.dismiss.modal')
}
}
, hideWithTransition: function () {
var that = this
, timeout = setTimeout(function () {
that.$element.off($.support.transition.end)
that.hideModal()
}, 500)
this.$element.one($.support.transition.end, function () {
clearTimeout(timeout)
that.hideModal()
})
}
, hideModal: function (that) {
this.$element
.hide()
.trigger('hidden')
this.backdrop()
}
, removeBackdrop: function () {
this.$backdrop.remove()
this.$backdrop = null
}
, backdrop: function (callback) {
var that = this
, animate = this.$element.hasClass('fade') ? 'fade' : ''
if (this.isShown && this.options.backdrop) {
var doAnimate = $.support.transition && animate
this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
.appendTo(document.body)
this.$backdrop.click(
this.options.backdrop == 'static' ?
$.proxy(this.$element[0].focus, this.$element[0])
: $.proxy(this.hide, this)
)
if (doAnimate) this.$backdrop[0].offsetWidth // force reflow
this.$backdrop.addClass('in')
doAnimate ?
this.$backdrop.one($.support.transition.end, callback) :
callback()
} else if (!this.isShown && this.$backdrop) {
this.$backdrop.removeClass('in')
$.support.transition && this.$element.hasClass('fade')?
this.$backdrop.one($.support.transition.end, $.proxy(this.removeBackdrop, this)) :
this.removeBackdrop()
} else if (callback) {
callback()
}
}
}
var old = $.fn.modal
$.fn.modal = function (option) {
return this.each(function () {
var $this = $(this)
, data = $this.data('modal')
, options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
if (!data) $this.data('modal', (data = new Modal(this, options)))
if (typeof option == 'string') data[option]()
else if (options.show) data.show()
})
}
$.fn.modal.defaults = {
backdrop: true
, keyboard: true
, show: true
}
$.fn.modal.Constructor = Modal
$.fn.modal.noConflict = function () {
$.fn.modal = old
return this
}
$(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
var $this = $(this)
, href = $this.attr('href')
, $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
, option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())
e.preventDefault()
$target
.modal(option)
.one('hide', function () {
$this.focus()
})
})
}(window.jQuery);
!function ($) {
"use strict"; // jshint ;_;
var Tooltip = function (element, options) {
this.init('tooltip', element, options)
}
Tooltip.prototype = {
constructor: Tooltip
, init: function (type, element, options) {
var eventIn
, eventOut
this.type = type
this.$element = $(element)
this.options = this.getOptions(options)
this.enabled = true
if (this.options.trigger == 'click') {
this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
} else if (this.options.trigger != 'manual') {
eventIn = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
}
this.options.selector ?
(this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
this.fixTitle()
}
, getOptions: function (options) {
options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())
if (options.delay && typeof options.delay == 'number') {
options.delay = {
show: options.delay
, hide: options.delay
}
}
return options
}
, enter: function (e) {
var self = $(e.currentTarget)[this.type](this._options).data(this.type)
if (!self.options.delay || !self.options.delay.show) return self.show()
clearTimeout(this.timeout)
self.hoverState = 'in'
this.timeout = setTimeout(function() {
if (self.hoverState == 'in') self.show()
}, self.options.delay.show)
}
, leave: function (e) {
var self = $(e.currentTarget)[this.type](this._options).data(this.type)
if (this.timeout) clearTimeout(this.timeout)
if (!self.options.delay || !self.options.delay.hide) return self.hide()
self.hoverState = 'out'
this.timeout = setTimeout(function() {
if (self.hoverState == 'out') self.hide()
}, self.options.delay.hide)
}
, show: function () {
var $tip
, inside
, pos
, actualWidth
, actualHeight
, placement
, tp
if (this.hasContent() && this.enabled) {
$tip = this.tip()
this.setContent()
if (this.options.animation) {
$tip.addClass('fade')
}
placement = typeof this.options.placement == 'function' ?
this.options.placement.call(this, $tip[0], this.$element[0]) :
this.options.placement
inside = /in/.test(placement)
$tip
.detach()
.css({ top: 0, left: 0, display: 'block' })
.insertAfter(this.$element)
pos = this.getPosition(inside)
actualWidth = $tip[0].offsetWidth
actualHeight = $tip[0].offsetHeight
switch (inside ? placement.split(' ')[1] : placement) {
case 'bottom':
tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
break
case 'top':
tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
break
case 'left':
tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
break
case 'right':
tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
break
}
$tip
.offset(tp)
.addClass(placement)
.addClass('in')
}
}
, setContent: function () {
var $tip = this.tip()
, title = this.getTitle()
$tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
$tip.removeClass('fade in top bottom left right')
}
, hide: function () {
var that = this
, $tip = this.tip()
$tip.removeClass('in')
function removeWithAnimation() {
var timeout = setTimeout(function () {
$tip.off($.support.transition.end).detach()
}, 500)
$tip.one($.support.transition.end, function () {
clearTimeout(timeout)
$tip.detach()
})
}
$.support.transition && this.$tip.hasClass('fade') ?
removeWithAnimation() :
$tip.detach()
return this
}
, fixTitle: function () {
var $e = this.$element
if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
$e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
}
}
, hasContent: function () {
return this.getTitle()
}
, getPosition: function (inside) {
return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
width: this.$element[0].offsetWidth
, height: this.$element[0].offsetHeight
})
}
, getTitle: function () {
var title
, $e = this.$element
, o = this.options
title = $e.attr('data-original-title')
|| (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)
return title
}
, tip: function () {
return this.$tip = this.$tip || $(this.options.template)
}
, validate: function () {
if (!this.$element[0].parentNode) {
this.hide()
this.$element = null
this.options = null
}
}
, enable: function () {
this.enabled = true
}
, disable: function () {
this.enabled = false
}
, toggleEnabled: function () {
this.enabled = !this.enabled
}
, toggle: function (e) {
var self = $(e.currentTarget)[this.type](this._options).data(this.type)
self[self.tip().hasClass('in') ? 'hide' : 'show']()
}
, destroy: function () {
this.hide().$element.off('.' + this.type).removeData(this.type)
}
}
var old = $.fn.tooltip
$.fn.tooltip = function ( option ) {
return this.each(function () {
var $this = $(this)
, data = $this.data('tooltip')
, options = typeof option == 'object' && option
if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
if (typeof option == 'string') data[option]()
})
}
$.fn.tooltip.Constructor = Tooltip
$.fn.tooltip.defaults = {
animation: true
, placement: 'top'
, selector: false
, template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
, trigger: 'hover'
, title: ''
, delay: 0
, html: false
}
$.fn.tooltip.noConflict = function () {
$.fn.tooltip = old
return this
}
}(window.jQuery);
!function ($) {
"use strict"; // jshint ;_;
var Popover = function (element, options) {
this.init('popover', element, options)
}
Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {
constructor: Popover
, setContent: function () {
var $tip = this.tip()
, title = this.getTitle()
, content = this.getContent()
$tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
$tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)
$tip.removeClass('fade top bottom left right in')
}
, hasContent: function () {
return this.getTitle() || this.getContent()
}
, getContent: function () {
var content
, $e = this.$element
, o = this.options
content = $e.attr('data-content')
|| (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
return content
}
, tip: function () {
if (!this.$tip) {
this.$tip = $(this.options.template)
}
return this.$tip
}
, destroy: function () {
this.hide().$element.off('.' + this.type).removeData(this.type)
}
})
var old = $.fn.popover
$.fn.popover = function (option) {
return this.each(function () {
var $this = $(this)
, data = $this.data('popover')
, options = typeof option == 'object' && option
if (!data) $this.data('popover', (data = new Popover(this, options)))
if (typeof option == 'string') data[option]()
})
}
$.fn.popover.Constructor = Popover
$.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
placement: 'right'
, trigger: 'click'
, content: ''
, template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"></div></div></div>'
})
$.fn.popover.noConflict = function () {
$.fn.popover = old
return this
}
}(window.jQuery);
!function ($) {
"use strict"; // jshint ;_;
function ScrollSpy(element, options) {
var process = $.proxy(this.process, this)
, $element = $(element).is('body') ? $(window) : $(element)
, href
this.options = $.extend({}, $.fn.scrollspy.defaults, options)
this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
this.selector = (this.options.target
|| ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
|| '') + ' .nav li > a'
this.$body = $('body')
this.refresh()
this.process()
}
ScrollSpy.prototype = {
constructor: ScrollSpy
, refresh: function () {
var self = this
, $targets
this.offsets = $([])
this.targets = $([])
$targets = this.$body
.find(this.selector)
.map(function () {
var $el = $(this)
, href = $el.data('target') || $el.attr('href')
, $href = /^#\w/.test(href) && $(href)
return ( $href
&& $href.length
&& [[ $href.position().top + self.$scrollElement.scrollTop(), href ]] ) || null
})
.sort(function (a, b) { return a[0] - b[0] })
.each(function () {
self.offsets.push(this[0])
self.targets.push(this[1])
})
}
, process: function () {
var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
, scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
, maxScroll = scrollHeight - this.$scrollElement.height()
, offsets = this.offsets
, targets = this.targets
, activeTarget = this.activeTarget
, i
if (scrollTop >= maxScroll) {
return activeTarget != (i = targets.last()[0])
&& this.activate ( i )
}
for (i = offsets.length; i--;) {
activeTarget != targets[i]
&& scrollTop >= offsets[i]
&& (!offsets[i + 1] || scrollTop <= offsets[i + 1])
&& this.activate( targets[i] )
}
}
, activate: function (target) {
var active
, selector
this.activeTarget = target
$(this.selector)
.parent('.active')
.removeClass('active')
selector = this.selector
+ '[data-target="' + target + '"],'
+ this.selector + '[href="' + target + '"]'
active = $(selector)
.parent('li')
.addClass('active')
if (active.parent('.dropdown-menu').length)  {
active = active.closest('li.dropdown').addClass('active')
}
active.trigger('activate')
}
}
var old = $.fn.scrollspy
$.fn.scrollspy = function (option) {
return this.each(function () {
var $this = $(this)
, data = $this.data('scrollspy')
, options = typeof option == 'object' && option
if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
if (typeof option == 'string') data[option]()
})
}
$.fn.scrollspy.Constructor = ScrollSpy
$.fn.scrollspy.defaults = {
offset: 10
}
$.fn.scrollspy.noConflict = function () {
$.fn.scrollspy = old
return this
}
$(window).on('load', function () {
$('[data-spy="scroll"]').each(function () {
var $spy = $(this)
$spy.scrollspy($spy.data())
})
})
}(window.jQuery);
!function ($) {
"use strict"; // jshint ;_;
var Tab = function (element) {
this.element = $(element)
}
Tab.prototype = {
constructor: Tab
, show: function () {
var $this = this.element
, $ul = $this.closest('ul:not(.dropdown-menu)')
, selector = $this.attr('data-target')
, previous
, $target
, e
if (!selector) {
selector = $this.attr('href')
selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
}
if ( $this.parent('li').hasClass('active') ) return
previous = $ul.find('.active:last a')[0]
e = $.Event('show', {
relatedTarget: previous
})
$this.trigger(e)
if (e.isDefaultPrevented()) return
$target = $(selector)
this.activate($this.parent('li'), $ul)
this.activate($target, $target.parent(), function () {
$this.trigger({
type: 'shown'
, relatedTarget: previous
})
})
}
, activate: function ( element, container, callback) {
var $active = container.find('> .active')
, transition = callback
&& $.support.transition
&& $active.hasClass('fade')
function next() {
$active
.removeClass('active')
.find('> .dropdown-menu > .active')
.removeClass('active')
element.addClass('active')
if (transition) {
element[0].offsetWidth // reflow for transition
element.addClass('in')
} else {
element.removeClass('fade')
}
if ( element.parent('.dropdown-menu') ) {
element.closest('li.dropdown').addClass('active')
}
callback && callback()
}
transition ?
$active.one($.support.transition.end, next) :
next()
$active.removeClass('in')
}
}
var old = $.fn.tab
$.fn.tab = function ( option ) {
return this.each(function () {
var $this = $(this)
, data = $this.data('tab')
if (!data) $this.data('tab', (data = new Tab(this)))
if (typeof option == 'string') data[option]()
})
}
$.fn.tab.Constructor = Tab
$.fn.tab.noConflict = function () {
$.fn.tab = old
return this
}
$(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
e.preventDefault()
$(this).tab('show')
})
}(window.jQuery);
!function($){
"use strict"; // jshint ;_;
var Typeahead = function (element, options) {
this.$element = $(element)
this.options = $.extend({}, $.fn.typeahead.defaults, options)
this.matcher = this.options.matcher || this.matcher
this.sorter = this.options.sorter || this.sorter
this.highlighter = this.options.highlighter || this.highlighter
this.updater = this.options.updater || this.updater
this.source = this.options.source
this.$menu = $(this.options.menu)
this.shown = false
this.listen()
}
Typeahead.prototype = {
constructor: Typeahead
, select: function () {
var val = this.$menu.find('.active').attr('data-value')
this.$element
.val(this.updater(val))
.change()
return this.hide()
}
, updater: function (item) {
return item
}
, show: function () {
var pos = $.extend({}, this.$element.position(), {
height: this.$element[0].offsetHeight
})
this.$menu
.insertAfter(this.$element)
.css({
top: pos.top + pos.height
, left: pos.left
})
.show()
this.shown = true
return this
}
, hide: function () {
this.$menu.hide()
this.shown = false
return this
}
, lookup: function (event) {
var items
this.query = this.$element.val()
if (!this.query || this.query.length < this.options.minLength) {
return this.shown ? this.hide() : this
}
items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source
return items ? this.process(items) : this
}
, process: function (items) {
var that = this
items = $.grep(items, function (item) {
return that.matcher(item)
})
items = this.sorter(items)
if (!items.length) {
return this.shown ? this.hide() : this
}
return this.render(items.slice(0, this.options.items)).show()
}
, matcher: function (item) {
return ~item.toLowerCase().indexOf(this.query.toLowerCase())
}
, sorter: function (items) {
var beginswith = []
, caseSensitive = []
, caseInsensitive = []
, item
while (item = items.shift()) {
if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
else if (~item.indexOf(this.query)) caseSensitive.push(item)
else caseInsensitive.push(item)
}
return beginswith.concat(caseSensitive, caseInsensitive)
}
, highlighter: function (item) {
var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
return '<strong>' + match + '</strong>'
})
}
, render: function (items) {
var that = this
items = $(items).map(function (i, item) {
i = $(that.options.item).attr('data-value', item)
i.find('a').html(that.highlighter(item))
return i[0]
})
items.first().addClass('active')
this.$menu.html(items)
return this
}
, next: function (event) {
var active = this.$menu.find('.active').removeClass('active')
, next = active.next()
if (!next.length) {
next = $(this.$menu.find('li')[0])
}
next.addClass('active')
}
, prev: function (event) {
var active = this.$menu.find('.active').removeClass('active')
, prev = active.prev()
if (!prev.length) {
prev = this.$menu.find('li').last()
}
prev.addClass('active')
}
, listen: function () {
this.$element
.on('blur',     $.proxy(this.blur, this))
.on('keypress', $.proxy(this.keypress, this))
.on('keyup',    $.proxy(this.keyup, this))
if (this.eventSupported('keydown')) {
this.$element.on('keydown', $.proxy(this.keydown, this))
}
this.$menu
.on('click', $.proxy(this.click, this))
.on('mouseenter', 'li', $.proxy(this.mouseenter, this))
}
, eventSupported: function(eventName) {
var isSupported = eventName in this.$element
if (!isSupported) {
this.$element.setAttribute(eventName, 'return;')
isSupported = typeof this.$element[eventName] === 'function'
}
return isSupported
}
, move: function (e) {
if (!this.shown) return
switch(e.keyCode) {
case 9: // tab
case 13: // enter
case 27: // escape
e.preventDefault()
break
case 38: // up arrow
e.preventDefault()
this.prev()
break
case 40: // down arrow
e.preventDefault()
this.next()
break
}
e.stopPropagation()
}
, keydown: function (e) {
this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
this.move(e)
}
, keypress: function (e) {
if (this.suppressKeyPressRepeat) return
this.move(e)
}
, keyup: function (e) {
switch(e.keyCode) {
case 40: // down arrow
case 38: // up arrow
case 16: // shift
case 17: // ctrl
case 18: // alt
break
case 9: // tab
case 13: // enter
if (!this.shown) return
this.select()
break
case 27: // escape
if (!this.shown) return
this.hide()
break
default:
this.lookup()
}
e.stopPropagation()
e.preventDefault()
}
, blur: function (e) {
var that = this
setTimeout(function () { that.hide() }, 150)
}
, click: function (e) {
e.stopPropagation()
e.preventDefault()
this.select()
}
, mouseenter: function (e) {
this.$menu.find('.active').removeClass('active')
$(e.currentTarget).addClass('active')
}
}
var old = $.fn.typeahead
$.fn.typeahead = function (option) {
return this.each(function () {
var $this = $(this)
, data = $this.data('typeahead')
, options = typeof option == 'object' && option
if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
if (typeof option == 'string') data[option]()
})
}
$.fn.typeahead.defaults = {
source: []
, items: 8
, menu: '<ul class="typeahead dropdown-menu"></ul>'
, item: '<li><a href="#"></a></li>'
, minLength: 1
}
$.fn.typeahead.Constructor = Typeahead
$.fn.typeahead.noConflict = function () {
$.fn.typeahead = old
return this
}
$(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
var $this = $(this)
if ($this.data('typeahead')) return
e.preventDefault()
$this.typeahead($this.data())
})
}(window.jQuery);
!function ($) {
"use strict"; // jshint ;_;
var Affix = function (element, options) {
this.options = $.extend({}, $.fn.affix.defaults, options)
this.$window = $(window)
.on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
.on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
this.$element = $(element)
this.checkPosition()
}
Affix.prototype.checkPosition = function () {
if (!this.$element.is(':visible')) return
var scrollHeight = $(document).height()
, scrollTop = this.$window.scrollTop()
, position = this.$element.offset()
, offset = this.options.offset
, offsetBottom = offset.bottom
, offsetTop = offset.top
, reset = 'affix affix-top affix-bottom'
, affix
if (typeof offset != 'object') offsetBottom = offsetTop = offset
if (typeof offsetTop == 'function') offsetTop = offset.top()
if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()
affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
'bottom' : offsetTop != null && scrollTop <= offsetTop ?
'top'    : false
if (this.affixed === affix) return
this.affixed = affix
this.unpin = affix == 'bottom' ? position.top - scrollTop : null
this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
}
var old = $.fn.affix
$.fn.affix = function (option) {
return this.each(function () {
var $this = $(this)
, data = $this.data('affix')
, options = typeof option == 'object' && option
if (!data) $this.data('affix', (data = new Affix(this, options)))
if (typeof option == 'string') data[option]()
})
}
$.fn.affix.Constructor = Affix
$.fn.affix.defaults = {
offset: 0
}
$.fn.affix.noConflict = function () {
$.fn.affix = old
return this
}
$(window).on('load', function () {
$('[data-spy="affix"]').each(function () {
var $spy = $(this)
, data = $spy.data()
data.offset = data.offset || {}
data.offsetBottom && (data.offset.bottom = data.offsetBottom)
data.offsetTop && (data.offset.top = data.offsetTop)
$spy.affix(data)
})
})
}(window.jQuery);
(function(e,t){function i(t,i){var a,n,r,o=t.nodeName.toLowerCase();return"area"===o?(a=t.parentNode,n=a.name,t.href&&n&&"map"===a.nodeName.toLowerCase()?(r=e("img[usemap=#"+n+"]")[0],!!r&&s(r)):!1):(/input|select|textarea|button|object/.test(o)?!t.disabled:"a"===o?t.href||i:i)&&s(t)}function s(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}var a=0,n=/^ui-id-\d+$/;e.ui=e.ui||{},e.extend(e.ui,{version:"1.10.3",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({focus:function(t){return function(i,s){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),s&&s.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),scrollParent:function(){var t;return t=e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(i){if(i!==t)return this.css("zIndex",i);if(this.length)for(var s,a,n=e(this[0]);n.length&&n[0]!==document;){if(s=n.css("position"),("absolute"===s||"relative"===s||"fixed"===s)&&(a=parseInt(n.css("zIndex"),10),!isNaN(a)&&0!==a))return a;n=n.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++a)})},removeUniqueId:function(){return this.each(function(){n.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,s){return!!e.data(t,s[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var s=e.attr(t,"tabindex"),a=isNaN(s);return(a||s>=0)&&i(t,!a)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(i,s){function a(t,i,s,a){return e.each(n,function(){i-=parseFloat(e.css(t,"padding"+this))||0,s&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),a&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var n="Width"===s?["Left","Right"]:["Top","Bottom"],r=s.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+s]=function(i){return i===t?o["inner"+s].call(this):this.each(function(){e(this).css(r,a(this,i)+"px")})},e.fn["outer"+s]=function(t,i){return"number"!=typeof t?o["outer"+s].call(this,t):this.each(function(){e(this).css(r,a(this,t,!0,i)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.support.selectstart="onselectstart"in document.createElement("div"),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,i,s){var a,n=e.ui[t].prototype;for(a in s)n.plugins[a]=n.plugins[a]||[],n.plugins[a].push([i,s[a]])},call:function(e,t,i){var s,a=e.plugins[t];if(a&&e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType)for(s=0;a.length>s;s++)e.options[a[s][0]]&&a[s][1].apply(e.element,i)}},hasScroll:function(t,i){if("hidden"===e(t).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",a=!1;return t[s]>0?!0:(t[s]=1,a=t[s]>0,t[s]=0,a)}})})(jQuery);(function(e,t){var i=0,s=Array.prototype.slice,n=e.cleanData;e.cleanData=function(t){for(var i,s=0;null!=(i=t[s]);s++)try{e(i).triggerHandler("remove")}catch(a){}n(t)},e.widget=function(i,s,n){var a,r,o,h,l={},u=i.split(".")[0];i=i.split(".")[1],a=u+"-"+i,n||(n=s,s=e.Widget),e.expr[":"][a.toLowerCase()]=function(t){return!!e.data(t,a)},e[u]=e[u]||{},r=e[u][i],o=e[u][i]=function(e,i){return this._createWidget?(arguments.length&&this._createWidget(e,i),t):new o(e,i)},e.extend(o,r,{version:n.version,_proto:e.extend({},n),_childConstructors:[]}),h=new s,h.options=e.widget.extend({},h.options),e.each(n,function(i,n){return e.isFunction(n)?(l[i]=function(){var e=function(){return s.prototype[i].apply(this,arguments)},t=function(e){return s.prototype[i].apply(this,e)};return function(){var i,s=this._super,a=this._superApply;return this._super=e,this._superApply=t,i=n.apply(this,arguments),this._super=s,this._superApply=a,i}}(),t):(l[i]=n,t)}),o.prototype=e.widget.extend(h,{widgetEventPrefix:r?h.widgetEventPrefix:i},l,{constructor:o,namespace:u,widgetName:i,widgetFullName:a}),r?(e.each(r._childConstructors,function(t,i){var s=i.prototype;e.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete r._childConstructors):s._childConstructors.push(o),e.widget.bridge(i,o)},e.widget.extend=function(i){for(var n,a,r=s.call(arguments,1),o=0,h=r.length;h>o;o++)for(n in r[o])a=r[o][n],r[o].hasOwnProperty(n)&&a!==t&&(i[n]=e.isPlainObject(a)?e.isPlainObject(i[n])?e.widget.extend({},i[n],a):e.widget.extend({},a):a);return i},e.widget.bridge=function(i,n){var a=n.prototype.widgetFullName||i;e.fn[i]=function(r){var o="string"==typeof r,h=s.call(arguments,1),l=this;return r=!o&&h.length?e.widget.extend.apply(null,[r].concat(h)):r,o?this.each(function(){var s,n=e.data(this,a);return n?e.isFunction(n[r])&&"_"!==r.charAt(0)?(s=n[r].apply(n,h),s!==n&&s!==t?(l=s&&s.jquery?l.pushStack(s.get()):s,!1):t):e.error("no such method '"+r+"' for "+i+" widget instance"):e.error("cannot call methods on "+i+" prior to initialization; "+"attempted to call method '"+r+"'")}):this.each(function(){var t=e.data(this,a);t?t.option(r||{})._init():e.data(this,a,new n(r,this))}),l}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,s){s=e(s||this.defaultElement||this)[0],this.element=e(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),s!==this&&(e.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===s&&this.destroy()}}),this.document=e(s.style?s.ownerDocument:s.document||s),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(i,s){var n,a,r,o=i;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof i)if(o={},n=i.split("."),i=n.shift(),n.length){for(a=o[i]=e.widget.extend({},this.options[i]),r=0;n.length-1>r;r++)a[n[r]]=a[n[r]]||{},a=a[n[r]];if(i=n.pop(),s===t)return a[i]===t?null:a[i];a[i]=s}else{if(s===t)return this.options[i]===t?null:this.options[i];o[i]=s}return this._setOptions(o),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!t).attr("aria-disabled",t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(i,s,n){var a,r=this;"boolean"!=typeof i&&(n=s,s=i,i=!1),n?(s=a=e(s),this.bindings=this.bindings.add(s)):(n=s,s=this.element,a=this.widget()),e.each(n,function(n,o){function h(){return i||r.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof o?r[o]:o).apply(r,arguments):t}"string"!=typeof o&&(h.guid=o.guid=o.guid||h.guid||e.guid++);var l=n.match(/^(\w+)\s*(.*)$/),u=l[1]+r.eventNamespace,c=l[2];c?a.delegate(c,u,h):s.bind(u,h)})},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t)},_delay:function(e,t){function i(){return("string"==typeof e?s[e]:e).apply(s,arguments)}var s=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,s){var n,a,r=this.options[t];if(s=s||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],a=i.originalEvent)for(n in a)n in i||(i[n]=a[n]);return this.element.trigger(i,s),!(e.isFunction(r)&&r.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(s,n,a){"string"==typeof n&&(n={effect:n});var r,o=n?n===!0||"number"==typeof n?i:n.effect||i:t;n=n||{},"number"==typeof n&&(n={duration:n}),r=!e.isEmptyObject(n),n.complete=a,n.delay&&s.delay(n.delay),r&&e.effects&&e.effects.effect[o]?s[t](n):o!==t&&s[o]?s[o](n.duration,n.easing,a):s.queue(function(i){e(this)[t](),a&&a.call(s[0]),i()})}})})(jQuery);
(function(e){"use strict";e(window.jQuery,window,document)})(function(e,t,s){"use strict";e.widget("toc.tocify",{version:"1.6.0",options:{context:"body",ignoreSelector:null,selectors:"h1, h2, h3",showAndHide:!0,showEffect:"slideDown",showEffectSpeed:"medium",hideEffect:"slideUp",hideEffectSpeed:"medium",smoothScroll:!0,smoothScrollSpeed:"medium",scrollTo:0,showAndHideOnScroll:!0,highlightOnScroll:!0,highlightOffset:40,theme:"bootstrap",extendPage:!0,extendPageOffset:100,history:!0,hashGenerator:"compact",highlightDefault:!0},_create:function(){var s=this;s.extendPageScroll=!0,s.items=[],s._generateToc(),s._addCSSClasses(),s.webkit=function(){for(var e in t)if(e&&-1!==e.toLowerCase().indexOf("webkit"))return!0;return!1}(),s._setEventHandlers(),e(t).load(function(){s._setActiveElement(!0),e("html, body").promise().done(function(){setTimeout(function(){s.extendPageScroll=!1},0)})})},_generateToc:function(){var t,s,i=this,n=i.options.ignoreSelector;t=-1!==this.options.selectors.indexOf(",")?e(this.options.context).find(this.options.selectors.replace(/ /g,"").substr(0,this.options.selectors.indexOf(","))):e(this.options.context).find(this.options.selectors.replace(/ /g,"")),t.each(function(t){e(this).is(n)||(s=e("<ul/>",{id:"Header"+t,"class":"header"}).append(i._nestElements(e(this),t)),i.element.append(s),e(this).nextUntil(this.nodeName.toLowerCase()).each(function(){0===e(this).find(i.options.selectors).length?e(this).filter(i.options.selectors).each(function(){e(this).is(n)||i._appendSubheaders.call(this,i,s)}):e(this).find(i.options.selectors).each(function(){e(this).is(n)||i._appendSubheaders.call(this,i,s)})}))})},_setActiveElement:function(e){var s=this,i=t.location.hash.substring(1),n=s.element.find("li[data-unique='"+i+"']");return i.length?(s.element.find("."+s.focusClass).removeClass(s.focusClass),n.addClass(s.focusClass),s.options.showAndHide&&n.click()):(s.element.find("."+s.focusClass).removeClass(s.focusClass),!i.length&&e&&s.options.highlightDefault&&s.element.find(".item").first().addClass(s.focusClass)),s},_nestElements:function(t,s){var i,n,o;return i=e.grep(this.items,function(e){return e===t.text()}),i.length?this.items.push(t.text()+s):this.items.push(t.text()),o=this._generateHashValue(i,t,s),n=e("<li/>",{"class":"item","data-unique":o}).append(e("<a/>",{text:t.text()})),t.before(e("<div/>",{name:o,"data-unique":o})),n},_generateHashValue:function(e,t,s){var i="",n=this.options.hashGenerator;if("pretty"===n){for(i=t.text().toLowerCase().replace(/\s/g,"-");i.indexOf("--")>-1;)i=i.replace(/--/g,"-");for(;i.indexOf(":-")>-1;)i=i.replace(/:-/g,"-")}else i="function"==typeof n?n(t.text(),t):t.text().replace(/\s/g,"");return e.length&&(i+=""+s),i},_appendSubheaders:function(t,s){var i=e(this).index(t.options.selectors),n=e(t.options.selectors).eq(i-1),o=+e(this).prop("tagName").charAt(1),a=+n.prop("tagName").charAt(1);a>o?t.element.find(".sub-header[data-tag="+o+"]").last().append(t._nestElements(e(this),i)):o===a?s.find(".item").last().after(t._nestElements(e(this),i)):s.find(".item").last().after(e("<ul/>",{"class":"sub-header","data-tag":o})).next(".sub-header").append(t._nestElements(e(this),i))},_setEventHandlers:function(){var i=this;this.element.on("click.tocify","li",function(){if(i.options.history&&(t.location.hash=e(this).attr("data-unique")),i.element.find("."+i.focusClass).removeClass(i.focusClass),e(this).addClass(i.focusClass),i.options.showAndHide){var s=e('li[data-unique="'+e(this).attr("data-unique")+'"]');i._triggerShow(s)}i._scrollTo(e(this))}),this.element.find("li").on({"mouseenter.tocify":function(){e(this).addClass(i.hoverClass),e(this).css("cursor","pointer")},"mouseleave.tocify":function(){"bootstrap"!==i.options.theme&&e(this).removeClass(i.hoverClass)}}),e(t).on("scroll.tocify",function(){e("html, body").promise().done(function(){var n,o,a,h,d=e(t).scrollTop(),l=e(t).height(),r=e(s).height(),c=e("body")[0].scrollHeight;if(i.options.extendPage&&(i.webkit&&d>=c-l-i.options.extendPageOffset||!i.webkit&&l+d>r-i.options.extendPageOffset)&&!e(".tocify-extend-page").length){if(o=e('div[data-unique="'+e(".item").last().attr("data-unique")+'"]'),!o.length)return;a=o.offset().top,e(i.options.context).append(e("<div />",{"class":"tocify-extend-page",height:Math.abs(a-d)+"px","data-unique":"tocify-extend-page"})),i.extendPageScroll&&(h=i.element.find("li.active"),i._scrollTo(e("div[data-unique="+h.attr("data-unique")+"]")))}setTimeout(function(){var t=null,s=null,o=e(i.options.context).find("div[data-unique]");o.each(function(n){var o=Math.abs((e(this).next().length?e(this).next():e(this)).offset().top-d-i.options.highlightOffset);return null==t||t>o?(t=o,s=n,undefined):!1}),n=e('li[data-unique="'+e(o[s]).attr("data-unique")+'"]'),i.options.highlightOnScroll&&n.length&&(i.element.find("."+i.focusClass).removeClass(i.focusClass),n.addClass(i.focusClass)),i.options.showAndHideOnScroll&&i.options.showAndHide&&i._triggerShow(n,!0)},0)})}),"onhashchange"in t&&(t.onhashchange=function(){i._setActiveElement()})},show:function(t){var s=this;if(!t.is(":visible"))switch(t.find(".sub-header").length||t.parent().is(".header")||t.parent().is(":visible")?t.children(".sub-header").length||t.parent().is(".header")||(t=t.closest(".sub-header")):t=t.parents(".sub-header").add(t),s.options.showEffect){case"none":t.show();break;case"show":t.show(s.options.showEffectSpeed);break;case"slideDown":t.slideDown(s.options.showEffectSpeed);break;case"fadeIn":t.fadeIn(s.options.showEffectSpeed);break;default:t.show()}return t.parent().is(".header")?s.hide(e(".sub-header").not(t)):s.hide(e(".sub-header").not(t.closest(".header").find(".sub-header").not(t.siblings()))),s},hide:function(e){var t=this;switch(t.options.hideEffect){case"none":e.hide();break;case"hide":e.hide(t.options.hideEffectSpeed);break;case"slideUp":e.slideUp(t.options.hideEffectSpeed);break;case"fadeOut":e.fadeOut(t.options.hideEffectSpeed);break;default:e.hide()}return t},_triggerShow:function(e,t){var s=this;return e.parent().is(".header")||e.next().is(".sub-header")?s.show(e.next(".sub-header"),t):e.parent().is(".sub-header")&&s.show(e.parent(),t),s},_addCSSClasses:function(){return"jqueryui"===this.options.theme?(this.focusClass="ui-state-default",this.hoverClass="ui-state-hover",this.element.addClass("ui-widget").find(".toc-title").addClass("ui-widget-header").end().find("li").addClass("ui-widget-content")):"bootstrap"===this.options.theme?(this.element.find(".header, .sub-header").addClass("nav nav-list"),this.focusClass="active"):(this.focusClass="tocify-focus",this.hoverClass="tocify-hover"),this},setOption:function(){e.Widget.prototype._setOption.apply(this,arguments)},setOptions:function(){e.Widget.prototype._setOptions.apply(this,arguments)},_scrollTo:function(t){var s=this,i=s.options.smoothScroll||0,n=s.options.scrollTo;return e("html, body").promise().done(function(){e("html, body").animate({scrollTop:e('div[data-unique="'+t.attr("data-unique")+'"]').offset().top-(e.isFunction(n)?n.call():n)+"px"},{duration:i})}),s}})});
$(document).ready(function(){
$('.insert-credits').html('565');
});
!function ($) {
"use strict";
var Lightbox = function (element, options)
{
this.options = options;
this.$element = $(element)
.delegate('[data-dismiss="lightbox"]', 'click.dismiss.lightbox', $.proxy(this.hide, this));
this.options.remote && this.$element.find('.lightbox-body').load(this.options.remote);
}
Lightbox.prototype = $.extend({},$.fn.modal.Constructor.prototype);
Lightbox.prototype.constructor = Lightbox;
Lightbox.prototype.enforceFocus = function ()
{
var that = this;
$(document).on('focusin.lightbox', function (e)
{
if (that.$element[0] !== e.target && !that.$element.has(e.target).length)
{
that.$element.focus();
}
});
};
Lightbox.prototype.show = function()
{
var that = this,
e    = $.Event('show');
this.$element.trigger(e);
if (this.isShown || e.isDefaultPrevented()) return;
this.isShown = true;
this.escape();
this.preloadSize(function()
{
that.backdrop(function ()
{
var transition = $.support.transition && that.$element.hasClass('fade');
if (!that.$element.parent().length)
{
that.$element.appendTo(document.body); //don't move modals dom position
}
that.$element.show();
if (transition)
{
that.$element[0].offsetWidth; // force reflow
}
that.$element
.addClass('in')
.attr('aria-hidden', false);
that.enforceFocus();
transition ?
that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
that.$element.focus().trigger('shown');
});
});
};
Lightbox.prototype.hide = function (e)
{
e && e.preventDefault();
var that = this;
e = $.Event('hide');
this.$element.trigger(e);
if (!this.isShown || e.isDefaultPrevented()) return;
this.isShown = false;
this.escape();
$(document).off('focusin.lightbox');
this.$element
.removeClass('in')
.attr('aria-hidden', true);
$.support.transition && this.$element.hasClass('fade') ?
this.hideWithTransition() :
this.hideModal();
};
Lightbox.prototype.escape = function()
{
var that = this;
if (this.isShown && this.options.keyboard)
{
this.$element.on('keyup.dismiss.lightbox', function ( e )
{
e.which == 27 && that.hide();
});
}
else if (!this.isShown)
{
this.$element.off('keyup.dismiss.lightbox');
}
}
Lightbox.prototype.preloadSize = function(callback)
{
var callbacks = $.Callbacks();
if(callback) callbacks.add( callback );
var that = this;
var windowHeight,
windowWidth,
padTop,
padBottom,
padLeft,
padRight,
$image,
preloader,
originalWidth,
originalHeight;
windowHeight = $(window).height();
windowWidth  = $(window).width();
padTop    = parseInt( that.$element.find('.lightbox-content').css('padding-top')    , 10);
padBottom = parseInt( that.$element.find('.lightbox-content').css('padding-bottom') , 10);
padLeft   = parseInt( that.$element.find('.lightbox-content').css('padding-left')   , 10);
padRight  = parseInt( that.$element.find('.lightbox-content').css('padding-right')  , 10);
$image    = that.$element.find('.lightbox-content').find('img:first');
preloader = new Image();
preloader.onload = function()
{
if( (preloader.width + padLeft + padRight) >= windowWidth)
{
originalWidth = preloader.width;
originalHeight = preloader.height;
preloader.width = windowWidth - padLeft - padRight;
preloader.height = originalHeight / originalWidth * preloader.width;
}
if( (preloader.height + padTop + padBottom) >= windowHeight)
{
originalWidth = preloader.width;
originalHeight = preloader.height;
preloader.height = windowHeight - padTop - padBottom;
preloader.width = originalWidth / originalHeight * preloader.height;
}
that.$element.css({
'position': 'fixed',
'width': preloader.width + padLeft + padRight,
'height': preloader.height + padTop + padBottom,
'top' : (windowHeight / 2) - ( (preloader.height + padTop + padBottom) / 2),
'left' : '50%',
'margin-left' : -1 * (preloader.width + padLeft + padRight) / 2
});
that.$element.find('.lightbox-content').css({
'width': preloader.width,
'height': preloader.height
});
callbacks.fire();
};
preloader.src = $image.attr('src');
};
var old = $.fn.lightbox;
$.fn.lightbox = function (option)
{
return this.each(function ()
{
var $this   = $(this);
var data    = $this.data('lightbox');
var options = $.extend({}, $.fn.lightbox.defaults, $this.data(), typeof option == 'object' && option);
if (!data) $this.data('lightbox', (data = new Lightbox(this, options)));
if (typeof option == 'string')
data[option]();
else if (options.show)
data.show();
});
};
$.fn.lightbox.defaults = {
backdrop: true,
keyboard: true,
show: true
};
$.fn.lightbox.Constructor = Lightbox;
$.fn.lightbox.noConflict = function () {
$.fn.lightbox = old;
return this;
}
$(document).on('click.lightbox.data-api', '[data-toggle*="lightbox"]', function (e)
{
var $this = $(this);
var href  = $this.attr('href');
var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))); //strip for ie7
var option = $target.data('lightbox') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data());
e.preventDefault();
$target
.lightbox(option)
.one('hide', function ()
{
$this.focus();
});
})
}(window.jQuery);
