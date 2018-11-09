(function (window, $) {
	'use strict';

	// Cache document for fast access.
	var document = window.document;
	var availableLetters, numberofround=0, words, tasks, guessInput, guess, guessButton, lettersGuessed, lettersMatched, output, man, letters, lives, currentWord, numLettersMatched, messages;

	function setup() {
	        /* start config options */
	        availableLetters = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя_";
	        lives = 50;
	        words = ["бекас", "бенефиций", "камуфляж", "бухарский_эмират", "килт"];
					tasks = ["Термин «снайпер» имеет британское происхождение. По-английски ЭТА небольшая птичка называется snipe. Камуфляжная окраска ее оперения, малые размеры и сложные траектории полета делали ее крайне сложной добычей. Тех, кому удавалось подстрелить заветную птицу из обычного кремниевого ружья, называли снайперами." ,
					 "В Средние века так называлось условное срочное пожалование (преимущественно в виде земельного участка) за выполнение военной службы" ,
					 "Книга американского художника Эббота Тайера о мире животных, попав в руки военных, подарила жизнь ЭТОМУ неотъемлимому аспекту военного дела." ,
					 "В середине XIX века солдаты армии ЭТОГО государства «подсмотрели» у российских солдат «тайный обряд», приносящий победу. Во время штурма одной высоты русской пехоте пришлось форсировать реку, а поскольку все происходило очень быстро, времени на то, чтобы вылить воду из сапог у солдат не оказалось. Тогда каждый из них схватил товарища за ноги, перевернул и потряс. Высота была захвачена, а вот начало следующей битвы поразило всех присутствующих. На глазах изумленных русских солдаты тщательно трясли своих перевернутых однополчан за ноги, видимо, чтобы приманить удачу." ,
					 "В современных вооружённых силах Британского содружества ЭТОТ предмет используется в основном во время смотров и парадов. А до II мировой войны использовался постоянно."]
	        messages = {
	            win: 'You win!',
	            lose: 'Game over!',
	            guessed: ' уже была, мудила...',
	            validLetter: 'Введи норм букву, а то че это такое'
	        };
	        /* end config options */

	        lettersGuessed = lettersMatched = '';
	        numLettersMatched = 0;

	        /* choose a word
					numberofround=Math.floor(Math.random() * words.length)    */
	        currentWord = words[numberofround];

	        /* make #man and #output blank, create vars for later access */
	        output = document.getElementById("output");
	        man = document.getElementById("man");
	        guessInput = document.getElementById("letter");

	        man.innerHTML = '';
	        output.innerHTML = '';

	        document.getElementById("letter").value = '';

	        /* make sure guess button is enabled */
	        guessButton = document.getElementById("guess");
	        guessInput.style.display = 'inline';
	        guessButton.style.display = 'inline';

	        /* set up display of letters in current word */
	        letters = document.getElementById("letters");
	        letters.innerHTML = '<h4><b>Задание на тур:</b></h4><li class="current-word"><h5>' + tasks[numberofround] + '</h5></li>';

	        var letter, i;
	        for (i = 0; i < currentWord.length; i++) {
	            letter = '<li class="letter letter' + currentWord.charAt(i).toUpperCase() + '">' + currentWord.charAt(i).toUpperCase() + '</li>';
	            letters.insertAdjacentHTML('beforeend', letter);
	        }
	    }

	    function gameOver(win) {
	        if (win) {
	            output.innerHTML = messages.win;
	            output.classList.add('win');
	        } else {
	            output.innerHTML = messages.lose;
	            output.classList.add('error');
	        }

	        guessInput.style.display = guessButton.style.display = 'none';
	        guessInput.value = '';
	    }

	    /* Start game - should ideally check for existing functions attached to window.onload */
	    window.onload = setup();

	    /* buttons */
	    document.getElementById("round1").onclick = function () {numberofround=0; setup();}
			document.getElementById("round2").onclick = function () {numberofround=1; setup();}
			document.getElementById("round3").onclick = function () {numberofround=2; setup();}
			document.getElementById("round4").onclick = function () {numberofround=3; setup();}
			document.getElementById("round5").onclick = function () {numberofround=4; setup();}

	    /* reset letter to guess on click */
	    guessInput.onclick = function () {
	        this.value = '';
	    };

	    /* main guess function when user clicks #guess */
	    document.getElementById('hangman').onsubmit = function (e) {
	        if (e.preventDefault) e.preventDefault();
	        output.innerHTML = '';
	        output.classList.remove('error', 'warning');
	        guess = guessInput.value;

	        /* does guess have a value? if yes continue, if no, error */
	        if (guess) {
	            /* is guess a valid letter? if so carry on, else error */
	            if (availableLetters.indexOf(guess) > -1) {
	                /* has it been guessed (missed or matched) already? if so, abandon & add notice */
	                if ((lettersMatched && lettersMatched.indexOf(guess) > -1) || (lettersGuessed && lettersGuessed.indexOf(guess) > -1)) {
	                    output.innerHTML = '"' + guess.toUpperCase() + '"' + messages.guessed;
	                    output.classList.add("warning");
	                }
	                /* does guess exist in current word? if so, add to letters already matched, if final letter added, game over with win message */
	                else if (currentWord.indexOf(guess) > -1) {
	                    var lettersToShow;
	                    lettersToShow = document.querySelectorAll(".letter" + guess.toUpperCase());

	                    for (var i = 0; i < lettersToShow.length; i++) {
	                        lettersToShow[i].classList.add("correct");
	                    }

	                    /* check to see if letter appears multiple times */
	                    for (var j = 0; j < currentWord.length; j++) {
	                        if (currentWord.charAt(j) === guess) {
	                            numLettersMatched += 1;
															var audio2 = new Audio('audio/right-guess.mp3');
															audio2.play();

	                        }
	                    }

	                    lettersMatched += guess;
	                    if (numLettersMatched === currentWord.length) {
												setTimeout(onsubmit, 2000);
												var audio3 = new Audio('audio/triumph.mp3');
												audio3.play();

	                    }
	                }
	                /* guess doesn't exist in current word and hasn't been guessed before, add to lettersGuessed, reduce lives & update user */
	                else {
	                    lettersGuessed += guess;
	                    lives--;
	                    man.innerHTML = '';
											var audio = new Audio('audio/wrong-guess.mp3');
											audio.play();
	                }
	            }
	            /* not a valid letter, error */
	            else {
	                output.classList.add('error');
	                output.innerHTML = messages.validLetter;
	            }
	        }
	        /* no letter entered, error */
	        else {
	            output.classList.add('error');
	            output.innerHTML = messages.validLetter;
	        }
	        return false;
	    };
})(window, jQuery);
