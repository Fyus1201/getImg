/**
 * Created by Fyus on 2017/1/20.
 */


(function (window, jQuery) {
    var handler = {
        init: function($doc){
            //dragover,drop  默认行为禁掉
            $doc.on("dragover", function(event){
                event.preventDefault();
            });
            $doc.on("drop", function(event){
                event.preventDefault();
                var file = event.originalEvent.dataTransfer.files[0];
                handler.readImgFile(file);
            });
            $doc.on("change", "input[type=file]", function(event){
                if(!this.value) return;
                var file = this.files[0];

                handler.readImgFile(file);
                this.value = "";
            });
        },
        readImgFile: function(file){
            var reader = new FileReader(file);

            //检验用户是否选则是图片文件
            if(file && file.type.match('image.*')){
                if($(".bottom_title").length){
                    $(".bottom_title").remove();
                    $(".handlerBox").css('display','block');

                }
                if($("canvas").length){
                    $("canvas").remove();
                    $("img").remove();
                }
                reader.onload = function(event) {
                    var base64 = event.target.result;

                    //提取base64格式，然后用canvas绘制
                    var img = new Image();
                    img.src = base64;

                    $(".content").append(img);

                    //download只有firefox和chrome可以使用
                    $(".download").attr("download",file.name)
                        .attr("href",base64.replace("image/jpeg", "image/octet-stream"));

                    img.onload = function (e) {

                        $(".img_t").val(file.name);
                        handler.compress(img,716)
                    }
                };
                //读取然后监听
                reader.readAsDataURL(file);
            }else {
                console.log("不是图片");
            }
        },
        compress: function(img,maxWidth){

            //创建一个canvas对象
            var cvs = document.createElement('canvas');
            var width = img.naturalWidth,
                height = img.naturalHeight,
                imgRatio = width / height;
            if(width < maxWidth){
                width = maxWidth;
                height = maxWidth/imgRatio;
                setChange.set(100*maxWidth/img.naturalWidth);

            }else {
                setChange.set(100);
            }

            cvs.width = width;
            cvs.height = height;

            //把大图片画到一个小画布
            var ctx = cvs.getContext("2d").drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, width, height);
            //图片质量进行适当压缩
            $(".canvas_p").append(cvs);
            $(".handlerBox").css("left",($("canvas").offset().left+4)+"px");
            $(".handlerBox").css("top",($("canvas").offset().top+4)+"px");

        }
    };

    handler.init($(document));

    $(document).on("mousedown",".handlerBox",function (e) {
        var handlerBox = $(".handlerBox");

        x1=e.clientX-handlerBox.offset().left;
        y1=e.clientY-handlerBox.offset().top;

        $(document).on("mousemove",".handlerBox",function (e) {
            // console.log($("canvas").height(),$("canvas").width());/
           // $(".handlerBox").left = e.clientX;

            var canvas = $("canvas");
            var canvas_top = canvas.offset().top;
            var canvas_left = canvas.offset().left;
            var canvas_right = canvas_left  + canvas.width();
            var canvas_bottom = canvas_top + canvas.height();

            if(e.clientX-x1 >= canvas_left+4 && e.clientX-x1+handlerBox.width() -4 <= canvas_right){
                handlerBox.css("left",(e.clientX-x1)+"px");
            }
            if(e.clientY-y1 >= canvas_top+4 && e.clientY-y1+handlerBox.height() -4 <= canvas_bottom){
                handlerBox.css("top",(e.clientY-y1)+"px");
            }

        })
    });

    $(document).on("mouseup",function (e) {
        $(document).unbind("mousemove");

        if(document.getElementsByTagName('canvas').length){
            var cvs = document.createElement('canvas');
            var img = document.getElementsByTagName('img')[0];
            let n =$(".img_range").val()/100;

            var left = $('.handlerBox').offset().left - $('canvas').offset().left-4,
                top =  $('.handlerBox').offset().top - $('canvas').offset().top-4,
                width = $('.handlerBox').width()-2,
                height = $('.handlerBox').height()-2;
            cvs.width = width;
            cvs.height = height;
            cvs.getContext("2d").drawImage(img, left/n, top/n, width/n, height/n, 0, 0, width, height);

             //导出图片为base64
            var newImageData = cvs.toDataURL("image/jpeg");

            var resultImg = new Image();
            resultImg.src = newImageData;

            $(".download").attr("download",$(".img_t").val())
                .attr("href",newImageData.replace("image/jpeg", "image/octet-stream"));
        }

    });

    $(document).on("click",".button_big",function (e) {

        $(".handlerBox").width(716).height(297);
        $(".handlerBox").css("left",($("canvas").offset().left+4)+"px");
        $(".handlerBox").css("top",($("canvas").offset().top+4)+"px");
    });
    $(document).on("click",".button_long",function (e) {
        $(".handlerBox").width(275).height(385);
        $(".handlerBox").css("left",($("canvas").offset().left+4)+"px");
        $(".handlerBox").css("top",($("canvas").offset().top+4)+"px");
    });
    $(document).on("click",".button_little",function (e) {
        $(".handlerBox").width(185).height(110);
        $(".handlerBox").css("left",($("canvas").offset().left+4)+"px");
        $(".handlerBox").css("top",($("canvas").offset().top+4)+"px");
    });


    var setChange = {
        init:function (e) {
            $(document).on("change","#range",function (e) {

                let n =$("#range").val();
                $(".img_range").val(n);

                if(document.getElementsByTagName('canvas').length>0){
                    var cvs = document.getElementsByTagName('canvas')[0];
                    var img = document.getElementsByTagName('img')[0];
                    cvs.width = img.naturalWidth*n/100;
                    cvs.height = img.naturalHeight*n/100;
                    cvs.getContext("2d").drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, cvs.width, cvs.height);

                }
            });
            $(document).on("change",".img_range",function (e) {

                let n = $(".img_range").val();
                $("#range").val(n);

                if(document.getElementsByTagName('canvas').length>0){
                    var cvs = document.getElementsByTagName('canvas')[0];
                    var img = document.getElementsByTagName('img')[0];
                    cvs.width = img.naturalWidth*n/100;
                    cvs.height = img.naturalHeight*n/100;
                    cvs.getContext("2d").drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, cvs.width, cvs.height);

                }
            });
            setChange.set(100);
        },
        set:function (n) {
            $("#range").val(n);
            $(".img_range").val(n);

            if(document.getElementsByTagName('canvas').length>0){
                var cvs = document.getElementsByTagName('canvas')[0];
                var img = document.getElementsByTagName('img')[0];

                cvs.width = img.naturalWidth*n/100;
                cvs.height = img.naturalHeight*n/100;
                cvs.getContext("2d").drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, cvs.width, cvs.height);
            }

        }
    };
    setChange.init();



})();





