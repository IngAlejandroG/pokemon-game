import { computed, onMounted, onUnmounted, ref } from 'vue';
import { GameStatus, type Pokemon, type PokemonListResponse } from '../interfaces';
import { pokemonApi } from '../api/pokemonApi';

import confetti from 'canvas-confetti';

export const usePokemonGame = () => {
  const isLoading = ref<boolean>(true);
  const gameStatus = ref<GameStatus>(GameStatus.Playing);
  const pokemons = ref<Pokemon[]>([]);
  const pokemonOptions = ref<Pokemon[]>([]);

  const seconds = ref<number>(5);
  const isRunning = ref<boolean>(false);
  let timerInterval:any;

  // Selecciona un ganador al azar de el arrglo de opciones
  const winnerPokemon = computed(
    () => pokemonOptions.value[Math.floor(Math.random() * pokemonOptions.value.length)],
  );

  const lengthPokemons = computed(() => pokemons.value.length);
  const score = ref<number>(0);
  const correctAttempts = ref<number>(0);
  const opportunities = ref<number>(3);
  const gameScore = computed(() => {
    return score.value + 4*correctAttempts.value
  })

  const highScore = ref<number>(0);

  // Ordenar aleatoriamente el arreglo de pokemons Fisher-Yates
  function shuffle(array:Pokemon[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const getPokemons = async (): Promise<Pokemon[]> => {
    const response = await pokemonApi.get<PokemonListResponse>('/?limit=500');
    const pokemonsArray = response.data.results.map((pokemon) => {
      const urlParts = pokemon.url.split('/');
      const id = urlParts.at(-2) ?? 0;
      return {
        name: pokemon.name,
        id: +id,
      };
    });
    return shuffle(pokemonsArray)
  };

  // Obtener las 4 opciones para mostrar
  const getNextRound = (howMany: number = 4) => {
    gameStatus.value = GameStatus.Playing;
    pokemonOptions.value = pokemons.value.slice(0, howMany);
    pokemons.value = pokemons.value.slice(howMany);

  };

  const formatTime = () => {
    const secondsAvailable = String(seconds.value).padStart(2, '0')
    return secondsAvailable
  }

  const startTimer = () => {
    if (isRunning.value) return
    isRunning.value = true
    timerInterval = setInterval(() => {
      if(seconds.value == 0){
        clearInterval(timerInterval);
        checkAnswer(0)
      }
      if(seconds.value > 0){
        seconds.value--;
      }
    }, 1000)
  }

  const resetTimer = () => {
    seconds.value = 5;
    isRunning.value = false;
    clearInterval(timerInterval);
    startTimer();
  }


  const checkAnswer = (id: number) => {
    clearInterval(timerInterval);
    const hasWon = winnerPokemon.value.id === id;
    if (hasWon) {
      gameStatus.value = GameStatus.Won;
      correctAttempts.value++;
      confetti({
        particleCount: 300,
        spread: 150,
        origin: { y: 0.6 },
      });

      // Actualiza el high score
      if (gameScore.value > highScore.value) {
        highScore.value = gameScore.value;
        localStorage.setItem('highScore', highScore.value.toString());
      }



        setTimeout(()=>{
          getNextRound();
          resetTimer();
        },2000)

      return;
    }

    if(opportunities.value > 0){
      setTimeout(()=>{
        getNextRound()
        seconds.value = 5;
        isRunning.value = false;
        startTimer();
        opportunities.value = opportunities.value - 1;
      },2000)
    }
    gameStatus.value = GameStatus.Lost;
  };


  const initGame = async () => {
    pokemons.value = await getPokemons();
    getNextRound();
    isLoading.value = false;

    // Carga el high score desde localStorage
    const storedHighScore = localStorage.getItem('highScore');
    if (storedHighScore) {
      highScore.value = parseInt(storedHighScore);
    }

  }



  const resetGame = async () => {
    isLoading.value = true;
    gameStatus.value = GameStatus.Playing;
    correctAttempts.value = 0;
    score.value = 0;
    opportunities.value = 3;
    await initGame();
    resetTimer();
  };

  onUnmounted(() => {
    if (timerInterval) {
      clearInterval(timerInterval)
    }
  })

  onMounted(async () => {
    await initGame();
    startTimer();
  });

  return {
    gameStatus,
    isLoading,
    pokemonOptions,
    winnerPokemon,
    lengthPokemons,
    correctAttempts,
    gameScore,
    opportunities,
    highScore,
    //Methods
    getNextRound,
    checkAnswer,
    resetGame,
    formatTime
  };
};
