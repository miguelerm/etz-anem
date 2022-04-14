(function(doc) {

    const START = 'start';
    const NEXT = 'next';
    const form = doc.querySelector('form');
    const startButton = doc.querySelector('button[value=start]');
    const nextButton = doc.querySelector('button[value=next]');
    const replayButton = doc.querySelector('button[value=replay]');
    const imageTag = doc.querySelector('img');
    const allWords = range(1, 20)
        .map(x => x < 10 ? `0${x}` : `${x}`)
        .map(word => {
            const audio = new Audio(`./sounds/${word}.mp3`);
            const image = new Image();
            image.src = `./images/${word}.png`;
            return {
                word,
                audio,
                image
            };
        });

    let globalState = {
        words: [],
        pastWords: [],
        current: null,
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = doc.querySelector('button:focus');
        const action = btn.value;

        globalState = execute(globalState, action);
        render(globalState);
        console.log(globalState);
    });

    function execute(state, action)
    {
        if (action === START) {
            const words = randomize(allWords);
            return execute({...state, words, pastWords: [], current: null }, NEXT);
        }

        if (action === NEXT) {
            const past = state.current;
            const current = state.words[0];
            const words = state.words.slice(1);
            return {...state, words, pastWords: [...state.pastWords, past].filter(x => !!x), current };
        }

        return state;
    }

    function render(state)
    {
        if (state.words.length === 0) {
            nextButton.setAttribute('disabled', 'disabled');
            startButton.removeAttribute('disabled');
        } else {
            nextButton.removeAttribute('disabled');
            startButton.setAttribute('disabled', 'disabled');
        }

        if (state.current) {
            replayButton.removeAttribute('disabled');
        } else {
            replayButton.setAttribute('disabled', 'disabled');
        }

        const pastWords = state.pastWords;
        if (pastWords.length > 0) {
            const latest = pastWords[pastWords.length - 1];
            const audio = latest.audio;
            audio.pause();
            audio.currentTime = 0;
        }

        const current = state.current;
        if (current) {
            const audio = current.audio;
            const image = current.image;
            audio.currentTime = 0;
            audio.play();
            imageTag.src = image.src;
        }
    }

    function range(min, max) {
        const range = [];
        for (let i = min; i <= max; i++) {
            range.push(i);
        }
        return range;
    }

    function randomize(items) {
        const array = items.slice(0);
        const randomizedArray = [];
        while (array.length > 0) {
            const randomIndex = Math.floor(Math.random() * array.length);
            randomizedArray.push(array[randomIndex]);
            array.splice(randomIndex, 1);
        }
        return randomizedArray;
    }

})(document);