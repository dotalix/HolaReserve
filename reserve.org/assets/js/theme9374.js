$(document).ready(function () {

	////////////
	/// Misc
	////////////

	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	const url = new URL(window.location);

	////////////
	/// Search result
	////////////

	if(params.search){
		var mContext = new Mark(document.getElementById('main-content'));
		mContext.mark(decodeURI(params.search),{separateWordSearch:false});

		$('mark[data-markjs=true]').css('background','inherit').css('padding','inherit'); //.css('display','contents');

		$marks = $('#main-content').find('mark[data-markjs=true]');

		if($marks[0]){
			$($marks[0]).attr('id','s-result');
		}
	}

	////////////
	/// Toggle Theme
	////////////

	//On page load
	if (localStorage.getItem('rsv-theme')) {
		$('body').removeClass('theme-light').removeClass('theme-dark');
		$('body').addClass('theme-' + localStorage.getItem('rsv-theme'));

		if (localStorage.getItem('rsv-theme') == 'dark') {
			$('#theme-switch').prop('checked', true);
		}
	}

	//On switch change
	$('#theme-switch').change(function () {
		if ($(this).is(':checked')) {
			$('body').addClass('theme-dark').removeClass('theme-light');
			localStorage.setItem('rsv-theme', 'dark');
		} else {
			$('body').addClass('theme-light').removeClass('theme-dark');
			localStorage.setItem('rsv-theme', 'light');
		}
	});

	////////////
	/// Toggle Sidenav
	////////////

	$('#btn-sidenav').click(function () {
		$('body').toggleClass('open-sidenav');
	});

	$('.page-content, #top-page-content, footer').click(function () {
		if ($('body').hasClass('open-sidenav')) {
			$('body').toggleClass('open-sidenav');
		}
	});

	$('.dropdown-toggle').dropdown();

	////////////
	/// Toc inner
	////////////

	if(globalToc){
		function makeAnchordLink(str) {
			return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z ]/g, "").replaceAll(' ','-').toLowerCase();
		}

		$nav = $('div.navigation.secondary > ul').get(0);
		$currentPage = $($nav).find('li.active:not(.nav-collapse)').get(0);

		//If the current page does not appear in the navigation
		if(!$currentPage){
			$currentPage = $($nav).find('a[href="./"]').parent('li').removeClass('nav-collapse').addClass('active').get(0);
		}

		$pages = $($nav).find('li:not(.nav-collapse):not(.active)');

		$pages.each(function(index) {
			let pageTitle = $(this).find('a').text();
			let pageUrl = $(this).find('a').attr('href');
			let pageUrlAt = $(this).find('a').attr('data-url');

			let tocItems = globalToc.filter(tocI => tocI.url == pageUrlAt);

			//onsole.log(tocItems);
			//mkRLang
			//let tocItems = globalToc[mkRLang.toUpperCase()+'<lang>'+pageTitle];

			if(tocItems[0]){
				tocItems = tocItems[0].items;
			} else {
				tocItems = false
			}

			if(tocItems){
				$(this).addClass('nav-collapse');
				$(this).append('<ul></ul>');

				$currentList = $(this).find('ul').get(0);

				tocItems.forEach(element => {
					$($currentList).append(`<li><a href="${pageUrl}#${makeAnchordLink(element)}" title="${element}">${element}</a></li>`)
				});
			}
		})

		$('.nav-collapse > a').append('<span></span>');

		$($currentPage).append('<div id="spy-sec" class="inner-links"><ul id="section-links" role="tablist" style="padding-top: 0px !important;"></ul></div>');

		let tocs = $('.toc-item').each(function (i, e) {
			let title = $(e).text().replace('¶', '');
			let link = $(e).attr('id');
			$($currentPage).find('#section-links').append('<li><a index="' + i + '" href="#' + link + '">' + title + '</a></li>');
		});

		if (tocs.length == 0) {
			$('#spy-sec').hide();
		}

		setTimeout(function(){
			if(window.location.pathname != '/protocol/' && window.location.pathname != '/about/' && window.location.pathname != '/about_app/'){
				if($(window).width() > 1200){
					anchorOffset = $($currentPage).position().top - 22;
					$('.navigation-wrapper').animate({ scrollTop: anchorOffset });
				} else {
					anchorOffset = $($currentPage).position().top - 80;
					$('.navigation-wrapper').get(0).scrollTo(0, anchorOffset);
				}
			}
		},0)
	}

	////////////
	/// Scrollspy
	////////////

	// Variables
	const $window = $(window);
	const $links = $('.inner-links > ul > li > a');
	const $sections = getSections($links);

	// Functions
	function getSections($links) {
		return $(
            $links
				.map((i, el) => $(el).attr('href'))
				.toArray()
				.filter((href) => href.charAt(0) === '#')
				.join(',')
		);
	}

	function activateLink($sections, $links) {
		const yPosition = $window.scrollTop() + 64;

		for (let i = $sections.length - 1; i >= 0; i -= 1) {
			const $section = $sections.eq(i);

			if (yPosition >= $section.offset().top - 64) {
				let active = $links
					.removeClass('active')
					.filter(`[href="#${$section.attr('id')}"]`)
					.addClass('active');

				let root = document.documentElement;

                let linkItem = $links.filter(`[href="#${$section.attr('id')}"]`).parent();

                let offset = ((($(linkItem[0]).height() / 2) + $(linkItem[0]).position().top) - 4) + 'px';

                root.style.setProperty('--spy-offset', offset);

                return active;
            }
		}
	}

	var videos = null;

	function onScrollHandler(event = false) {

		if ($(window).width() > 1200){
			$('#top').removeClass('open-sidenav');

			//home videos
			try {
				if((!event || (event.type != 'scroll')) && (videos != 'desktop')){
					videos = 'desktop';
					$('#home-lt-animation').html(`<video class="vid-desktop" id='dk-vid' preload="none" playsinline autoplay loop muted src="/assets/img/pages/home/1-1.mp4"></video>`);
					document.getElementById("dk-vid").play();
				}
			} catch (error) { }
		} else {
			try {
				if((!event || (event.type != 'scroll')) && (videos != 'mobile')){
					videos = 'mobile';
					$('#home-lt-animation').html(`<video class="vid-mobile" id='mb-vid' preload="none" playsinline autoplay loop muted src="/assets/img/pages/home/4-5.mp4"></video>`);
					document.getElementById("mb-vid").play();
				}
			} catch (error) { }
		}

		activateLink($sections, $links);
		let scrollBarWidth = 17;

		if ($('#top-page-content')) {
			let f = $('#top-page-content').height() - $window.scrollTop();

			if (f >= 0 && $(window).width() + scrollBarWidth > 1200) {
				$('#lang-drop').css('margin-top', f);
				$('#switch-theme').css('margin-top', f);
				return;
			} else {
				$('#lang-drop').css('margin-top', '');
				$('#switch-theme').css('margin-top', '');
			}
		}

		let contentHeight = $('main').height() + ($('#top-page-content').height() || 0);
		let calc = contentHeight - 128;

		if ($window.scrollTop() >= calc && $(window).width() + scrollBarWidth > 1200) {
			let a = calc;
			let b = $window.scrollTop();
			let c = b - a;

			$('#lang-drop').css('margin-top', -c);
			$('#switch-theme').css('margin-top', -c);
		} else {
			$('#lang-drop').css('margin-top', '');
			$('#switch-theme').css('margin-top', '');
		}
	}

	////////////
	/// Lang Selector
	////////////

	$('.lang-item').click(function (event) {
		let lang = $(this).attr('data-lang');
		let newPath = curServ + '/' + lang + '/' + curPath;
		window.location.href = newPath;
	});

	////////////
	/// Bootstrap - Tooltips
	////////////

	$(function () {
		$('[data-toggle="tooltip"]').tooltip();
	});

	/*$(window).on('scroll', function () {
        if($(window).width() < 1201) {
            $('[data-toggle="tooltip"]').tooltip('hide');
        }
	});*/

	////////////
	/// Header Logo route Fix
	////////////

    let indexRoute = '/';

    if(window.location.pathname.includes('/es/')) {
        indexRoute = '/es/';
    }

    $('.header-logo').attr('href',indexRoute);

	////////////
	/// Docs Navigation accordion
	////////////

    $docsNav = $('.navigation.secondary ul > li');

    /*$docsNav.each(function(){
        if($(this).find('ul').length != 0){
            $(this).addClass('nav-collapse');
        }
    })*/

    $('.nav-collapse > a > span').click(function(e){
		e.preventDefault();
		$parent = $(this).parent('a').get(0);

        if($($parent).hasClass('nav-show')){
            $($parent).toggleClass('nav-show');
        } else {
            $($parent).toggleClass('nav-show');
        }
    })

    $('.navigation.secondary ul > li').find('a[href="./"').parents('li').addClass('active').find('> a').addClass('nav-show');
	$('.navigation.secondary ul > li').find('a').parents('li').find('> a').addClass('nav-show');

	////////////
	/// Header Navigation
	////////////

	$headerLinks = $('#top_navigation > li a');

	$headerLinks.each(function(){
        let fooRe = new RegExp('(https:/)+\\w', 'gim');
        let link = $(this).attr('href');

        if(link){
            let newLink = link.replace('https:/','https://');
            $(this).attr('href', newLink);
        }
    });

	////////////
	/// Footer Navigation
	////////////

    $footerNav = $('footer ul > li');
 
    $footerNav.each(function(){
        if($(this).find('ul').length != 0){
            $(this).addClass('categ');
        }
    })

    $footerLinks = $('footer li a');

    $footerLinks.each(function(){
        let fooRe = new RegExp('(https:/)+\\w', 'gim');
        let link = $(this).attr('href');

        if(link){
            let newLink = link.replace('https:/','https://'); //+'#main-content';
            $(this).attr('href', newLink);
        }
    })

    ////////////
	/// Docs Navigation - Anchor
	////////////

    $docsNav = $('.navigation.secondary ul li a');

    $docsNav.each(function(){
        let link = $(this).attr('href');

        if(link){
            //newLink = link+'#main-content';
            //$(this).attr('href', newLink);
        }
    })

	////////////
	/// Misc
	////////////

    /// Activate main nav item
    if(typeof activeNavItem !== 'undefined'){
        if(activeNavItem != null){
            $ele = $('#top_navigation').find('li')[activeNavItem];
            $($ele).addClass('active');
        }
    }

	$('#lang-drop, #switch-theme').removeClass('hide');

	$window.on('scroll', onScrollHandler);
	$window.on('resize', onScrollHandler);

	onScrollHandler();

    $('#fake-lang').hide();

	$.expr[':'].external = function(obj){
		return !obj.href.match(/^mailto\:/) && (obj.hostname != location.hostname)
	};

	$('a:external').attr('target', '_blank');

	$('a[href]').each(function(){
		if($(this).attr('href').includes('/assets/files/') && !$(this).attr('target')) {
			$(this).attr('target','_blank');
			$(this).click();
		}
	})

	////////////
	/// Search
	////////////

	searchIndex = [...new Map(searchIndex.map((item) => [item["url"], item])).values()];

	if (window.location.pathname.includes('/es/')) {
		searchIndex = searchIndex.filter(e => e.url.startsWith('es/'));
	} else if (window.location.pathname.includes('/en/')) {
		searchIndex = searchIndex.filter(e => e.url.startsWith('en/'));
	} else {
		searchIndex = searchIndex.filter(e => !e.url.startsWith('en/') && !e.url.startsWith('es/'));
	}

	const truncate = function(str, n, useWordBoundary){
		if (str.length <= n) { return str; }
		const subString = str.slice(0, n-1); // the original check
		return (useWordBoundary
			? subString.slice(0, subString.lastIndexOf(" "))
			: subString) + "&hellip;";
	};

	const makeResult = function(query, result) {
		let html = `
			<a href="/${result.url}?search=${encodeURIComponent(query)}#s-result">
				<h6>${result.title}</h6>
				${getSentencesWithWord(query, result.content)}
			</a>
		`;

		return html;
	}

	const getSentencesWithWord = function(word, text) {

		//console.log(word);
		//console.log(text);

		// Search for sentences, insert a pipe, then split on the pipe
		let sentenceArray =
		text.replaceAll(' ¶ ','.')
		.replaceAll('¶ ','.')
		.replaceAll(' ¶','.')
		.replaceAll('¶','.')
		.replaceAll('\n',' ')
		.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");

		// Filter our array by checking if each sentence includes the word, then immedietly returns it
		sentenceArray = sentenceArray.filter(sentence => {
			let words = word.trim().split(' ');
			let coincidence = false;

			/*words.forEach(e => {
				if (sentence.toLowerCase().includes(e.toLowerCase())) coincidence = true;
			});*/

			if (sentence.toLowerCase().includes(word.trim().toLowerCase())) coincidence = true;

			return coincidence;
		});

		let output = '';
		sentenceArray.slice(0, 2).forEach(match => output += truncate(match, 80, true) + '<br>');

		if(sentenceArray[0]) {
			return '<p>'+output+'</p>'
		} else {
			return '';
		}
	}
	  
	let miniSearch = new MiniSearch({
		idField: 'url',
		fields: ['title', 'content'],
		storeFields: ['title', 'url', 'content']
	})

	miniSearch.addAll(searchIndex);
	
	$('.inputWrapper #searchBox').on("keyup", function(e) {
		$(this).val($(this).val().trimStart());
		let input = $(this).val().trim().toLowerCase();
		let rawInput = $(this).val().trim();

		if(input.length > 0){
			let results = miniSearch.search(input, { fuzzy: 0.2 });
			let suggestion = miniSearch.autoSuggest(input);

			if(suggestion[0]){
				$(this).parent().find('#suggetsBox').val(suggestion[0].terms[0].replace(input,rawInput));
			} else {
				$(this).parent().find('#suggetsBox').val('');
			}

			if (results.length > 0) {
				outPutResults = '';
				results.slice(0, 5).forEach(e => outPutResults += makeResult(input,e))
				$(this).parents('.searchWrapper').find('#searchResult').html(outPutResults);
				var mContext = new Mark($(this).parents('.searchWrapper').find('#searchResult').get(0));
				mContext.mark(input);
			} else {
				$(this).parents('.searchWrapper').find('#searchResult').html('');
			}
		} else {
			$(this).parent().find('#searchResult').html('');
			$(this).parent().find('#suggetsBox').val('');
		}

		$(this).parents('.navigation-wrapper').addClass('showSearch');
	});

	$('.inputWrapper #searchBox').focusin(function(e) {
		$(this).parents('.navigation-wrapper').addClass('showSearch');
	})

	window.addEventListener('click', function(e){   
		if($('.searchWrapper').length > 0) {
			
			let find = $('.searchWrapper').find(e.target).get(0);

			if(!find){
				$('.navigation-wrapper').removeClass('showSearch');
			}
		}
	});

	$('#searchIcon').click(function(){
		$('#searchBox').click();
	})
});
