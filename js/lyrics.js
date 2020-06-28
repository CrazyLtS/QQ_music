+(function(w){
    let Lyrics = function(){
        return new Lyrics.prototype.init();
    }
    Lyrics.prototype = {
        constructor:Lyrics,
        // 构造函数
        init:function(){
            
        },
        lyricsDate:function(lyUrl){
            $this = this;
            $.ajax({
                url:lyUrl,
                dataType:'text',
                success:function(data){
                    // 解析歌词
                    $this.parselyrics(data);
                    // 处理解析好的歌词，添加到文档中
                    $this.lyricsHTML(lyricsEle);
                },
                error:function(e){
                    console.log(e);
                }
            })
        },
        // 解析歌词
        parselyrics:function(data){
            
        },
        // 处理解析的歌词
        lyricsHTML:function(lyricsEle){

        }
    }
    Lyrics.prototype.init.prototype = Lyrics.prototype;
    w.Lyrics = Lyrics;
})()