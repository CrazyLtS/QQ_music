+(function () {

    let $listNav = $('.music_nav');
    let $content = $('.content_by_left');
    // 获取audio标签
    let $audio = $('audio');
    let player = new Player($audio);

    let playType;
    // 播放类型元素对象
    let $typeIcon = $('.ft_player_tools .player_icon_style');
    // 保存要切换的类
    let typeArr = ['player_style_loop','player_style_andom','player_style_oneloop','player_style_sequential'];

    // 设置滚动条
    $('by_music_ifon').mCustomScrollbar();
    // 1.选中框选中与未选中
    let iconCheck = function () {
        // 1.歌曲列表中工具组显示和隐藏
        // 1.2.歌曲列表-监听鼠标移入移除事件
        $listNav.on('mouseenter', '.music_list', function () {//鼠标移入
            // 1.2.1.显示工具组
            $(this).find('.music_menu').stop().fadeIn(300);
            // 1.2.3.显示删除按钮
            $(this).find('.menu_icon_del').css('display', 'block');
            // 1.2.4.隐藏歌曲时间
            $(this).find('.music_time').stop().fadeOut(0);
        });
        $listNav.on('mouseleave', '.music_list', function () {//鼠标移除
            // //1.2.5.隐藏工具组
            $(this).find('.music_menu').stop().fadeOut(300);
            // 1.2.6.隐藏删除按钮
            $(this).find('.menu_icon_del').css('display', 'none');
            // 1.2.7.显示歌曲时间
            $(this).find('.music_time').stop().fadeIn(300);
        });

        // 2.点击选择框，选择歌曲
        // 2.1.获取选择框
        // 2.3.选择框监听点击事件
        $listNav.on('click', '.music_list .music_check', function () {
            // 2.4.切换active类
            $(this).get(0).checked ? $(this).removeClass('ck_active') : $(this).addClass('ck_active');
            // 判断选择框是否已被选中
            $(this).get(0).checked = $(this).hasClass('ck_active');
            // 判断全选框（头部选择框）是否勾选，若全选，且存在一项歌曲列表未选中，则取消全选
            let isCheck = $('.music_list .music_check').map(function () {
                return $(this).get(0).checked ? $(this).get(0).checked : false;
            });

            let isAllCheck = [...isCheck].indexOf(false) == -1 ? true : false;
            if (isAllCheck) {
                $('.music_list_header .music_check').get(0).checked = true;
                $('.music_list_header .music_check').addClass('ck_active');
            } else {
                $('.music_list_header .music_check').get(0).checked = false;
                $('.music_list_header .music_check').removeClass('ck_active');
            }
        });
        // 2.5.选中列表头部选中框时，所有的选择框选中，反之相反
        $content.on('click', '.music_list_header .music_check', function () {

            // 2.6.头部选中宽切换类
            $(this).get(0).checked ? $(this).removeClass('ck_active') : $(this).addClass('ck_active');
            // 判断选择框是否已被选中
            $(this).get(0).checked = $(this).hasClass('ck_active');
            // 2.7.有ck_active类，全选，无则全不选
            let isCheck = $(this).hasClass('ck_active') ? true : false;
            if (isCheck) {
                $('.music_list .music_check').addClass('ck_active');
                $('.music_list .music_check').each(function (index, value) {
                    // 同步歌曲列表每一项的选中情况
                    $(this).get(0).checked = true;
                });
            } else {
                $('.music_list .music_check').removeClass('ck_active');
                $('.music_list .music_check').each(function (index, value) {
                    // 同步歌曲列表每一项的选中情况
                    $(this).get(0).checked = false;
                });
            }
        });

    }
    iconCheck();
    // 3.获取服务端音乐数据，添加到文档中
    let getPlayerList = function () {
        // creatList函数创建歌曲列表
        let creatList = function (music, index) {
            let listHtml = $(`<li class="music_list"><span class="music_check"></span><span class="music_number">${(index + 1)}</span><div class="music_mind"><div class="music_menu_list"><span class="music_name">${music.name}</span><ul class="music_menu">
            <li><a class="menu_icon_play" href="javascript:;"></a></li>
            <li><a class="menu_icon_add" href="javascript:;"></a></li>
            <li><a class="menu_icon_down" href="javascript:;"></a></li>
            <li><a class="menu_icon_share" href="javascript:;"></a></li>
            </ul></div><a class="music_songer" href="javascript:;">${music.songer}</a><a class="menu_icon_del" href="javascript:;"></a><span class="music_time">${music.time}</span></div></li>`);
            listHtml.get(0).music = music;
            listHtml.get(0).index = index;
            return listHtml;
        };
        // 3.1.使用ajax获取数据
        // 3.2.创建ajax
        $.ajax({
            url: '../source/musicList.json',
            dataType: 'json',
            success: function (data) {
                // 3.3.处理服务器返回的数据
                data.map((value, index) => {
                    let musitList = creatList(value, index);
                    // 3.4.添加到music_nav中
                    $listNav.append(musitList);
                    // console.log(musitList);
                });
            },
            error: function (e) {
                console.log(e);
            }
        });
    }
    getPlayerList();
    // 4.播放控件
    let musicPlayer = function () {

        // 阻止鼠标抬起的冒泡行为
        $('.musicWrap').on('mousedown', function (e) {
            e.stopPropagation();
            $(document).off('mouseup');
        });

        // 4.1.1.监听列表每一项中的播放按钮事件
        $listNav.on('click', '.menu_icon_play', function () {
            $(this).get(0).isplay = $(this).hasClass('pl_active');
            // 获取当前play播放按钮的父元素
            let thisParent = $(this).parents('.music_list');
            // 切换播放按钮图片,添加类
            if (!$(this).get(0).isplay) {
                $(this).addClass('pl_active');
                // console.log(thisParent.get(0).index,thisParent.get(0).music);
                // 高亮歌曲名字
                thisParent.find('.music_name').addClass('name_active');
                // 高亮歌手名字
                thisParent.find('.music_songer').addClass('name_active');
                // 移除其他兄弟想的播放键的pl_active类
                thisParent.siblings().find('.menu_icon_play').removeClass('pl_active');
                // 移除其他兄弟项的歌曲名字高亮
                thisParent.siblings().find('.music_name').removeClass('name_active');
                // 移除其他兄弟歌手名字
                thisParent.siblings().find('.music_songer').removeClass('name_active');

                // 同步脚部的播放按钮
                $('.player_play').get(0).isPlay = true;
                $('.player_play').addClass('pl_active');
                // 同步index
                $('.player_play').get(0).index = thisParent.get(0).index;
            } else {
                // 移除类
                $(this).removeClass('pl_active');
                $('.player_play').removeClass('pl_active');
            }
            // 4.1.2.播放音乐
            player.playMusic(thisParent.get(0).index, thisParent.get(0).music);
            // console.log(player.getMusicCurrentTime());
            // 4.1.3.进度条文本
            $('.player_progress_ifon .music_name').text(player.musicName);
            $('.player_progress_ifon .music_songer').text(player.songer);
        });
        // 点击歌曲名字播放音乐
        $listNav.on('click', '.music_menu_list .music_name', function () {
            // 自动触发播放事件
            $(this).parents('.music_list').find('.menu_icon_play').trigger('click');
        });
        let formatDate = function (starTime, endTime) {
            // 播放的时间
            let starMins = parseInt(starTime / 60);
            let starSce = parseInt(starTime % 60);
            if (starMins < 10) {
                starMins = '0' + starMins;
            }
            if (starSce < 10) {
                starSce = '0' + starSce;
            }
            // 总的时间
            let endMins = parseInt(endTime / 60);
            let endSce = parseInt(endTime % 60);
            if (endMins < 10) {
                endMins = '0' + endMins;
            }
            if (endSce < 10) {
                endSce = '0' + endSce;
            }

            let timeStr = `${starMins}:${starSce} / ${endMins}:${endSce}`;
            return timeStr;
        }

        // 4.2.同步脚部播放按钮的播放与暂停
        let playerBtn = function () {
            // 获取按钮对象
            let playIcon = $('.player_play');
            playIcon.on('click', function () {
                // 播放音乐
                if ($(this).get(0).index) {
                    // 非第一次播放音乐
                    // player.playMusic($(this).get(0).index,$(this).get(0).music)
                    // 自动触发音乐列表中的点击事件
                    $listNav.find('.music_list').eq($(this).get(0).index).find('.menu_icon_play').trigger('click');
                } else {
                    // 第一次播放音乐，播放列表中第一项音乐
                    $listNav.find('.music_list').eq(0).find('.menu_icon_play').trigger('click');
                }
            });
            // 上一首按钮
            $('.player_prev').on('click', function () {
                // 播放音乐
                if (playIcon.get(0).index) {
                    $listNav.find('.music_list').eq(playIcon.get(0).index - 1).find('.menu_icon_play').trigger('click');
                } else {
                    // 第一次播放音乐，播放列表中第一项音乐
                    $listNav.find('.music_list').eq($listNav.find('.music_list').length - 1).find('.menu_icon_play').trigger('click');
                }
            })
            // 下一首按钮
            $('.player_next').on('click', function () {
                // 播放音乐
                if (playIcon.get(0).index || playIcon.get(0).index == 0) {
                    let index = playIcon.get(0).index + 1;
                    if (index == $listNav.find('.music_list').length) {
                        index = 0;
                    }
                    $listNav.find('.music_list').eq(index).find('.menu_icon_play').trigger('click');
                } else {
                    // 第一次播放音乐，播放列表中第一项音乐
                    $listNav.find('.music_list').eq(0).find('.menu_icon_play').trigger('click');
                }
            })
        }
        playerBtn();

        // 4.3.进度条拖拽
        let dragBar = function () {
            let $bar = $('.music_player_progress .player_progress');
            let $dots = $('.music_player_progress .player_progress .progress_dots');
            let $progress = $('.music_player_progress .player_progress .progress_bar');

            let bar = new Bar($bar, $dots, $progress);
            bar.dargBar(player.audio, 'currentTime');

            // 音乐播放时间更新事件
            player.$audio.on('timeupdate', function () {
                // 4.1.4.同步时间和进度条
                let duraTime = player.getMusicDuration() || 0;
                let currTime = player.getMusicCurrentTime();

                let timeStr = formatDate(currTime, duraTime);
                // 将时间字符串添加到进度条中
                $('.player_music_time').text(timeStr);

                if (!bar.isDrag) {
                    // 同步进度条
                    let dotLeft = (parseInt(currTime) / parseInt(duraTime)) * $bar.width();
                    let proWidth = (parseInt(currTime) / parseInt(duraTime)) * $bar.width();
                    bar.setBar(dotLeft, proWidth);
                }
                // 切换播放类型
                let switchType = function(){
                    let type;
                    for (const iterator of typeArr) {
                        if($typeIcon.hasClass(iterator)){
                            type =  iterator;
                            continue;
                        }
                    }
                    // 切换播放类型
                    switch(type){
                        case 'player_style_loop':
                            playType.loopPlay();
                            break;
                        case 'player_style_andom':
                            playType.andomPlay();
                            break;
                        case 'player_style_oneloop':
                            playType.oneLoopPlay();
                            break;
                        case 'player_style_sequential':
                            playType.sequentialPlay();
                            break;
                        default:
                            break;
                    }
                }
                switchType();
            });
        }
        dragBar();

        // 4.4.设置音量键
        let dragVolume = function () {
            let $bar = $('.player_voice_progress .player_progress');
            let $dots = $('.player_voice_progress .player_progress .progress_dots');
            let $progress = $('.player_voice_progress .player_progress .progress_bar');

            let volume = new Bar($bar, $dots, $progress);
            volume.setBar($bar.width(), $bar.width());
            volume.dargBar(player.audio, 'volume');

            // 静音按钮，切换静音非静音
            $('.player_voice_progress .player_icon_voice').on('click', function () {
                $(this).toggleClass('voice_mute');
                if ($(this).hasClass('voice_mute')) {
                    player.audio.muted = true;
                } else {
                    player.audio.muted = false;
                }
            })
        }
        dragVolume();

        // 4.5.播放类型工具
        let typeTool = function(){
            let index = 1;
            // 监听类型按键点击事件,切换播放图标(类)
            $typeIcon.on('click',function(){
                index == 0? $(this).removeClass(typeArr[typeArr.length - 1]) : $(this).removeClass(typeArr[index - 1]);
                $(this).addClass(typeArr[index]);
                index ++;
                // 判断是否为切换到最后，是则切换回第一个类
                if(index == typeArr.length){
                    index = 0;
                }
            });
            // 根据不同的图标(播放类型)，切换不同的播放类型
            playType = {
                // 列表循环播放
                loopPlay : function(){
                        // 判断歌曲是否播放完成
                    if(player.getMusicCurrentTime() == player.getMusicDuration()){
                        
                        $('.player_play').removeClass('pl_active');
                        $listNav.find('.menu_icon_play').eq($('.player_play').get(0).index).removeClass('pl_active');
                        // 播放下一首音乐
                        let nextIndex = $('.player_play').get(0).index+1;
                        if($('.player_play').get(0).index == ($listNav.find('.music_list').length - 1)){
                            
                            nextIndex = 0;
                        }
                        $listNav.find('.music_list').eq(nextIndex).find('.menu_icon_play').trigger('click');
                    }
                },
                // 随机播放
                andomPlay : function(){
                    // 判断歌曲是否播放完成
                    let andomIndex  = Math.round( Math.random()*($listNav.find('.music_list').length - 1));
                    if(player.getMusicCurrentTime() == player.getMusicDuration()){
                        $('.player_play').removeClass('pl_active');
                        $listNav.find('.menu_icon_play').eq($('.player_play').get(0).index).removeClass('pl_active');
                        // 随机播放下一首音乐
                        $listNav.find('.music_list').eq(andomIndex).find('.menu_icon_play').trigger('click');
                    }
                },
                // 单曲循环播放
                oneLoopPlay : function(){
                    // 判断歌曲是否播放完成
                    if(player.getMusicCurrentTime() == player.getMusicDuration()){
                        $('.player_play').removeClass('pl_active');
                        $listNav.find('.menu_icon_play').eq($('.player_play').get(0).index).removeClass('pl_active');
                        // 随机播放下一首音乐
                        $listNav.find('.music_list').eq($('.player_play').get(0).index).find('.menu_icon_play').trigger('click');
                    }
                },
                // 列表播放
                sequentialPlay : function(){
                    // 判断歌曲是否播放完成
                    if(player.getMusicCurrentTime() == player.getMusicDuration()){
                        $('.player_play').removeClass('pl_active');
                        $listNav.find('.menu_icon_play').eq($('.player_play').get(0).index).removeClass('pl_active');
                        // 播放下一首音乐
                        let nextIndex = $('.player_play').get(0).index+1;
                        if($('.player_play').get(0).index == ($listNav.find('.music_list').length - 1)){
                            return;
                        }
                        $listNav.find('.music_list').eq(nextIndex).find('.menu_icon_play').trigger('click');
                    }
                }
            }
        }
        typeTool();

    }
    musicPlayer();

})();