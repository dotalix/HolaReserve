/*if ('scrollRestoration' in history) {
	history.scrollRestoration = 'manual';
}*/

/*---Scrolling to anchor fixed Navbar---*/
(function (document, history, location) {
	var HISTORY_SUPPORT = !!(history && history.pushState);

	var anchorScrolls = {
		ANCHOR_REGEX: /^#[^ ]+$/,
		OFFSET_HEIGHT_PX: 60 + 30,

		/**
		 * Establish events, and fix initial scroll position if a hash is provided.
		 */
		init: function () {
			this.scrollToCurrent();
			$(window).on('hashchange', $.proxy(this, 'scrollToCurrent'));
			$('body').on('click', 'a', $.proxy(this, 'delegateAnchors'));
		},

		/**
		 * Return the offset amount to deduct from the normal scroll position.
		 * Modify as appropriate to allow for dynamic calculations
		 */
		getFixedOffset: function () {
			return this.OFFSET_HEIGHT_PX;
		},

		/**
		 * If the provided href is an anchor which resolves to an element on the
		 * page, scroll to it.
		 * @param  {String} href
		 * @return {Boolean} - Was the href an anchor.
		 */
		scrollIfAnchor: function (href, pushToHistory, startAnimation) {
			var match, anchorOffset;

			if (!this.ANCHOR_REGEX.test(href)) {
				return false;
			}

			match = document.getElementById(href.slice(1));

			if (match) {

				anchorOffset = $(match).offset().top - this.getFixedOffset();

				if (href.slice(1) == 'main-content') anchorOffset = $(match).offset().top - this.getFixedOffset() + 30;

				if(startAnimation) {
					window.scrollTo(0, anchorOffset);
					if($(window).width() > 1200) {
						$('html, body').animate({ scrollTop: anchorOffset });
					}
					//$(match).focus();
				} else {
					$('html, body').animate({ scrollTop: anchorOffset });
				}

				// Add the state to history as-per normal anchor links
				if (HISTORY_SUPPORT && pushToHistory) {
					history.pushState({}, document.title, location.pathname + href);
					window.location.hash = href;
				}
			}

			return !!match;
		},

		/**
		 * Attempt to scroll to the current location's hash.
		 */
		scrollToCurrent: function (e) {
			if (this.scrollIfAnchor(window.location.hash, false, true) && e) {
				e.preventDefault();
			}
		},

		/**
		 * If the click event's target was an anchor, fix the scroll position.
		 */
		delegateAnchors: function (e) {
			var elem = e.currentTarget;

			if(!elem.getAttribute('href')) return;

			var hrefOrg = elem.getAttribute('href').split('#')[0];
			var hrefAnc = '#'+elem.getAttribute('href').split('#').pop();

			let samePage = (window.location.href.indexOf(hrefOrg) > -1);

			if(samePage){
				if (this.scrollIfAnchor(hrefAnc, true)) {
					e.preventDefault();
				}
			}
		},
	};

	$(document).ready($.proxy(anchorScrolls, 'init'));
	$(window).on('load',$.proxy(anchorScrolls, 'init'));

})(window.document, window.history, window.location);