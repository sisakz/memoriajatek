(function(){

	// Countdown
	const $dc = $('#day-counter');
	const $time = $dc.find('time');
	const $count = $dc.find('.day-count');
	const evtDate = new Date($time.attr('datetime'));
	function updateDate(){
		const daysRemain = Math.round((evtDate.getTime()-(new Date().getTime()))/1000/60/60/24);
		$count.html(daysRemain);
	}
	// Update days remaining every 10 seconds after page load
	setInterval(updateDate, 10000);
	updateDate();

	// Navbar Click
	const $navbar = $('#navbar');
	$navbar.on('click','a',e => {
		e.preventDefault();

		const hash = $(e.target).attr('href');
		history.replaceState({}, '', hash);
		const $el = $(hash);
		const off = $el.offset();
		const $html = $('html');
		$html.animate({
				scrollTop: off.top,
				scrollLeft: off.left,
		}, 300);
		if (hash === '#sponsors')
			loadSponsors();
	});

	// Navbar Scroll Tracking
	const $cps = $('.checkpoint');
	const $html = $('html');
	$(window).on('scroll', scrl);
	function scrl(){
		const id = $cps.filter(function(){
			return $(this).offset().top - $html.scrollTop() + (window.innerWidth*.1) > 0;
		}).first().attr('id');
		$navbar.find('.active').removeClass('active');
		const hash = `#${id}`;
		$navbar.find(`a[href="${hash}"]`).parent().addClass('active');
		if (window.location.hash !== hash)
		history.replaceState({}, '', hash);
	}
	scrl();

	// Load Sponsors
	function loadSponsors(){
		fetch('sponsors.php')
			.then(r => r.json())
			.then(r => {
				if (!r.success){
					console.error("Could not get sponsor list: "+r.message);
					return;
				}

				const $main = $('#main-sponsors');
				$main.find('div').remove();
				r.main.forEach(el => {
					$main.append($(`<div class="main-sponsor">`).text(el));
				});
				const $skill = $('#skill-sponsors');
				$skill.find('div').remove();
				$.each(r.skill, (k,v) => {
					$skill.append(
							$(`<div class="skill-name">`).text(k),
							$(`<div class="skill-sponsor">`).text(v),
					);
				});
			});
	}
	loadSponsors();

	// Memory Game
	let rounds, $firstPick;
	function newGame(){
		const cards = [10,12,15,17,18,19,20,21,22,23,24,25,28,29,30,31,33,34,35,38,39,40,41,44,49,4,50,51,57];
		const selcards = [];
		for (let i = 0; i < 8; i++)
			selcards.push(cards.splice(Math.floor(Math.random() * (cards.length-1)), 1)[0]);
		const cardsRemain = [].concat(selcards).concat(selcards.map(i => i+'p'));
		const shuffledRemain = [];
		for (let i=0; i<16; i++)
			shuffledRemain.push(cardsRemain.splice(Math.floor(Math.random() * (cardsRemain.length-1)), 1)[0]);
		Array.from(document.querySelectorAll('.game-card')).forEach((el, i) => {
			el.dataset.id = shuffledRemain[i];
			preloadImage(''+shuffledRemain[i]);
		});
		$('.game-card').removeAttr('style');
		$('.game-card.revealed').removeClass('revealed');
		rounds = 0;
		setrounds();

		$firstPick = false;
	}
	const $counter = $('#game-counter span');
	function setrounds(){
		$counter.html(rounds);
	}
	function preloadImage(attr){
		const loader = new Image();
		loader.src = cardurl(attr);
	}
	function cardurl(attr){
		const id = attr.replace(/\D/g,'');
		const type = /p$/.test(attr) ? 'photo' : 'name';
		return `assets/images/skill-cards/skill-card-${id}-${type}.png`;
	}
	function reveal($el){
		return new Promise(res => {
			const attr = $el.attr('data-id');

			$el[0].animate([
				{ transform: 'rotateY(180deg)' },
				{ transform: 'rotateY(90deg)' }
			], {duration: 200}).onfinish = () => {
				$el.css({
					'background-image': `url(${cardurl(attr)})`,
					transform: 'rotateY(90deg)',
				}).addClass('revealed');

				$el[0].animate([
					{ transform: 'rotateY(90deg)' },
					{ transform: 'rotateY(0deg)' }
				], {duration: 200}).onfinish = () => {
					$el.css({
						'background-image': `url(${cardurl(attr)})`,
						transform: 'rotateY(0deg)',
					});
					res();
				}
			}
		});
	}
	function cover($el){
		$el[0].animate([
			{transform: 'rotateY(0deg)'},
			{transform: 'rotateY(90deg)'},
		], {duration: 200}).onfinish = () => {
			$el.css({
				'background-image': '',
				transform: 'rotateY(90deg)',
			});

			$el[0].animate([
				{transform: 'rotateY(90deg)'},
				{transform: 'rotateY(180deg)'},
			], {duration: 200}).onfinish = () => {
				$el.css({
					transform: 'rotateY(180deg)',
				}).removeClass('revealed');
			};
		};
	}
	function sameid($e1, $e2){
		return $e1.attr('data-id').replace(/\D/g,'') === $e2.attr('data-id').replace(/\D/g,'');
	}
	newGame();

	$('#new-game-button').on('click', newGame);

	let waiting = false;
	$('#game-board').on('click','.game-card:not(.revealed)', e => {
		if (waiting)
			return;
		const $trg = $(e.target);
		if (!$firstPick){
				$firstPick = $trg;
				reveal($firstPick);
				return;
		}
		waiting = true;
		reveal($trg).then(() => {
			rounds++;
			setrounds();

			if (sameid($firstPick, $trg)){
				setTimeout(function(){
					$firstPick.fadeTo(200, 0);
					$trg.fadeTo(200, 0);
					$firstPick =
						waiting = false;
				}, 500);
			}
			else {
				setTimeout(function(){
					cover($firstPick);
					cover($trg);
					$firstPick =
						waiting = false;
				}, 1000);
			}
		});
	});
})();