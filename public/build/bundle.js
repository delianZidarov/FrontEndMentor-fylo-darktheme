
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function xlink_attr(node, attribute, value) {
        node.setAttributeNS('http://www.w3.org/1999/xlink', attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/Navigation.svelte generated by Svelte v3.47.0 */

    const file$8 = "src/components/Navigation.svelte";

    function create_fragment$8(ctx) {
    	let div1;
    	let div0;
    	let a0;
    	let img;
    	let img_src_value;
    	let t0;
    	let nav;
    	let ul;
    	let li0;
    	let a1;
    	let t2;
    	let li1;
    	let a2;
    	let t4;
    	let li2;
    	let a3;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			a1.textContent = "Features";
    			t2 = space();
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "Team";
    			t4 = space();
    			li2 = element("li");
    			a3 = element("a");
    			a3.textContent = "Sign In";
    			if (!src_url_equal(img.src, img_src_value = "./images/logo.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1qai1xl");
    			add_location(img, file$8, 63, 35, 1251);
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "aria-label", "home");
    			attr_dev(a0, "class", "svelte-1qai1xl");
    			add_location(a0, file$8, 63, 4, 1220);
    			attr_dev(div0, "class", "logo svelte-1qai1xl");
    			add_location(div0, file$8, 62, 0, 1196);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "svelte-1qai1xl");
    			add_location(a1, file$8, 67, 9, 1314);
    			add_location(li0, file$8, 67, 4, 1309);
    			attr_dev(a2, "href", "#");
    			attr_dev(a2, "class", "svelte-1qai1xl");
    			add_location(a2, file$8, 68, 9, 1354);
    			add_location(li1, file$8, 68, 4, 1349);
    			attr_dev(a3, "href", "#");
    			attr_dev(a3, "class", "svelte-1qai1xl");
    			add_location(a3, file$8, 69, 9, 1390);
    			add_location(li2, file$8, 69, 4, 1385);
    			attr_dev(ul, "class", "svelte-1qai1xl");
    			add_location(ul, file$8, 66, 0, 1299);
    			attr_dev(nav, "class", "svelte-1qai1xl");
    			add_location(nav, file$8, 65, 0, 1293);
    			attr_dev(div1, "class", "top-banner svelte-1qai1xl");
    			add_location(div1, file$8, 61, 0, 1171);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img);
    			append_dev(div1, t0);
    			append_dev(div1, nav);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(ul, t2);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(ul, t4);
    			append_dev(ul, li2);
    			append_dev(li2, a3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navigation', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navigation> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Navigation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navigation",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    const parseNumber = parseFloat;

    function joinCss(obj, separator = ';') {
      let texts;
      if (Array.isArray(obj)) {
        texts = obj.filter((text) => text);
      } else {
        texts = [];
        for (const prop in obj) {
          if (obj[prop]) {
            texts.push(`${prop}:${obj[prop]}`);
          }
        }
      }
      return texts.join(separator);
    }

    function getStyles(style, size, pull, fw) {
      let float;
      let width;
      const height = '1em';
      let lineHeight;
      let fontSize;
      let textAlign;
      let verticalAlign = '-.125em';
      const overflow = 'visible';

      if (fw) {
        textAlign = 'center';
        width = '1.25em';
      }

      if (pull) {
        float = pull;
      }

      if (size) {
        if (size == 'lg') {
          fontSize = '1.33333em';
          lineHeight = '.75em';
          verticalAlign = '-.225em';
        } else if (size == 'xs') {
          fontSize = '.75em';
        } else if (size == 'sm') {
          fontSize = '.875em';
        } else {
          fontSize = size.replace('x', 'em');
        }
      }

      return joinCss([
        joinCss({
          float,
          width,
          height,
          'line-height': lineHeight,
          'font-size': fontSize,
          'text-align': textAlign,
          'vertical-align': verticalAlign,
          'transform-origin': 'center',
          overflow,
        }),
        style,
      ]);
    }

    function getTransform(
      scale,
      translateX,
      translateY,
      rotate,
      flip,
      translateTimes = 1,
      translateUnit = '',
      rotateUnit = '',
    ) {
      let flipX = 1;
      let flipY = 1;

      if (flip) {
        if (flip == 'horizontal') {
          flipX = -1;
        } else if (flip == 'vertical') {
          flipY = -1;
        } else {
          flipX = flipY = -1;
        }
      }

      return joinCss(
        [
          `translate(${parseNumber(translateX) * translateTimes}${translateUnit},${parseNumber(translateY) * translateTimes}${translateUnit})`,
          `scale(${flipX * parseNumber(scale)},${flipY * parseNumber(scale)})`,
          rotate && `rotate(${rotate}${rotateUnit})`,
        ],
        ' ',
      );
    }

    /* node_modules/svelte-fa/src/fa.svelte generated by Svelte v3.47.0 */
    const file$7 = "node_modules/svelte-fa/src/fa.svelte";

    // (78:0) {#if i[4]}
    function create_if_block(ctx) {
    	let svg;
    	let g1;
    	let g0;
    	let g1_transform_value;
    	let g1_transform_origin_value;
    	let svg_class_value;
    	let svg_viewBox_value;

    	function select_block_type(ctx, dirty) {
    		if (typeof /*i*/ ctx[7][4] == 'string') return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			if_block.c();
    			attr_dev(g0, "transform", /*transform*/ ctx[10]);
    			add_location(g0, file$7, 91, 6, 1469);
    			attr_dev(g1, "transform", g1_transform_value = `translate(${/*i*/ ctx[7][0] / 2} ${/*i*/ ctx[7][1] / 2})`);
    			attr_dev(g1, "transform-origin", g1_transform_origin_value = `${/*i*/ ctx[7][0] / 4} 0`);
    			add_location(g1, file$7, 87, 4, 1358);
    			attr_dev(svg, "id", /*id*/ ctx[0]);
    			attr_dev(svg, "class", svg_class_value = "" + (null_to_empty(/*c*/ ctx[8]) + " svelte-1cj2gr0"));
    			attr_dev(svg, "style", /*s*/ ctx[9]);
    			attr_dev(svg, "viewBox", svg_viewBox_value = `0 0 ${/*i*/ ctx[7][0]} ${/*i*/ ctx[7][1]}`);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$7, 78, 2, 1195);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			if_block.m(g0, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(g0, null);
    				}
    			}

    			if (dirty & /*transform*/ 1024) {
    				attr_dev(g0, "transform", /*transform*/ ctx[10]);
    			}

    			if (dirty & /*i*/ 128 && g1_transform_value !== (g1_transform_value = `translate(${/*i*/ ctx[7][0] / 2} ${/*i*/ ctx[7][1] / 2})`)) {
    				attr_dev(g1, "transform", g1_transform_value);
    			}

    			if (dirty & /*i*/ 128 && g1_transform_origin_value !== (g1_transform_origin_value = `${/*i*/ ctx[7][0] / 4} 0`)) {
    				attr_dev(g1, "transform-origin", g1_transform_origin_value);
    			}

    			if (dirty & /*id*/ 1) {
    				attr_dev(svg, "id", /*id*/ ctx[0]);
    			}

    			if (dirty & /*c*/ 256 && svg_class_value !== (svg_class_value = "" + (null_to_empty(/*c*/ ctx[8]) + " svelte-1cj2gr0"))) {
    				attr_dev(svg, "class", svg_class_value);
    			}

    			if (dirty & /*s*/ 512) {
    				attr_dev(svg, "style", /*s*/ ctx[9]);
    			}

    			if (dirty & /*i*/ 128 && svg_viewBox_value !== (svg_viewBox_value = `0 0 ${/*i*/ ctx[7][0]} ${/*i*/ ctx[7][1]}`)) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(78:0) {#if i[4]}",
    		ctx
    	});

    	return block;
    }

    // (99:8) {:else}
    function create_else_block(ctx) {
    	let path0;
    	let path0_d_value;
    	let path0_fill_value;
    	let path0_fill_opacity_value;
    	let path0_transform_value;
    	let path1;
    	let path1_d_value;
    	let path1_fill_value;
    	let path1_fill_opacity_value;
    	let path1_transform_value;

    	const block = {
    		c: function create() {
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", path0_d_value = /*i*/ ctx[7][4][0]);
    			attr_dev(path0, "fill", path0_fill_value = /*secondaryColor*/ ctx[3] || /*color*/ ctx[1] || 'currentColor');

    			attr_dev(path0, "fill-opacity", path0_fill_opacity_value = /*swapOpacity*/ ctx[6] != false
    			? /*primaryOpacity*/ ctx[4]
    			: /*secondaryOpacity*/ ctx[5]);

    			attr_dev(path0, "transform", path0_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`);
    			add_location(path0, file$7, 99, 10, 1721);
    			attr_dev(path1, "d", path1_d_value = /*i*/ ctx[7][4][1]);
    			attr_dev(path1, "fill", path1_fill_value = /*primaryColor*/ ctx[2] || /*color*/ ctx[1] || 'currentColor');

    			attr_dev(path1, "fill-opacity", path1_fill_opacity_value = /*swapOpacity*/ ctx[6] != false
    			? /*secondaryOpacity*/ ctx[5]
    			: /*primaryOpacity*/ ctx[4]);

    			attr_dev(path1, "transform", path1_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`);
    			add_location(path1, file$7, 105, 10, 1982);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path0, anchor);
    			insert_dev(target, path1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*i*/ 128 && path0_d_value !== (path0_d_value = /*i*/ ctx[7][4][0])) {
    				attr_dev(path0, "d", path0_d_value);
    			}

    			if (dirty & /*secondaryColor, color*/ 10 && path0_fill_value !== (path0_fill_value = /*secondaryColor*/ ctx[3] || /*color*/ ctx[1] || 'currentColor')) {
    				attr_dev(path0, "fill", path0_fill_value);
    			}

    			if (dirty & /*swapOpacity, primaryOpacity, secondaryOpacity*/ 112 && path0_fill_opacity_value !== (path0_fill_opacity_value = /*swapOpacity*/ ctx[6] != false
    			? /*primaryOpacity*/ ctx[4]
    			: /*secondaryOpacity*/ ctx[5])) {
    				attr_dev(path0, "fill-opacity", path0_fill_opacity_value);
    			}

    			if (dirty & /*i*/ 128 && path0_transform_value !== (path0_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`)) {
    				attr_dev(path0, "transform", path0_transform_value);
    			}

    			if (dirty & /*i*/ 128 && path1_d_value !== (path1_d_value = /*i*/ ctx[7][4][1])) {
    				attr_dev(path1, "d", path1_d_value);
    			}

    			if (dirty & /*primaryColor, color*/ 6 && path1_fill_value !== (path1_fill_value = /*primaryColor*/ ctx[2] || /*color*/ ctx[1] || 'currentColor')) {
    				attr_dev(path1, "fill", path1_fill_value);
    			}

    			if (dirty & /*swapOpacity, secondaryOpacity, primaryOpacity*/ 112 && path1_fill_opacity_value !== (path1_fill_opacity_value = /*swapOpacity*/ ctx[6] != false
    			? /*secondaryOpacity*/ ctx[5]
    			: /*primaryOpacity*/ ctx[4])) {
    				attr_dev(path1, "fill-opacity", path1_fill_opacity_value);
    			}

    			if (dirty & /*i*/ 128 && path1_transform_value !== (path1_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`)) {
    				attr_dev(path1, "transform", path1_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path0);
    			if (detaching) detach_dev(path1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(99:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (93:8) {#if typeof i[4] == 'string'}
    function create_if_block_1(ctx) {
    	let path;
    	let path_d_value;
    	let path_fill_value;
    	let path_transform_value;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", path_d_value = /*i*/ ctx[7][4]);
    			attr_dev(path, "fill", path_fill_value = /*color*/ ctx[1] || /*primaryColor*/ ctx[2] || 'currentColor');
    			attr_dev(path, "transform", path_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`);
    			add_location(path, file$7, 93, 10, 1533);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*i*/ 128 && path_d_value !== (path_d_value = /*i*/ ctx[7][4])) {
    				attr_dev(path, "d", path_d_value);
    			}

    			if (dirty & /*color, primaryColor*/ 6 && path_fill_value !== (path_fill_value = /*color*/ ctx[1] || /*primaryColor*/ ctx[2] || 'currentColor')) {
    				attr_dev(path, "fill", path_fill_value);
    			}

    			if (dirty & /*i*/ 128 && path_transform_value !== (path_transform_value = `translate(${/*i*/ ctx[7][0] / -2} ${/*i*/ ctx[7][1] / -2})`)) {
    				attr_dev(path, "transform", path_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(93:8) {#if typeof i[4] == 'string'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[7][4] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*i*/ ctx[7][4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Fa', slots, []);
    	let { class: clazz = '' } = $$props;
    	let { id = '' } = $$props;
    	let { style = '' } = $$props;
    	let { icon } = $$props;
    	let { size = '' } = $$props;
    	let { color = '' } = $$props;
    	let { fw = false } = $$props;
    	let { pull = '' } = $$props;
    	let { scale = 1 } = $$props;
    	let { translateX = 0 } = $$props;
    	let { translateY = 0 } = $$props;
    	let { rotate = '' } = $$props;
    	let { flip = false } = $$props;
    	let { spin = false } = $$props;
    	let { pulse = false } = $$props;
    	let { primaryColor = '' } = $$props;
    	let { secondaryColor = '' } = $$props;
    	let { primaryOpacity = 1 } = $$props;
    	let { secondaryOpacity = 0.4 } = $$props;
    	let { swapOpacity = false } = $$props;
    	let i;
    	let c;
    	let s;
    	let transform;

    	const writable_props = [
    		'class',
    		'id',
    		'style',
    		'icon',
    		'size',
    		'color',
    		'fw',
    		'pull',
    		'scale',
    		'translateX',
    		'translateY',
    		'rotate',
    		'flip',
    		'spin',
    		'pulse',
    		'primaryColor',
    		'secondaryColor',
    		'primaryOpacity',
    		'secondaryOpacity',
    		'swapOpacity'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Fa> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(11, clazz = $$props.class);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('style' in $$props) $$invalidate(12, style = $$props.style);
    		if ('icon' in $$props) $$invalidate(13, icon = $$props.icon);
    		if ('size' in $$props) $$invalidate(14, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('fw' in $$props) $$invalidate(15, fw = $$props.fw);
    		if ('pull' in $$props) $$invalidate(16, pull = $$props.pull);
    		if ('scale' in $$props) $$invalidate(17, scale = $$props.scale);
    		if ('translateX' in $$props) $$invalidate(18, translateX = $$props.translateX);
    		if ('translateY' in $$props) $$invalidate(19, translateY = $$props.translateY);
    		if ('rotate' in $$props) $$invalidate(20, rotate = $$props.rotate);
    		if ('flip' in $$props) $$invalidate(21, flip = $$props.flip);
    		if ('spin' in $$props) $$invalidate(22, spin = $$props.spin);
    		if ('pulse' in $$props) $$invalidate(23, pulse = $$props.pulse);
    		if ('primaryColor' in $$props) $$invalidate(2, primaryColor = $$props.primaryColor);
    		if ('secondaryColor' in $$props) $$invalidate(3, secondaryColor = $$props.secondaryColor);
    		if ('primaryOpacity' in $$props) $$invalidate(4, primaryOpacity = $$props.primaryOpacity);
    		if ('secondaryOpacity' in $$props) $$invalidate(5, secondaryOpacity = $$props.secondaryOpacity);
    		if ('swapOpacity' in $$props) $$invalidate(6, swapOpacity = $$props.swapOpacity);
    	};

    	$$self.$capture_state = () => ({
    		joinCss,
    		getStyles,
    		getTransform,
    		clazz,
    		id,
    		style,
    		icon,
    		size,
    		color,
    		fw,
    		pull,
    		scale,
    		translateX,
    		translateY,
    		rotate,
    		flip,
    		spin,
    		pulse,
    		primaryColor,
    		secondaryColor,
    		primaryOpacity,
    		secondaryOpacity,
    		swapOpacity,
    		i,
    		c,
    		s,
    		transform
    	});

    	$$self.$inject_state = $$props => {
    		if ('clazz' in $$props) $$invalidate(11, clazz = $$props.clazz);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('style' in $$props) $$invalidate(12, style = $$props.style);
    		if ('icon' in $$props) $$invalidate(13, icon = $$props.icon);
    		if ('size' in $$props) $$invalidate(14, size = $$props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('fw' in $$props) $$invalidate(15, fw = $$props.fw);
    		if ('pull' in $$props) $$invalidate(16, pull = $$props.pull);
    		if ('scale' in $$props) $$invalidate(17, scale = $$props.scale);
    		if ('translateX' in $$props) $$invalidate(18, translateX = $$props.translateX);
    		if ('translateY' in $$props) $$invalidate(19, translateY = $$props.translateY);
    		if ('rotate' in $$props) $$invalidate(20, rotate = $$props.rotate);
    		if ('flip' in $$props) $$invalidate(21, flip = $$props.flip);
    		if ('spin' in $$props) $$invalidate(22, spin = $$props.spin);
    		if ('pulse' in $$props) $$invalidate(23, pulse = $$props.pulse);
    		if ('primaryColor' in $$props) $$invalidate(2, primaryColor = $$props.primaryColor);
    		if ('secondaryColor' in $$props) $$invalidate(3, secondaryColor = $$props.secondaryColor);
    		if ('primaryOpacity' in $$props) $$invalidate(4, primaryOpacity = $$props.primaryOpacity);
    		if ('secondaryOpacity' in $$props) $$invalidate(5, secondaryOpacity = $$props.secondaryOpacity);
    		if ('swapOpacity' in $$props) $$invalidate(6, swapOpacity = $$props.swapOpacity);
    		if ('i' in $$props) $$invalidate(7, i = $$props.i);
    		if ('c' in $$props) $$invalidate(8, c = $$props.c);
    		if ('s' in $$props) $$invalidate(9, s = $$props.s);
    		if ('transform' in $$props) $$invalidate(10, transform = $$props.transform);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*icon*/ 8192) {
    			$$invalidate(7, i = icon && icon.icon || [0, 0, '', [], '']);
    		}

    		if ($$self.$$.dirty & /*clazz, spin, pulse*/ 12584960) {
    			$$invalidate(8, c = joinCss([clazz, 'svelte-fa', spin && 'spin', pulse && 'pulse'], ' '));
    		}

    		if ($$self.$$.dirty & /*style, size, pull, fw*/ 118784) {
    			$$invalidate(9, s = getStyles(style, size, pull, fw));
    		}

    		if ($$self.$$.dirty & /*scale, translateX, translateY, rotate, flip*/ 4063232) {
    			$$invalidate(10, transform = getTransform(scale, translateX, translateY, rotate, flip, 512));
    		}
    	};

    	return [
    		id,
    		color,
    		primaryColor,
    		secondaryColor,
    		primaryOpacity,
    		secondaryOpacity,
    		swapOpacity,
    		i,
    		c,
    		s,
    		transform,
    		clazz,
    		style,
    		icon,
    		size,
    		fw,
    		pull,
    		scale,
    		translateX,
    		translateY,
    		rotate,
    		flip,
    		spin,
    		pulse
    	];
    }

    class Fa extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			class: 11,
    			id: 0,
    			style: 12,
    			icon: 13,
    			size: 14,
    			color: 1,
    			fw: 15,
    			pull: 16,
    			scale: 17,
    			translateX: 18,
    			translateY: 19,
    			rotate: 20,
    			flip: 21,
    			spin: 22,
    			pulse: 23,
    			primaryColor: 2,
    			secondaryColor: 3,
    			primaryOpacity: 4,
    			secondaryOpacity: 5,
    			swapOpacity: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Fa",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*icon*/ ctx[13] === undefined && !('icon' in props)) {
    			console.warn("<Fa> was created without expected prop 'icon'");
    		}
    	}

    	get class() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fw() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fw(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pull() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pull(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateX() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateX(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateY() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateY(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotate() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotate(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flip() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flip(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pulse() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pulse(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primaryColor() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primaryColor(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondaryColor() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondaryColor(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primaryOpacity() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primaryOpacity(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondaryOpacity() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondaryOpacity(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get swapOpacity() {
    		throw new Error("<Fa>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set swapOpacity(value) {
    		throw new Error("<Fa>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*!
     * Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com
     * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
     * Copyright 2022 Fonticons, Inc.
     */
    var faFacebookF = {
      prefix: 'fab',
      iconName: 'facebook-f',
      icon: [320, 512, [], "f39e", "M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"]
    };
    var faInstagram = {
      prefix: 'fab',
      iconName: 'instagram',
      icon: [448, 512, [], "f16d", "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"]
    };
    var faTwitter = {
      prefix: 'fab',
      iconName: 'twitter',
      icon: [512, 512, [], "f099", "M459.4 151.7c.325 4.548 .325 9.097 .325 13.65 0 138.7-105.6 298.6-298.6 298.6-59.45 0-114.7-17.22-161.1-47.11 8.447 .974 16.57 1.299 25.34 1.299 49.06 0 94.21-16.57 130.3-44.83-46.13-.975-84.79-31.19-98.11-72.77 6.498 .974 12.99 1.624 19.82 1.624 9.421 0 18.84-1.3 27.61-3.573-48.08-9.747-84.14-51.98-84.14-102.1v-1.299c13.97 7.797 30.21 12.67 47.43 13.32-28.26-18.84-46.78-51.01-46.78-87.39 0-19.49 5.197-37.36 14.29-52.95 51.65 63.67 129.3 105.3 216.4 109.8-1.624-7.797-2.599-15.92-2.599-24.04 0-57.83 46.78-104.9 104.9-104.9 30.21 0 57.5 12.67 76.67 33.14 23.72-4.548 46.46-13.32 66.6-25.34-7.798 24.37-24.37 44.83-46.13 57.83 21.12-2.273 41.58-8.122 60.43-16.24-14.29 20.79-32.16 39.31-52.63 54.25z"]
    };

    /* src/components/Footer.svelte generated by Svelte v3.47.0 */
    const file$6 = "src/components/Footer.svelte";

    function create_fragment$6(ctx) {
    	let div4;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let section0;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let p0;
    	let t3;
    	let img2;
    	let img2_src_value;
    	let t4;
    	let p1;
    	let t6;
    	let img3;
    	let img3_src_value;
    	let t7;
    	let p2;
    	let t9;
    	let section1;
    	let a0;
    	let t11;
    	let a1;
    	let t13;
    	let a2;
    	let t15;
    	let a3;
    	let t17;
    	let section2;
    	let a4;
    	let t19;
    	let a5;
    	let t21;
    	let a6;
    	let t23;
    	let section4;
    	let div1;
    	let a7;
    	let fa0;
    	let t24;
    	let div2;
    	let a8;
    	let fa1;
    	let t25;
    	let div3;
    	let a9;
    	let fa2;
    	let t26;
    	let section3;
    	let current;

    	fa0 = new Fa({
    			props: { icon: faFacebookF, "aria-hidden": "true" },
    			$$inline: true
    		});

    	fa1 = new Fa({
    			props: { icon: faTwitter, "aria-hidden": "true" },
    			$$inline: true
    		});

    	fa2 = new Fa({
    			props: { icon: faInstagram, "aria-hidden": "true" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			section0 = element("section");
    			img1 = element("img");
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et \n  dolore magna aliqua";
    			t3 = space();
    			img2 = element("img");
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "+1-543-123-4567";
    			t6 = space();
    			img3 = element("img");
    			t7 = space();
    			p2 = element("p");
    			p2.textContent = "example@fylo.com";
    			t9 = space();
    			section1 = element("section");
    			a0 = element("a");
    			a0.textContent = "About Us";
    			t11 = space();
    			a1 = element("a");
    			a1.textContent = "Jobs";
    			t13 = space();
    			a2 = element("a");
    			a2.textContent = "Press";
    			t15 = space();
    			a3 = element("a");
    			a3.textContent = "Blog";
    			t17 = space();
    			section2 = element("section");
    			a4 = element("a");
    			a4.textContent = "Contact Us";
    			t19 = space();
    			a5 = element("a");
    			a5.textContent = "Terms";
    			t21 = space();
    			a6 = element("a");
    			a6.textContent = "Privacy";
    			t23 = space();
    			section4 = element("section");
    			div1 = element("div");
    			a7 = element("a");
    			create_component(fa0.$$.fragment);
    			t24 = space();
    			div2 = element("div");
    			a8 = element("a");
    			create_component(fa1.$$.fragment);
    			t25 = space();
    			div3 = element("div");
    			a9 = element("a");
    			create_component(fa2.$$.fragment);
    			t26 = space();
    			section3 = element("section");
    			if (!src_url_equal(img0.src, img0_src_value = "./images/logo.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Fylo");
    			attr_dev(img0, "class", "svelte-170si2w");
    			add_location(img0, file$6, 83, 4, 1915);
    			attr_dev(div0, "class", "footer-logo svelte-170si2w");
    			add_location(div0, file$6, 82, 0, 1885);
    			if (!src_url_equal(img1.src, img1_src_value = "./images/icon-location.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Address");
    			attr_dev(img1, "class", "address svelte-170si2w");
    			add_location(img1, file$6, 86, 8, 2001);
    			add_location(p0, file$6, 87, 12, 2084);
    			if (!src_url_equal(img2.src, img2_src_value = "./images/icon-phone.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Phone");
    			attr_dev(img2, "class", "phone svelte-170si2w");
    			add_location(img2, file$6, 90, 8, 2228);
    			add_location(p1, file$6, 91, 12, 2302);
    			if (!src_url_equal(img3.src, img3_src_value = "./images/icon-email.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Email");
    			attr_dev(img3, "class", "email svelte-170si2w");
    			add_location(img3, file$6, 92, 8, 2333);
    			add_location(p2, file$6, 93, 12, 2407);
    			attr_dev(section0, "class", "container svelte-170si2w");
    			add_location(section0, file$6, 85, 0, 1965);
    			attr_dev(a0, "class", "svelte-170si2w");
    			add_location(a0, file$6, 96, 2, 2478);
    			attr_dev(a1, "class", "svelte-170si2w");
    			add_location(a1, file$6, 97, 2, 2496);
    			attr_dev(a2, "class", "svelte-170si2w");
    			add_location(a2, file$6, 98, 2, 2510);
    			attr_dev(a3, "class", "svelte-170si2w");
    			add_location(a3, file$6, 99, 2, 2525);
    			attr_dev(section1, "class", "links-container svelte-170si2w");
    			add_location(section1, file$6, 95, 0, 2442);
    			attr_dev(a4, "class", "svelte-170si2w");
    			add_location(a4, file$6, 102, 2, 2584);
    			attr_dev(a5, "class", "svelte-170si2w");
    			add_location(a5, file$6, 103, 2, 2604);
    			attr_dev(a6, "class", "svelte-170si2w");
    			add_location(a6, file$6, 104, 2, 2619);
    			attr_dev(section2, "class", "links-container svelte-170si2w");
    			add_location(section2, file$6, 101, 0, 2548);
    			attr_dev(a7, "href", "");
    			attr_dev(a7, "aria-label", "facebook");
    			attr_dev(a7, "class", "svelte-170si2w");
    			add_location(a7, file$6, 108, 4, 2720);
    			attr_dev(div1, "class", "social-icon svelte-170si2w");
    			add_location(div1, file$6, 107, 4, 2690);
    			attr_dev(a8, "href", "");
    			attr_dev(a8, "aria-label", "twitter");
    			attr_dev(a8, "class", "svelte-170si2w");
    			add_location(a8, file$6, 111, 4, 2846);
    			attr_dev(div2, "class", "social-icon svelte-170si2w");
    			add_location(div2, file$6, 110, 4, 2816);
    			attr_dev(a9, "href", "");
    			attr_dev(a9, "aria-label", "instagram");
    			attr_dev(a9, "class", "svelte-170si2w");
    			add_location(a9, file$6, 114, 4, 2969);
    			attr_dev(div3, "class", "social-icon svelte-170si2w");
    			add_location(div3, file$6, 113, 4, 2939);
    			add_location(section3, file$6, 116, 0, 3062);
    			attr_dev(section4, "class", "social-media-container svelte-170si2w");
    			add_location(section4, file$6, 106, 0, 2645);
    			attr_dev(div4, "class", "footer svelte-170si2w");
    			add_location(div4, file$6, 81, 0, 1864);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, img0);
    			append_dev(div4, t0);
    			append_dev(div4, section0);
    			append_dev(section0, img1);
    			append_dev(section0, t1);
    			append_dev(section0, p0);
    			append_dev(section0, t3);
    			append_dev(section0, img2);
    			append_dev(section0, t4);
    			append_dev(section0, p1);
    			append_dev(section0, t6);
    			append_dev(section0, img3);
    			append_dev(section0, t7);
    			append_dev(section0, p2);
    			append_dev(div4, t9);
    			append_dev(div4, section1);
    			append_dev(section1, a0);
    			append_dev(section1, t11);
    			append_dev(section1, a1);
    			append_dev(section1, t13);
    			append_dev(section1, a2);
    			append_dev(section1, t15);
    			append_dev(section1, a3);
    			append_dev(div4, t17);
    			append_dev(div4, section2);
    			append_dev(section2, a4);
    			append_dev(section2, t19);
    			append_dev(section2, a5);
    			append_dev(section2, t21);
    			append_dev(section2, a6);
    			append_dev(div4, t23);
    			append_dev(div4, section4);
    			append_dev(section4, div1);
    			append_dev(div1, a7);
    			mount_component(fa0, a7, null);
    			append_dev(section4, t24);
    			append_dev(section4, div2);
    			append_dev(div2, a8);
    			mount_component(fa1, a8, null);
    			append_dev(section4, t25);
    			append_dev(section4, div3);
    			append_dev(div3, a9);
    			mount_component(fa2, a9, null);
    			append_dev(section4, t26);
    			append_dev(section4, section3);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fa0.$$.fragment, local);
    			transition_in(fa1.$$.fragment, local);
    			transition_in(fa2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fa0.$$.fragment, local);
    			transition_out(fa1.$$.fragment, local);
    			transition_out(fa2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(fa0);
    			destroy_component(fa1);
    			destroy_component(fa2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Fa, faFacebookF, faTwitter, faInstagram });
    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/Signup.svelte generated by Svelte v3.47.0 */

    const file$5 = "src/components/Signup.svelte";

    function create_fragment$5(ctx) {
    	let div1;
    	let form;
    	let h2;
    	let t1;
    	let p0;
    	let t3;
    	let div0;
    	let input;
    	let t4;
    	let p1;
    	let t5;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			form = element("form");
    			h2 = element("h2");
    			h2.textContent = "Get Early access today";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "It only takes a minute to sign up and our free starter tier is extremely generous. If you have any questions, our support team would be happy to help you.";
    			t3 = space();
    			div0 = element("div");
    			input = element("input");
    			t4 = space();
    			p1 = element("p");
    			t5 = space();
    			button = element("button");
    			button.textContent = "Get Started For Free";
    			attr_dev(h2, "class", "svelte-13l44xh");
    			add_location(h2, file$5, 74, 0, 2051);
    			attr_dev(p0, "class", "svelte-13l44xh");
    			add_location(p0, file$5, 75, 0, 2083);
    			attr_dev(input, "type", "email");
    			attr_dev(input, "placeholder", "email@example.com");
    			input.required = true;
    			attr_dev(input, "class", "svelte-13l44xh");
    			add_location(input, file$5, 77, 0, 2251);
    			attr_dev(p1, "class", "svelte-13l44xh");
    			toggle_class(p1, "error", !correctEmailFormat(/*inputValue*/ ctx[0]));
    			add_location(p1, file$5, 78, 0, 2339);
    			attr_dev(button, "class", "svelte-13l44xh");
    			add_location(button, file$5, 79, 0, 2393);
    			attr_dev(div0, "class", "svelte-13l44xh");
    			add_location(div0, file$5, 76, 0, 2245);
    			attr_dev(form, "class", "svelte-13l44xh");
    			add_location(form, file$5, 73, 4, 2044);
    			attr_dev(div1, "class", "signup-container svelte-13l44xh");
    			add_location(div1, file$5, 72, 0, 2009);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, form);
    			append_dev(form, h2);
    			append_dev(form, t1);
    			append_dev(form, p0);
    			append_dev(form, t3);
    			append_dev(form, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*inputValue*/ ctx[0]);
    			append_dev(div0, t4);
    			append_dev(div0, p1);
    			append_dev(div0, t5);
    			append_dev(div0, button);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*inputValue*/ 1 && input.value !== /*inputValue*/ ctx[0]) {
    				set_input_value(input, /*inputValue*/ ctx[0]);
    			}

    			if (dirty & /*correctEmailFormat, inputValue*/ 1) {
    				toggle_class(p1, "error", !correctEmailFormat(/*inputValue*/ ctx[0]));
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function correctEmailFormat(email) {
    	return email.length > 0
    	? email.match(/[a-zA-Z0-9\.]+@[a-z]+\.[a-z]{2,3}/)
    		? true
    		: false
    	: true;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Signup', slots, []);
    	let inputValue = "";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Signup> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		inputValue = this.value;
    		$$invalidate(0, inputValue);
    	}

    	$$self.$capture_state = () => ({ inputValue, correctEmailFormat });

    	$$self.$inject_state = $$props => {
    		if ('inputValue' in $$props) $$invalidate(0, inputValue = $$props.inputValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [inputValue, input_input_handler];
    }

    class Signup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Signup",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/MainSales.svelte generated by Svelte v3.47.0 */

    const file$4 = "src/components/MainSales.svelte";

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let section;
    	let h1;
    	let t2;
    	let p;
    	let t4;
    	let button;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "All your files in one secure location, accessible anywhere.";
    			t2 = space();
    			p = element("p");
    			p.textContent = "Fylo stores all your most important files in one secure location. Access them wherever \n  you need, share and collaborate with friends family, and co-workers.";
    			t4 = space();
    			button = element("button");
    			button.textContent = "Get Started";
    			if (!src_url_equal(img.src, img_src_value = "./images/illustration-intro.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "giant folder with fills coming out");
    			attr_dev(img, "class", "svelte-1kalv97");
    			add_location(img, file$4, 71, 4, 1691);
    			attr_dev(div0, "class", "hero-image svelte-1kalv97");
    			add_location(div0, file$4, 70, 0, 1662);
    			attr_dev(h1, "class", "svelte-1kalv97");
    			add_location(h1, file$4, 74, 0, 1794);
    			attr_dev(p, "class", "svelte-1kalv97");
    			add_location(p, file$4, 75, 0, 1863);
    			attr_dev(button, "class", "btn svelte-1kalv97");
    			add_location(button, file$4, 77, 2, 2032);
    			attr_dev(section, "class", "svelte-1kalv97");
    			add_location(section, file$4, 73, 0, 1784);
    			attr_dev(div1, "class", "main-sales svelte-1kalv97");
    			add_location(div1, file$4, 69, 0, 1637);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div1, t0);
    			append_dev(div1, section);
    			append_dev(section, h1);
    			append_dev(section, t2);
    			append_dev(section, p);
    			append_dev(section, t4);
    			append_dev(section, button);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MainSales', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MainSales> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class MainSales extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainSales",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/SalesPoints.svelte generated by Svelte v3.47.0 */

    const file$3 = "src/components/SalesPoints.svelte";

    function create_fragment$3(ctx) {
    	let section;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let h20;
    	let t2;
    	let p0;
    	let t4;
    	let div1;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let h21;
    	let t7;
    	let p1;
    	let t9;
    	let div2;
    	let img2;
    	let img2_src_value;
    	let t10;
    	let h22;
    	let t12;
    	let p2;
    	let t14;
    	let div3;
    	let img3;
    	let img3_src_value;
    	let t15;
    	let h23;
    	let t17;
    	let p3;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			h20 = element("h2");
    			h20.textContent = "Access your files, anywhere";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "The ability to use a smartphone, tablet, or computer to access your account means your \n  files follow you everywhere.";
    			t4 = space();
    			div1 = element("div");
    			img1 = element("img");
    			t5 = space();
    			h21 = element("h2");
    			h21.textContent = "Security you can trust";
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "2-factor authentication and user-controlled encryption are just a couple of the security \n  features we allow to help secure your files.";
    			t9 = space();
    			div2 = element("div");
    			img2 = element("img");
    			t10 = space();
    			h22 = element("h2");
    			h22.textContent = "Real-time collaboration";
    			t12 = space();
    			p2 = element("p");
    			p2.textContent = "Securely share files and folders with friends, family and colleagues for live collaboration. \n  No email attachments required.";
    			t14 = space();
    			div3 = element("div");
    			img3 = element("img");
    			t15 = space();
    			h23 = element("h2");
    			h23.textContent = "Store any type of file";
    			t17 = space();
    			p3 = element("p");
    			p3.textContent = "Whether you're sharing holidays photos or work documents, Fylo has you covered allowing for all \n  file types to be securely stored and shared.";
    			if (!src_url_equal(img0.src, img0_src_value = "./images/icon-access-anywhere.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			attr_dev(img0, "class", "svelte-11udgtp");
    			add_location(img0, file$3, 40, 8, 864);
    			attr_dev(h20, "class", "svelte-11udgtp");
    			add_location(h20, file$3, 41, 8, 926);
    			attr_dev(p0, "class", "svelte-11udgtp");
    			add_location(p0, file$3, 42, 8, 971);
    			attr_dev(div0, "class", "sales-point svelte-11udgtp");
    			add_location(div0, file$3, 39, 4, 830);
    			if (!src_url_equal(img1.src, img1_src_value = "./images/icon-security.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			attr_dev(img1, "class", "svelte-11udgtp");
    			add_location(img1, file$3, 46, 8, 1146);
    			attr_dev(h21, "class", "svelte-11udgtp");
    			add_location(h21, file$3, 47, 8, 1201);
    			attr_dev(p1, "class", "svelte-11udgtp");
    			add_location(p1, file$3, 48, 8, 1241);
    			attr_dev(div1, "class", "sales-point svelte-11udgtp");
    			add_location(div1, file$3, 45, 4, 1112);
    			if (!src_url_equal(img2.src, img2_src_value = "./images/icon-collaboration.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "");
    			attr_dev(img2, "class", "svelte-11udgtp");
    			add_location(img2, file$3, 52, 8, 1434);
    			attr_dev(h22, "class", "svelte-11udgtp");
    			add_location(h22, file$3, 53, 8, 1494);
    			attr_dev(p2, "class", "svelte-11udgtp");
    			add_location(p2, file$3, 54, 8, 1535);
    			attr_dev(div2, "class", "sales-point svelte-11udgtp");
    			add_location(div2, file$3, 51, 4, 1400);
    			if (!src_url_equal(img3.src, img3_src_value = "./images/icon-any-file.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "");
    			attr_dev(img3, "class", "svelte-11udgtp");
    			add_location(img3, file$3, 58, 8, 1719);
    			attr_dev(h23, "class", "svelte-11udgtp");
    			add_location(h23, file$3, 59, 8, 1774);
    			attr_dev(p3, "class", "svelte-11udgtp");
    			add_location(p3, file$3, 60, 8, 1814);
    			attr_dev(div3, "class", "sales-point svelte-11udgtp");
    			add_location(div3, file$3, 57, 5, 1685);
    			attr_dev(section, "class", "sales-points-container svelte-11udgtp");
    			add_location(section, file$3, 38, 0, 785);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t0);
    			append_dev(div0, h20);
    			append_dev(div0, t2);
    			append_dev(div0, p0);
    			append_dev(section, t4);
    			append_dev(section, div1);
    			append_dev(div1, img1);
    			append_dev(div1, t5);
    			append_dev(div1, h21);
    			append_dev(div1, t7);
    			append_dev(div1, p1);
    			append_dev(section, t9);
    			append_dev(section, div2);
    			append_dev(div2, img2);
    			append_dev(div2, t10);
    			append_dev(div2, h22);
    			append_dev(div2, t12);
    			append_dev(div2, p2);
    			append_dev(section, t14);
    			append_dev(section, div3);
    			append_dev(div3, img3);
    			append_dev(div3, t15);
    			append_dev(div3, h23);
    			append_dev(div3, t17);
    			append_dev(div3, p3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SalesPoints', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SalesPoints> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SalesPoints extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SalesPoints",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /*!
     * Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com
     * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
     * Copyright 2022 Fonticons, Inc.
     */
    var faArrowRight = {
      prefix: 'fas',
      iconName: 'arrow-right',
      icon: [448, 512, [8594], "f061", "M438.6 278.6l-160 160C272.4 444.9 264.2 448 256 448s-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L338.8 288H32C14.33 288 .0016 273.7 .0016 256S14.33 224 32 224h306.8l-105.4-105.4c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160C451.1 245.9 451.1 266.1 438.6 278.6z"]
    };

    /* src/components/Productive.svelte generated by Svelte v3.47.0 */
    const file$2 = "src/components/Productive.svelte";

    function create_fragment$2(ctx) {
    	let section;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div2;
    	let h2;
    	let t2;
    	let p0;
    	let t4;
    	let p1;
    	let t6;
    	let div1;
    	let a;
    	let t8;
    	let svg;
    	let defs;
    	let circle;
    	let filter;
    	let feOffset;
    	let feGaussianBlur;
    	let feColorMatrix;
    	let g1;
    	let g0;
    	let use0;
    	let use1;
    	let path;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div2 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Stay productive, wherever you are";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Never let location be an issue when accessing your files. Fylo has you covered for all of your file \n        storage needs.";
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "Securely share files and folders with friends, family and colleagues for live collaboration. No email \n        attachments required.";
    			t6 = space();
    			div1 = element("div");
    			a = element("a");
    			a.textContent = "See how Fylo works";
    			t8 = space();
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			circle = svg_element("circle");
    			filter = svg_element("filter");
    			feOffset = svg_element("feOffset");
    			feGaussianBlur = svg_element("feGaussianBlur");
    			feColorMatrix = svg_element("feColorMatrix");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			use0 = svg_element("use");
    			use1 = svg_element("use");
    			path = svg_element("path");
    			if (!src_url_equal(img.src, img_src_value = "./images/illustration-stay-productive.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "people working together");
    			attr_dev(img, "class", "svelte-fzr4ip");
    			add_location(img, file$2, 91, 8, 2001);
    			attr_dev(div0, "class", "image-container svelte-fzr4ip");
    			add_location(div0, file$2, 90, 4, 1963);
    			attr_dev(h2, "class", "svelte-fzr4ip");
    			add_location(h2, file$2, 95, 8, 2149);
    			attr_dev(p0, "class", "svelte-fzr4ip");
    			add_location(p0, file$2, 96, 8, 2200);
    			attr_dev(p1, "class", "svelte-fzr4ip");
    			add_location(p1, file$2, 98, 8, 2339);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "svelte-fzr4ip");
    			add_location(a, file$2, 101, 12, 2529);
    			attr_dev(circle, "id", "b");
    			attr_dev(circle, "cx", "6");
    			attr_dev(circle, "cy", "6");
    			attr_dev(circle, "r", "6");
    			add_location(circle, file$2, 102, 124, 2692);
    			attr_dev(feOffset, "in", "SourceAlpha");
    			attr_dev(feOffset, "result", "shadowOffsetOuter1");
    			add_location(feOffset, file$2, 102, 252, 2820);
    			attr_dev(feGaussianBlur, "stdDeviation", "1");
    			attr_dev(feGaussianBlur, "in", "shadowOffsetOuter1");
    			attr_dev(feGaussianBlur, "result", "shadowBlurOuter1");
    			add_location(feGaussianBlur, file$2, 102, 308, 2876);
    			attr_dev(feColorMatrix, "values", "0 0 0 0 0.384313725 0 0 0 0 0.878431373 0 0 0 0 0.850980392 0 0 0 0.811141304 0");
    			attr_dev(feColorMatrix, "in", "shadowBlurOuter1");
    			add_location(feColorMatrix, file$2, 102, 392, 2960);
    			attr_dev(filter, "x", "-25%");
    			attr_dev(filter, "y", "-25%");
    			attr_dev(filter, "width", "150%");
    			attr_dev(filter, "height", "150%");
    			attr_dev(filter, "filterUnits", "objectBoundingBox");
    			attr_dev(filter, "id", "a");
    			add_location(filter, file$2, 102, 160, 2728);
    			add_location(defs, file$2, 102, 118, 2686);
    			attr_dev(use0, "fill", "#000");
    			attr_dev(use0, "filter", "url(#a)");
    			xlink_attr(use0, "xlink:href", "#b");
    			add_location(use0, file$2, 102, 600, 3168);
    			attr_dev(use1, "id", "change-bg");
    			xlink_attr(use1, "xlink:href", "#b");
    			attr_dev(use1, "class", "svelte-fzr4ip");
    			add_location(use1, file$2, 102, 651, 3219);
    			attr_dev(g0, "transform", "translate(2 2)");
    			add_location(g0, file$2, 102, 570, 3138);
    			attr_dev(path, "d", "M8.582 6l-.363.35 1.452 1.4H5.333v.5h4.338L8.22 9.65l.363.35 2.074-2z");
    			attr_dev(path, "fill", "#1B2330");
    			add_location(path, file$2, 102, 693, 3261);
    			attr_dev(g1, "fill", "none");
    			attr_dev(g1, "fill-rule", "evenodd");
    			add_location(g1, file$2, 102, 535, 3103);
    			attr_dev(svg, "width", "16");
    			attr_dev(svg, "height", "16");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			add_location(svg, file$2, 102, 12, 2580);
    			attr_dev(div1, "class", "link-container svelte-fzr4ip");
    			add_location(div1, file$2, 100, 8, 2488);
    			attr_dev(div2, "class", "productivity-description svelte-fzr4ip");
    			add_location(div2, file$2, 94, 4, 2102);
    			attr_dev(section, "class", "productive-container svelte-fzr4ip");
    			add_location(section, file$2, 89, 0, 1920);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(div0, img);
    			append_dev(section, t0);
    			append_dev(section, div2);
    			append_dev(div2, h2);
    			append_dev(div2, t2);
    			append_dev(div2, p0);
    			append_dev(div2, t4);
    			append_dev(div2, p1);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			append_dev(div1, a);
    			append_dev(div1, t8);
    			append_dev(div1, svg);
    			append_dev(svg, defs);
    			append_dev(defs, circle);
    			append_dev(defs, filter);
    			append_dev(filter, feOffset);
    			append_dev(filter, feGaussianBlur);
    			append_dev(filter, feColorMatrix);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, use0);
    			append_dev(g0, use1);
    			append_dev(g1, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Productive', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Productive> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Fa, faArrowRight });
    	return [];
    }

    class Productive extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Productive",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/Testimonials.svelte generated by Svelte v3.47.0 */

    const file$1 = "src/components/Testimonials.svelte";

    function create_fragment$1(ctx) {
    	let section;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div1;
    	let p0;
    	let t2;
    	let div0;
    	let img1;
    	let img1_src_value;
    	let t3;
    	let h20;
    	let t5;
    	let p1;
    	let t7;
    	let div3;
    	let p2;
    	let t9;
    	let div2;
    	let img2;
    	let img2_src_value;
    	let t10;
    	let h21;
    	let t12;
    	let p3;
    	let t14;
    	let div5;
    	let p4;
    	let t16;
    	let div4;
    	let img3;
    	let img3_src_value;
    	let t17;
    	let h22;
    	let t19;
    	let p5;

    	const block = {
    		c: function create() {
    			section = element("section");
    			img0 = element("img");
    			t0 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Fylo has improved our team productivity by an order of magnitude. Since making the switch our team has \n  become a well-oiled collaboration machine.";
    			t2 = space();
    			div0 = element("div");
    			img1 = element("img");
    			t3 = space();
    			h20 = element("h2");
    			h20.textContent = "Satish Pate";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "Founder & CEO, Huddle";
    			t7 = space();
    			div3 = element("div");
    			p2 = element("p");
    			p2.textContent = "Fylo has improved our team productivity by an order of magnitude. Since making the switch our team has \n  become a well-oiled collaboration machine.";
    			t9 = space();
    			div2 = element("div");
    			img2 = element("img");
    			t10 = space();
    			h21 = element("h2");
    			h21.textContent = "Bruce McKenzie";
    			t12 = space();
    			p3 = element("p");
    			p3.textContent = "Founder & CEO, Huddle";
    			t14 = space();
    			div5 = element("div");
    			p4 = element("p");
    			p4.textContent = "Fylo has improved our team productivity by an order of magnitude. Since making the switch our team has \n  become a well-oiled collaboration machine.";
    			t16 = space();
    			div4 = element("div");
    			img3 = element("img");
    			t17 = space();
    			h22 = element("h2");
    			h22.textContent = "Iva Boy";
    			t19 = space();
    			p5 = element("p");
    			p5.textContent = "Founder & CEO, Huddle";
    			if (!src_url_equal(img0.src, img0_src_value = "./images/bg-quotes.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "bg-quotes svelte-1kkmurv");
    			add_location(img0, file$1, 51, 4, 1185);
    			attr_dev(p0, "class", "svelte-1kkmurv");
    			add_location(p0, file$1, 53, 8, 1276);
    			if (!src_url_equal(img1.src, img1_src_value = "./images/profile-1.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Satish Pate");
    			attr_dev(img1, "class", "profile-pic svelte-1kkmurv");
    			add_location(img1, file$1, 56, 12, 1495);
    			attr_dev(h20, "class", "svelte-1kkmurv");
    			add_location(h20, file$1, 57, 12, 1581);
    			attr_dev(p1, "class", "user-description svelte-1kkmurv");
    			add_location(p1, file$1, 58, 12, 1615);
    			attr_dev(div0, "class", "user-information-container svelte-1kkmurv");
    			add_location(div0, file$1, 55, 8, 1442);
    			attr_dev(div1, "class", "testimonial svelte-1kkmurv");
    			add_location(div1, file$1, 52, 4, 1242);
    			attr_dev(p2, "class", "svelte-1kkmurv");
    			add_location(p2, file$1, 62, 8, 1734);
    			if (!src_url_equal(img2.src, img2_src_value = "./images/profile-2.jpg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Bruce Mckenzie");
    			attr_dev(img2, "class", "profile-pic svelte-1kkmurv");
    			add_location(img2, file$1, 65, 12, 1953);
    			attr_dev(h21, "class", "svelte-1kkmurv");
    			add_location(h21, file$1, 66, 12, 2042);
    			attr_dev(p3, "class", "user-description svelte-1kkmurv");
    			add_location(p3, file$1, 67, 12, 2078);
    			attr_dev(div2, "class", "user-information-container svelte-1kkmurv");
    			add_location(div2, file$1, 64, 8, 1900);
    			attr_dev(div3, "class", "testimonial svelte-1kkmurv");
    			add_location(div3, file$1, 61, 4, 1700);
    			attr_dev(p4, "class", "svelte-1kkmurv");
    			add_location(p4, file$1, 71, 8, 2196);
    			if (!src_url_equal(img3.src, img3_src_value = "./images/profile-3.jpg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Iva Boy");
    			attr_dev(img3, "class", "profile-pic svelte-1kkmurv");
    			add_location(img3, file$1, 74, 12, 2415);
    			attr_dev(h22, "class", "svelte-1kkmurv");
    			add_location(h22, file$1, 75, 12, 2497);
    			attr_dev(p5, "class", "user-description svelte-1kkmurv");
    			add_location(p5, file$1, 76, 12, 2526);
    			attr_dev(div4, "class", "user-information-container svelte-1kkmurv");
    			add_location(div4, file$1, 73, 8, 2362);
    			attr_dev(div5, "class", "testimonial svelte-1kkmurv");
    			add_location(div5, file$1, 70, 4, 2162);
    			attr_dev(section, "class", "testimonials-container svelte-1kkmurv");
    			add_location(section, file$1, 50, 0, 1140);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, img0);
    			append_dev(section, t0);
    			append_dev(section, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, img1);
    			append_dev(div0, t3);
    			append_dev(div0, h20);
    			append_dev(div0, t5);
    			append_dev(div0, p1);
    			append_dev(section, t7);
    			append_dev(section, div3);
    			append_dev(div3, p2);
    			append_dev(div3, t9);
    			append_dev(div3, div2);
    			append_dev(div2, img2);
    			append_dev(div2, t10);
    			append_dev(div2, h21);
    			append_dev(div2, t12);
    			append_dev(div2, p3);
    			append_dev(section, t14);
    			append_dev(section, div5);
    			append_dev(div5, p4);
    			append_dev(div5, t16);
    			append_dev(div5, div4);
    			append_dev(div4, img3);
    			append_dev(div4, t17);
    			append_dev(div4, h22);
    			append_dev(div4, t19);
    			append_dev(div4, p5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Testimonials', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Testimonials> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Testimonials extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Testimonials",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.47.0 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let header;
    	let navigation;
    	let t0;
    	let main;
    	let mainsales;
    	let t1;
    	let salespoints;
    	let t2;
    	let productive;
    	let t3;
    	let testimonials;
    	let t4;
    	let div;
    	let signup;
    	let t5;
    	let footer1;
    	let footer0;
    	let current;
    	navigation = new Navigation({ $$inline: true });
    	mainsales = new MainSales({ $$inline: true });
    	salespoints = new SalesPoints({ $$inline: true });
    	productive = new Productive({ $$inline: true });
    	testimonials = new Testimonials({ $$inline: true });
    	signup = new Signup({ $$inline: true });
    	footer0 = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			header = element("header");
    			create_component(navigation.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(mainsales.$$.fragment);
    			t1 = space();
    			create_component(salespoints.$$.fragment);
    			t2 = space();
    			create_component(productive.$$.fragment);
    			t3 = space();
    			create_component(testimonials.$$.fragment);
    			t4 = space();
    			div = element("div");
    			create_component(signup.$$.fragment);
    			t5 = space();
    			footer1 = element("footer");
    			create_component(footer0.$$.fragment);
    			attr_dev(header, "class", "svelte-22loya");
    			add_location(header, file, 28, 0, 690);
    			attr_dev(div, "class", "position-sign-up svelte-22loya");
    			add_location(div, file, 36, 1, 793);
    			attr_dev(main, "class", "svelte-22loya");
    			add_location(main, file, 31, 0, 723);
    			attr_dev(footer1, "class", "svelte-22loya");
    			add_location(footer1, file, 40, 0, 851);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			mount_component(navigation, header, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(mainsales, main, null);
    			append_dev(main, t1);
    			mount_component(salespoints, main, null);
    			append_dev(main, t2);
    			mount_component(productive, main, null);
    			append_dev(main, t3);
    			mount_component(testimonials, main, null);
    			append_dev(main, t4);
    			append_dev(main, div);
    			mount_component(signup, div, null);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, footer1, anchor);
    			mount_component(footer0, footer1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigation.$$.fragment, local);
    			transition_in(mainsales.$$.fragment, local);
    			transition_in(salespoints.$$.fragment, local);
    			transition_in(productive.$$.fragment, local);
    			transition_in(testimonials.$$.fragment, local);
    			transition_in(signup.$$.fragment, local);
    			transition_in(footer0.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation.$$.fragment, local);
    			transition_out(mainsales.$$.fragment, local);
    			transition_out(salespoints.$$.fragment, local);
    			transition_out(productive.$$.fragment, local);
    			transition_out(testimonials.$$.fragment, local);
    			transition_out(signup.$$.fragment, local);
    			transition_out(footer0.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(navigation);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(mainsales);
    			destroy_component(salespoints);
    			destroy_component(productive);
    			destroy_component(testimonials);
    			destroy_component(signup);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(footer1);
    			destroy_component(footer0);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Navigation,
    		Footer,
    		Signup,
    		MainSales,
    		SalesPoints,
    		Productive,
    		Testimonials
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
