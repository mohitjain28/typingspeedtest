
    const textDisplay = document.getElementById("textDisplay");
    const inputBox = document.getElementById("inputBox");
    const wpmDisplay = document.getElementById("wpm");
    const accuracyDisplay = document.getElementById("accuracy");
    const timerDisplay = document.getElementById("timer");
    const restartBtn = document.getElementById("restartBtn");
    const levelSelect = document.getElementById("levelSelect");
    const scoresList = document.getElementById("scoresList");

    const paragraphs = {
      easy: [
        "The dog chased a ball across the room.",
        "The sun sets behind the mountains, making the sky glow.",
        "Raindrops tapped softly on the window.",
        "He packed his bag to catch the early train.",
        "The band played loudly, filling the hall with music.",
        "She offered him a warm cup of tea.",
        "The children ran happily in the park.",
        "A soft breeze carried the scent of flowers.",
        "They sat by the campfire, telling stories.",
        "She opened the book and smiled at the old notes."
      ],
      medium: [
        "The scientist reviewed results carefully, uncovering new insights and improving their understanding of complex phenomena.",
        "Astronomers captured beautiful images of stars and galaxies, enhancing our understanding of the universe.",
        "Engineers tested new technologies that could change the way we use energy and resources.",
        "Doctors researched innovative treatments that could help cure diseases more effectively.",
        "The artist painted a beautiful picture, mixing colors and techniques with passion and creativity.",
        "Teachers inspired students with new ideas and a love for learning.",
        "The explorer ventured into unknown lands, mapping uncharted regions and discovering new species.",
        "Farmers grew healthy crops, using sustainable practices to protect the environment.",
        "The writer crafted a compelling story that captivated readers from start to finish.",
        "The musician composed a song that resonated with the emotions of listeners."
      ],
      hard: [
        "The scientist meticulously reviewed experimental results, uncovering unexpected insights hidden within layers of complex scientific observations and measurements, ultimately advancing the field.",
        "Geographers ventured into uncharted territories, documenting unfamiliar landscapes and compiling critical environmental data essential for conservation, mapping ecosystems, and supporting geographic research efforts globally.",
        "Astronomers observed celestial phenomena through powerful telescopes, capturing detailed images of distant stars and galaxies that deepen humanity's understanding of cosmic origins, structures, and universal evolution.",
        "Physicists tested groundbreaking hypotheses in advanced laboratories, pushing the limits of known physical laws, reshaping fundamental assumptions, and opening doors to revolutionary scientific discoveries.",
        "Marine biologists monitored coral reef health closely, identifying key factors contributing to reef resilience and formulating innovative strategies for effective ocean conservation and marine ecosystem preservation.",
        "Anthropologists analyzed ancient cave paintings, carefully decoding symbolic representations that shed light on early human communication, social rituals, and the rich development of prehistoric cultures.",
        "Ecologists assessed the effects of climate change on species migration, providing vital data that informs global conservation policies, biodiversity preservation, and long-term sustainability initiatives worldwide.",
        "Chemists synthesized entirely new compounds with unique, tailored properties, opening exciting possibilities for innovations in energy storage, materials science, and advanced medical treatments and technologies.",
        "Neuroscientists mapped intricate neural networks, examining how various brain regions interact during complex cognitive tasks, revealing fundamental mechanisms underlying human memory, emotion, and learning capabilities.",
        "A mathematician spent hours exploring theoretical proofs, searching for patterns that revealed surprising connections between abstract mathematical concepts and real-world applications, bridging gaps."
      ]
    };

    let currentText = "";
    let timer = 0;
    let interval = null;
    let started = false;

    function loadText() {
      const level = levelSelect.value;
      const paraList = paragraphs[level];
      currentText = paraList[Math.floor(Math.random() * paraList.length)];
      textDisplay.innerHTML = "";
      currentText.split("").forEach(char => {
        const span = document.createElement("span");
        span.innerText = char;
        textDisplay.appendChild(span);
      });
      inputBox.value = "";
      inputBox.disabled = false;
      inputBox.focus();
      timer = 0;
      timerDisplay.textContent = "Time: 0s";
      wpmDisplay.textContent = "WPM: 0";
      accuracyDisplay.textContent = "Accuracy: 100%";
      clearInterval(interval);
      started = false;
    }

    function saveScore(wpm, accuracy) {
      const level = levelSelect.value;
      const key = `typing_leaderboard_${level}`;
      const scores = JSON.parse(localStorage.getItem(key)) || [];
      scores.push({ wpm, accuracy, date: new Date().toLocaleString() });
      scores.sort((a, b) => b.wpm - a.wpm);
      if (scores.length > 5) scores.pop();
      localStorage.setItem(key, JSON.stringify(scores));
      showScores();
    }

    function showScores() {
      const level = levelSelect.value;
      const key = `typing_leaderboard_${level}`;
      const scores = JSON.parse(localStorage.getItem(key)) || [];
      scoresList.innerHTML = "";
      scores.forEach(score => {
        const li = document.createElement("li");
        li.textContent = `${score.date} - WPM: ${score.wpm}, Accuracy: ${score.accuracy}%`;
        scoresList.appendChild(li);
      });
    }

    inputBox.addEventListener("input", () => {
      const input = inputBox.value;
      if (!started) {
        started = true;
        interval = setInterval(() => {
          timer++;
          timerDisplay.textContent = `Time: ${timer}s`;
        }, 1000);
      }

      let correct = 0;
      const spans = textDisplay.querySelectorAll("span");
      spans.forEach((span, index) => {
        const char = input[index];
        if (char == null) {
          span.className = "";
        } else if (char === span.innerText) {
          span.className = "correct";
          correct++;
        } else {
          span.className = "incorrect";
        }
      });

      if (input === currentText) {
        clearInterval(interval);
        inputBox.disabled = true;
        const wordsTyped = input.trim().split(/\s+/).length;
        const wpm = Math.round((wordsTyped / timer) * 60) || 0;
        const accuracy = Math.round((correct / currentText.length) * 100) || 100;
        saveScore(wpm, accuracy);
      }

      const wordsTyped = input.trim().split(/\s+/).length;
      const wpm = Math.round((wordsTyped / (timer || 1)) * 60) || 0;
      const accuracy = Math.round((correct / currentText.length) * 100) || 100;

      wpmDisplay.textContent = `WPM: ${wpm}`;
      accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
    });

    restartBtn.addEventListener("click", loadText);
    levelSelect.addEventListener("change", () => {
      loadText();
      showScores();
    });

    window.onload = () => {
      loadText();
      showScores();
    };
 