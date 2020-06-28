+(function(w){
    
    function Bar($bar,$dots,$progress){
        return new Bar.prototype.init($bar,$dots,$progress);
    }
    Bar.prototype = {
        constructor:Bar,
        // 构造函数
        init:function($bar,$dots,$progress){
            // 属性
            this.$bar = $bar;
            this.$dots = $dots;
            this.$progress = $progress;
            this.isDrag = false;
            this.musicTime = 0;
        },
        // 进度条拖拽
        dargBar:function(medio,type){
            // console.log('运行')
            let $this = this;
            // 1.鼠标按下事件
            $this.$bar.on('mousedown',function(e){
                e.preventDefault();
                e.stopPropagation();
                $this.isDrag = true;
                // 1.1.记录开始坐标位置
                let starX = e.pageX;
                let barOffset = $(this).offset().left;
                let dotOffset = $this.$dots.offset().left;
                // 判断鼠标是否在小圆点内
                if(starX<dotOffset || starX>(dotOffset+10)){
                    // 设置小圆点位置
                    $this.$dots.css('left',starX - barOffset);
                    // 设置进度条位置
                    $this.$progress.css('width',starX - barOffset);
                    // 媒体播放进度比例值
                    $this.musicTime = $this.$progress.width()/$this.$bar.width();
                }
            // 2.鼠标移动事件
                $(document).on('mousemove',function(e){
                    let nowX = e.pageX;
                    let disX = nowX - barOffset;
                    // 超出控制
                    if(disX<0){
                        disX = 0;
                    }else if(disX>$this.$bar.width()){
                        disX = $this.$bar.width();
                    }
                    // 设置小圆点位置
                    $this.$dots.css('left',disX);
                    // 设置进度条位置
                    $this.$progress.css('width',disX);
                    // 媒体播放进度比例值
                    $this.musicTime = $this.$progress.width()/$this.$bar.width();
                    // 判读是否为音量键，实现拖拽时，改变音量
                    if(type == 'volume'){
                        medio.volume = $this.musicTime;
                    }
                });
                //3.鼠标抬起事件
                $(document).on('mouseup',function(e){
                    $this.isDrag = false;
                    $(document).off('mousemove');
                    let endX = e.pageX;
                    // 判读是否为音乐进度，鼠标抬起时，改变进度
                    if(type == 'currentTime'){
                        medio.currentTime = $this.musicTime*medio.duration;
                    }
                })
            });
        },
        setBar:function(dotLeft,proWidth){
            this.$dots.css('left',dotLeft);
            this.$progress.css('width',proWidth);
        }
    }
    Bar.prototype.init.prototype = Bar.prototype;
    w.Bar = Bar;
})(window)