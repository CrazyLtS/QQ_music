+(function(window){
    function Player($audio){
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor:Player,
        // 构造函数
        init:function($audio){
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        musicName:'Music',
        songer:'SendBer',
        currentIndex:-1,
        playMusic:function(index,music){
            if(this.currentIndex == index){
                // 同一首音乐
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    this.audio.pause();
                }
            }else{
                // 不是同一首
                this.$audio.attr('src',music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
            this.musicName = music.name;
            this.songer = music.songer;
        },
        getMusicDuration:function(){
            return this.audio.duration;
        },
        getMusicCurrentTime:function(){
            return this.audio.currentTime;
        },
        setVolume:function(){

        }
    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);