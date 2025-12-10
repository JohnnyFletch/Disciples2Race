let app = new Vue({
    el: '.main',
    data: {
        showMain: true,
        showSocial: false,
        showAchievements: false,
        showQuestions: false,
        showResults: false,
        number: 0,
        score: {
            'empire': 0,
            'clans': 0,
            'alliance': 0,
            'undead': 0,
            'legions': 0
        },
        // если true, то выражение после ?, а если false - после :
        totalGame: localStorage.getItem('sc2TotalGame') ? JSON.parse(localStorage.getItem('sc2TotalGame')) : {
            'empire': 0,
            'clans': 0,
            'alliance': 0,
            'undead': 0,
            'legions': 0,
            'neutral': 0
        },
        // JSONparse не нужен, поскольку у нас уже не объект, а число
        totalGames: localStorage.getItem('scTotalGames') ? localStorage.getItem('scTotalGames') : 0,
        questions: questions,
        results: results,
        resultRace: 'empire',  
    },
    methods: {
        goToMain() {
        this.showMain = true;
        this.showSocial = false;
        this.showAchievements = false;
        this.showQuestions = false;
        this.showResults = false;
        },
        goToSocial() {
        this.showMain = false;
        this.showSocial = true;
        this.showAchievements = false;
        this.showQuestions = false;
        this.showResults = false;
        },
        goToAchievements() {
        if(this.totalGames > 0) {
            this.showMain = false;
            this.showSocial = false;
            this.showAchievements = true;
            this.showQuestions = false;
            this.showResults = false;
        } else {
            this.goToQuestions();
        }                
        },
        goToQuestions() {
            this.score = {
            'empire': 0,
            'clans': 0,
            'alliance': 0,
            'undead': 0,
            'legions': 0
        }
        this.showMain = false;
        this.showSocial = false;
        this.showAchievements = false;
        this.showQuestions = true;
        this.showResults = false;
        },
        goToResults(race) {
        this.showMain = false;
        this.showSocial = false;
        this.showAchievements = false;
        this.showQuestions = false;
        this.showResults = true;
        this.resultRace = race;
        },
        nextQuestions(answer) {
            if(this.number == 25) {
                this.number = 0;
                this.endGame();
            }  else {
                this.number++;
            }
            eval(answer);
        },
        endGame() {
            this.totalGames++;
            localStorage.setItem('scTotalGames', this.totalGames);
            //Империя
            if(this.score.empire > this.score.alliance && 
                this.score.empire > this.score.clans && 
                this.score.empire > this.score.undead && 
                this.score.empire > this.score.legions) {
                    this.goToResults('empire');
                    this.totalGame.empire++;
                }
                //Эльфы
                else if(this.score.alliance > this.score.empire && 
                    this.score.alliance > this.score.clans && 
                    this.score.alliance > this.score.undead && 
                    this.score.alliance > this.score.legions) {
                        this.goToResults('alliance');
                        this.totalGame.alliance++;
                    }
                //Гномы
                else if(this.score.clans > this.score.alliance && 
                    this.score.clans > this.score.empire && 
                    this.score.clans > this.score.undead && 
                    this.score.clans > this.score.legions) {
                        this.goToResults('clans');
                        this.totalGame.clans++;
                    }
                //Нежить
                else if(this.score.undead > this.score.alliance && 
                    this.score.undead > this.score.clans && 
                    this.score.undead > this.score.empire && 
                    this.score.undead > this.score.legions) {
                        this.goToResults('undead');
                        this.totalGame.undead++;
                    }
                //Легионы
                else if(this.score.legions > this.score.alliance && 
                    this.score.legions > this.score.clans && 
                    this.score.legions > this.score.undead && 
                    this.score.legions > this.score.empire) {
                        this.goToResults('legions');
                        this.totalGame.legions++;
                    }
                //Нейтрал
                else {
                    this.goToResults('neutral');
                    this.totalGame.neutral++;
                }
            localStorage.setItem('sc2TotalGame', JSON.stringify(this.totalGame));
        }
    },
    computed: {
        totalScore() {
            let score = 0;
            for(let i in this.totalGame) {
                score+= (this.totalGame[i] * results[i].points);
            }
            return score;
        },
        openRaces() {
            let count = 0;
            for(let i in this.totalGame) {
                if(this.totalGame[i] > 0) {
                    count++;
                }
            }
            return count;
        },
        favouriteRace() {
            let max = 'empire';
            for(let i in this.totalGame) {
                if(this.totalGame[i] > this.totalGame[max]) {
                    max = i;
                }
            }
            return results[max].name;
        },
        showResultRace() {
            return {
                'empire': this.totalGame.empire > 0 ? true : false,
                'clans': this.totalGame.clans > 0 ? true : false,
                'alliance': this.totalGame.alliance > 0 ? true : false,
                'undead': this.totalGame.undead > 0 ? true : false,
                'legions': this.totalGame.legions > 0 ? true : false,
                'neutral': this.totalGame.neutral > 0 ? true : false,
            }
        }
    }            
})
let audio = null;
let audio_btn = document.querySelector('.btn__sound');
let audio_icon = document.querySelector('.btn__sound i');
let isPlaying = false;

function initializeAudio() {
    if (audio) return;
    
    audio = new Audio(window.location.origin + '/audio/dark.mp3');
    audio.volume = 0.1;
    audio.muted = false;
    audio.loop = true;
    audio.preload = "auto"; // меняем на auto для лучшей загрузки
    
    console.log('Аудио инициализировано');

    audio.addEventListener('loadedmetadata', function() {
        if (audio.duration !== Infinity) {
            audio.currentTime = Math.random() * audio.duration;
        }
    });

    // Останавливаем аудио изначально
    audio.pause();
}

// Вешаем обработчик
if (audio_btn) {
    audio_btn.addEventListener('click', function() {
        // Всегда инициализируем при первом клике
        if (!audio) {
            initializeAudio();
        }
        
        if (!isPlaying) {
            audio.play().then(() => {
                console.log('✅ Музыка играет!');
                isPlaying = true;
                audio_icon.classList.add('fa-volume-up');
                audio_icon.classList.remove('fa-volume-off');
            }).catch(error => {
                console.error('❌ Audio play failed:', error.name, error.message);
                
                // Авто-фикс для политики браузера
                if (error.name === 'NotAllowedError') {
                    console.log('Браузер заблокировал автовоспроизведение. Попробуйте нажать ещё раз.');
                    // Сбрасываем флаг, чтобы можно было попробовать снова
                    isPlaying = false;
                }
            });
        } else {
            audio.pause();
            isPlaying = false;
            console.log('⏸️ Музыка остановлена');
            audio_icon.classList.add('fa-volume-off');
            audio_icon.classList.remove('fa-volume-up');
        }
    });
} else {
    console.error('Кнопка .btn__sound не найдена!');
}
