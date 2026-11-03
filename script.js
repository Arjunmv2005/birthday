(() => {
  const $ = (selector) => document.querySelector(selector);
  const welcome = $('#welcome');
  const site = $('#site');
  const audio = $('#bgm');
  const petals = $('#petals');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Add or edit gallery items here. Dates are intentionally left generic until Arjun adds the real ones.
  const memories = [
    { photo: 'memory-06.jpg', caption: 'My favourite place is wherever you are.', kicker: 'MY FAVOURITE VIEW', date: 'just us, out in the world' },
    { photo: 'memory-07.jpg', caption: 'You make even an ordinary day feel like a story.', kicker: 'THE WAY YOU LOOK AT ME', date: 'one of our lovely days' },
    { photo: 'memory-08.jpg', caption: 'Proof that my favourite thing is doing nothing beside you.', kicker: 'SIDE BY SIDE', date: 'a little moment I keep close' },
    { photo: 'memory-09.jpg', caption: 'A little sunshine, a little breeze, and a lot of you.', kicker: 'A DAY OUT TOGETHER', date: 'one for the memory book' },
    { photo: 'memory-05.jpg', caption: 'Your smile could outshine every light in the room.', kicker: 'THAT SMILE THOUGH', date: 'my heart, every time' },
    { photo: 'memory-10.jpg', caption: 'Every look, every laugh, every version of you.', kicker: 'BEAUTIFUL, ALWAYS', date: 'always my favourite' },
    { photo: 'memory-04.jpg', caption: 'Sharing a snack with you is still one of my best plans.', kicker: 'THE LITTLE THINGS', date: 'sweetness, shared' },
    { photo: 'memory-01.jpg', caption: 'And every new side of you gives me another reason to smile.', kicker: 'MY ADVENTURE GIRL', date: 'always cheering you on' },
    { photo: 'memory-02.jpg', caption: 'One little photo, an entire day of me missing you.', kicker: 'YOU, JUST BEING YOU', date: 'a moment worth keeping' },
    { photo: 'memory-03.jpg', caption: 'You bring a little extra sparkle wherever you go.', kicker: 'THAT LOVELY ENERGY', date: 'one for the memory book' }
  ];

  $('#open-surprise').addEventListener('click', async () => {
    site.inert = false;
    site.classList.add('visible');
    document.documentElement.classList.add('unlocked');
    welcome.classList.add('depart');
    audio.volume = 0.55;
    try {
      await audio.play();
      $('#sound-label').textContent = 'Sound on';
      $('#sound-toggle').setAttribute('aria-label', 'Pause background music');
    } catch (_) {
      $('#sound-label').textContent = 'Tap for sound';
      $('#sound-toggle').setAttribute('aria-label', 'Play background music');
    }
    setTimeout(() => { welcome.hidden = true; $('#home').scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' }); }, 1150);
  });

  $('#sound-toggle').addEventListener('click', async () => {
    if (audio.paused) {
      try { await audio.play(); } catch (_) { /* The browser will keep the sound paused if playback is unavailable. */ }
    } else audio.pause();
    const playing = !audio.paused;
    $('#sound-label').textContent = playing ? 'Sound on' : 'Sound off';
    $('#sound-toggle').setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
  });

  let memoryIndex = 0;
  const frame = $('.memory-frame');
  memories.forEach((memory, i) => {
    const dot = document.createElement('button');
    dot.type = 'button'; dot.className = 'memory-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Show memory ${i + 1}`);
    dot.addEventListener('click', () => showMemory(i));
    $('#memory-dots').append(dot);
  });
  function showMemory(index) {
    memoryIndex = (index + memories.length) % memories.length;
    const memory = memories[memoryIndex];
    frame.classList.add('swap');
    setTimeout(() => {
      $('#memory-photo').src = `photos/${memory.photo}`;
      $('#memory-caption').textContent = memory.caption;
      $('#memory-kicker').textContent = memory.kicker;
      $('#memory-date').textContent = memory.date;
      frame.classList.remove('swap');
      [...$('#memory-dots').children].forEach((dot, i) => dot.classList.toggle('active', i === memoryIndex));
    }, 180);
  }
  $('#prev-photo').addEventListener('click', () => showMemory(memoryIndex - 1));
  $('#next-photo').addEventListener('click', () => showMemory(memoryIndex + 1));
  let touchStart = 0;
  frame.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
  frame.addEventListener('touchend', (event) => {
    const delta = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 48) showMemory(memoryIndex + (delta < 0 ? 1 : -1));
  }, { passive: true });

  const letter = `Happy birthday to the loveliest person in my world.\n\nNammu, you make ordinary days softer and good days unforgettable. I love your laugh, your kindness, the way you make a place feel like home just by being in it. I hope this new year of your life gives back all the joy you bring to the people who love you.\n\nThank you for being you, and for letting me be beside you. Wherever life takes us, I will always be cheering for you, choosing you, and finding new reasons to fall for you.\n\nToday is yours, my love. Make the biggest wish. You deserve every beautiful thing.`;
  const letterBody = $('#letter-body');
  let typing = false;
  $('#read-letter').addEventListener('click', () => {
    if (typing) return;
    if (letterBody.dataset.complete === 'true') {
      letterBody.textContent = letter;
      return;
    }
    typing = true;
    $('#read-letter').textContent = 'A little love, line by line…';
    let position = 0;
    const speed = reducedMotion ? 1 : 25;
    const type = () => {
      position = Math.min(position + 3, letter.length);
      letterBody.textContent = letter.slice(0, position);
      if (position < letter.length) setTimeout(type, speed);
      else {
        typing = false;
        letterBody.dataset.complete = 'true';
        $('#letter-signoff').classList.add('show');
        $('#read-letter').textContent = 'Read it again ♡';
      }
    };
    type();
  });

  const tabs = [...document.querySelectorAll('.game-tab')];
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    tabs.forEach((item) => item.classList.toggle('active', item === tab));
    $('#catch-game').classList.toggle('hidden', tab.dataset.game !== 'catch');
    $('#match-game').classList.toggle('hidden', tab.dataset.game !== 'match');
  }));

  let caught = 0, heartTimer = null, heartTimeout = null, catchRunning = false;
  const field = $('#heart-field');
  function endCatch(won) {
    catchRunning = false; clearInterval(heartTimer); clearTimeout(heartTimeout);
    document.querySelectorAll('.catch-heart').forEach((heart) => heart.remove());
    $('#start-catch').hidden = false;
    $('#start-catch').textContent = 'Play again ↻';
    $('#catch-message').textContent = won ? 'You caught every heart. Lucky me. ♡' : 'That was close! My heart is easy to catch—try again. ♡';
  }
  $('#start-catch').addEventListener('click', () => {
    if (catchRunning) return;
    catchRunning = true; caught = 0;
    $('#catch-score').textContent = '0 / 7 hearts';
    $('#catch-message').textContent = '';
    $('#start-catch').hidden = true;
    const hint = field.querySelector('.field-hint'); if (hint) hint.remove();
    const dropHeart = () => {
      if (!catchRunning) return;
      const heart = document.createElement('button');
      heart.type = 'button'; heart.className = 'catch-heart'; heart.textContent = '♥'; heart.setAttribute('aria-label', 'Catch this heart');
      heart.style.left = `${7 + Math.random() * 82}%`;
      heart.style.top = `${10 + Math.random() * 67}%`;
      heart.addEventListener('click', () => {
        if (!catchRunning) return;
        caught++; $('#catch-score').textContent = `${caught} / 7 hearts`;
        heart.remove();
        if (caught >= 7) endCatch(true);
      }, { once: true });
      field.append(heart);
      setTimeout(() => heart.remove(), 1500);
    };
    dropHeart(); heartTimer = setInterval(dropHeart, 740);
    heartTimeout = setTimeout(() => endCatch(caught >= 7), 12000);
  });

  const matchSymbols = ['🌷', '🍓', '🦋', '🌙', '🍰', '💌'];
  let firstCard = null, locked = false, matchedPairs = 0;
  function newMatchGame() {
    firstCard = null; locked = false; matchedPairs = 0;
    $('#match-count').textContent = '0 / 6 pairs';
    $('#match-message').textContent = '';
    const cards = [...matchSymbols, ...matchSymbols].sort(() => Math.random() - .5);
    const grid = $('#match-grid'); grid.replaceChildren();
    cards.forEach((symbol) => {
      const card = document.createElement('button');
      card.type = 'button'; card.className = 'match-card'; card.textContent = '♡';
      card.setAttribute('aria-label', 'Hidden card');
      card.dataset.symbol = symbol;
      card.addEventListener('click', () => {
        if (locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
        card.classList.add('flipped'); card.textContent = symbol; card.setAttribute('aria-label', symbol);
        if (!firstCard) { firstCard = card; return; }
        if (firstCard.dataset.symbol === card.dataset.symbol) {
          firstCard.classList.add('matched'); card.classList.add('matched'); firstCard = null;
          matchedPairs++; $('#match-count').textContent = `${matchedPairs} / 6 pairs`;
          if (matchedPairs === 6) $('#match-message').textContent = 'Every pair found its person. Just like us. ♡';
        } else {
          locked = true; const previous = firstCard; firstCard = null;
          setTimeout(() => {
            previous.classList.remove('flipped'); card.classList.remove('flipped');
            previous.textContent = card.textContent = '♡'; locked = false;
          }, 720);
        }
      });
      grid.append(card);
    });
  }
  $('#reset-match').addEventListener('click', newMatchGame);
  newMatchGame();

  function confettiHearts() {
    const symbols = ['♥', '♡', '✿', '✧'];
    for (let i = 0; i < 34; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart'; heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.bottom = '-6vh';
      heart.style.fontSize = `${12 + Math.random() * 19}px`;
      heart.style.animationDuration = `${4 + Math.random() * 4}s`;
      heart.style.animationDelay = `${Math.random() * 1.1}s`;
      petals.append(heart); setTimeout(() => heart.remove(), 9500);
    }
  }
  $('#last-surprise').addEventListener('click', () => {
    $('#last-reveal').classList.add('show');
    $('#last-surprise').textContent = 'I Love You, Namratha ♡';
    confettiHearts();
  });

  if (!reducedMotion) {
    const floatSymbols = ['♡', '♥', '✧'];
    setInterval(() => {
      if (document.hidden) return;
      const heart = document.createElement('span');
      heart.className = 'floating-heart'; heart.textContent = floatSymbols[Math.floor(Math.random() * floatSymbols.length)];
      heart.style.left = `${Math.random() * 98}%`; heart.style.bottom = '-8vh';
      heart.style.fontSize = `${11 + Math.random() * 13}px`; heart.style.animationDuration = `${9 + Math.random() * 8}s`;
      petals.append(heart); setTimeout(() => heart.remove(), 18000);
    }, 1900);
  }
})();
