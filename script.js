$.fn.puissance4 = function () {
    class p4 {
        constructor(x, y, Couleur1, Couleur2)
        {
            this.Grille = new gameGrille(x, y);
            this.tour = 0;
            this.Joueurs = new Joueurs(Couleur1, Couleur2);
            this.initialisation();
        }
        initialisation()
        {
            this.score();
            this.BacktoMenu();
            this.Token(this.Joueurs.TourJoueur(this.tour + 1));
            let appli = this;
            let drag = false;
            let initialTokenPos = $('.pickerContainer .token').offset();
            $(document).on('click', '.menu', function () {
                new menu();
            });
            $(document).click(function (e) {
                if (e.target.className === 'token')
                {
                    if (drag === true)
                    {
                        drag = !drag;
                        let offset = $('.pickerContainer .token').offset();
                        let actionTester = false;
                        $('.PlayJeton').each( function (key, data) {
                            let arrowOffset = $($('.PlayJeton')[key]).offset();
                            if (offset.top + 40 > arrowOffset.top && offset.top + 40 < arrowOffset.top + 100
                            && offset.left + 40 > arrowOffset.left && offset.left + 40 < arrowOffset.left + 100)
                            {
                                actionTester = true;
                                $($('.PlayJeton')[key]).trigger('hit');
                            }
                        });
                        if (actionTester === false)
                        {
                            $('.pickerContainer .token').animate({
                                top: initialTokenPos.top + 10 + "px",
                                left: initialTokenPos.left + 10 + "px",
                                transform: 'translate(0%, 0%)'
                            })
                        }
                    }
                    else
                        drag = !drag;
                }
            });
            $(document).mousemove(function (e) {
                moveToken(e);
            });
            function moveToken(e)
            {
                if (drag === true)
                {
                    let actualPositions = {
                        left: e.pageX + 'px',
                        top: e.pageY + 'px'
                    };
                    $('.pickerContainer .token').css({
                        top: actualPositions.top,
                        left: actualPositions.left,
                        transform: 'translate(-50%, -50%)'
                    });
                }
            }
            $(document).on('hit', '.PlayJeton', function (e) {
                $('.PlayJeton').each( function (key, data) {
                    if (e.target === $('.PlayJeton')[key])
                    {
                        appli.tour++;
                        appli.BoutonUndo(appli.Joueurs.TourJoueur(appli.tour));
                        appli.Token(appli.Joueurs.TourJoueur(appli.tour + 1));
                        let y = appli.Grille.getCase(
                            appli.Joueurs.TourJoueur(appli.tour),
                            key
                        );
                        if (y !== null)
                        {
                            appli.Grille.setCase(
                                appli.Joueurs.TourJoueur(appli.tour),
                                key,
                                y
                            );
                            appli.Grille.colorCase(
                                appli.Joueurs.TourJoueur(appli.tour),
                                key,
                                y
                            );
                            
                        }
                        else
                        {
                            appli.tour--;
                        }
                    }
                });
            });
            $(document).on('click', '.undo', function () {
                appli.Grille.undo();
                appli.tour = appli.tour - 1;
                appli.Token(appli.Joueurs.TourJoueur(appli.tour + 1));
                appli.BoutonUndo(appli.Joueurs.TourJoueur(appli.tour));
            });
            let counterClick = 0;
            $(document).on('click', '.restart-play_canvas', function (e) {
                counterClick++;
                if (counterClick > 1)
                    return;
                $('.restart-border_canvas').animate(
                    {
                        borderSpacing: -1205
                    }, {
                        step: function (now) {
                            $(this).css({
                                'transform': 'translate(-50%, -50%) rotate(' + now + 'deg)'
                            });
                        },
                        done: function () {
                            counterClick = 0;
                        },
                        duration: 3000,
                    }
                );
                $('.restart-play_canvas').animate(
                    {
                        borderSpacing: 360
                    }, {
                        step: function (now) {
                            $(this).css({
                                'transform': 'translate(-50%, -50%) rotate(' + now + 'deg)'
                            });
                        },
                        done: function () {
                            counterClick = 0;
                            $('.gameStarter').animate({width: '100%'})
                                .animate({height: '100%'});
                            $('.puissance4').fadeTo('slow', 0);
                            $('.restart-play_canvas').animate({left: '100%', opacity: '0'}, function () {
                                appli.Grille = new gameGrille(appli.Grille.x, appli.Grille.y);
                                $('.puissance4').fadeTo('slow', 1);
                                let name = appli.Joueurs.TourJoueur(appli.tour, true);
                                if (name === 'Joueur1')
                                    appli.Joueurs.scores.Joueur1++;
                                else
                                    appli.Joueurs.scores.Joueur2++;
                                appli.tour = 0;
                                appli.score();
                                appli.BacktoMenu();
                                appli.Token(appli.Joueurs.TourJoueur(appli.tour + 1));
                            });
                        },
                        duration: 3000,
                    }
                );
                let ctx = $('.restart-play_canvas')[0].getContext('2d');
                let reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
                window.requestAnimationFrame = reqAnimFrame;
                let curPos = 0;
                (function arrowMaker(toGoPosition, midLinePos) {
                    ctx.clearRect(85, 135, toGoPosition, 40);
                    ctx.clearRect(85, 122, midLinePos, 6);
                    ctx.clearRect(85, 75, toGoPosition, 40);
                    curPos = curPos + 0.5;
                    if (curPos < 60)
                    {
                        requestAnimationFrame(function () {
                            arrowMaker(curPos, curPos * 2);
                        });
                    }
                })();
            });
        }
        BacktoMenu()
        {
            $('.puissance4 .time').append('<button class=\"menu\">Menu</button>');
            $('.menu').css({
                'background-color': 'white',
                'border': '1px solid black',
                'border-radius': '4px',
                'padding' : '10px'
            });
        }
        score()
        {
            $('.scoreGrille').html('<ul><h4 class=\"center\">Score</h4><br><li><p>'+ 'Joueur 1 (' +this.Joueurs.Joueur1+') : '+this.Joueurs.scores.Joueur1 + '</p></li>' +
            '<li><p>'+ 'Joueur 2 (' +this.Joueurs.Joueur2+') : '+this.Joueurs.scores.Joueur2+'</p></li></ul>');
            $('.scoreGrille ul, .scoreGrille li').css({
                'list-style': 'none'
            });
        }
        Token(color)
        {
            $('.pickerContainer').html('<canvas class="token" height=\"80px\" width=\"80px\"></canvas>');
            let $canvas = $('.pickerContainer .token'),
                ctx = $canvas[0].getContext('2d');
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(40, 40, 40, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            $canvas.css({
                position: 'absolute',
                left: '0%',
                bottom: '0%',
                'z-index': 3

            })
        }
        BoutonUndo(color)
        {
            if ($('.puissance4 .undo').length === 0)
                $('.puissance4 .time').append('<div><button class=\"undo\">Annuler</button></div>');
            else if (this.tour === 0)
                $('.puissance4 .undo').remove();
            $('.undo').css({
                'margin-top': '12.5px'
            });
            $('.puissance4 .undo').css({
                display: 'flex',
                backgroundColor: color,
                border: '1px solid rgba(0, 0, 0, .3)',
                'border-radius': '4px',
                padding: '20px',
                cursor: 'pointer'
            });
        }
        
        // Timer()
        // {
        //     if($('.puissance4 .time').length === 0)

        //         $('.puissance4').append('<div class=\"time\"><h4 class=\"center\">Chrono</h4><p><span id="minutes">00</span>:<span id="second">00</span></p></div')
        //     var start = document.querySelector('[data-action="start"]');
        //     var min = document.querySelector('#minutes');
        //     var sec = document.querySelector('#second');
        //     let timer = 00;
        //     let interval;
        //     let isRunning = false; 

        //     function incrementChrono()
        //     {
        //         timer++;
        //         const nbMin = Math.floor(timer/60);
        //         const nbSec = timer % 60;
                
        //         sec.innerText = pad(nbSec);
        //         sec.innerHTML = pad(nbMin);
        //     }

        //     function pad(number)
        //     {
        //         return (number < 10) ? '0' + number : number;
        //     }

        //     function startChrono()
        //     {
        //         if(isRunning) return;

        //         isRunning = true;
        //         interval
        //     }
        //     start.addEventListener('click', startChrono);

        // };
    }


    class Joueurs {
        constructor(Joueur1, Joueur2)
        {
            this.Joueur1 = Joueur1;
            this.Joueur2 = Joueur2;
            this.scores = {
                'Joueur1': 0,
                'Joueur2': 0
            };
        }
        
        TourJoueur(tour, name = false)
        {
            if (name !== false)
            {
                if (tour % 2 === 1)
                {
                    return 'Joueur1';
                }
                else
                {
                    return 'Joueur2';
                }
            }
            if (tour % 2 === 1)
            {
                return this.Joueur1;
            }
            else
            {
                return this.Joueur2;
            }
        }
    }
    class gameGrille {
        constructor(x, y)
        {
            this.x = x;
            this.y = y;
            let Grille = [];
            for (let count = 0; count < y; count++)
            {
                let subArray = [];
                for (let counter = 0; counter < x; counter++)
                {
                    subArray.push('0');
                }
                Grille[count] = subArray;
            }
            this.history = [];
            this.Grille = Grille;
            this.createGrille(x, y);
            this.StyleGrille();
        }
        createGrille(x, y)
        {
            let string = '';
            for (let count = 0; count < x; count++)
            {
                string += "<canvas id='x_" + count + "' class='PlayJeton' width='100' height='100'></canvas>";
            }
            string = '<span class=\'inline\'>' + string + '</span>';
            for (let count = 0; count < y; count++)
            {
                string += '<span class=\'inline\'>';
                for (let counter = 0; counter < x; counter++)
                {
                    string += "<canvas class='canvasGrille x_"+counter+"y_"+(y - count - 1)+"' width='100' height='100'></canvas>";
                }
                string += '</span>';
            }
            $('.puissance4').html(
                '<div class=\"container-fluid\">'+
                    '<div class=\"row\">'+
                    '<div class="pickerContainer"></div>'+

                        '<div class="\col-3\ score">'+
                            '<div class=\"scoreGrille\"></div>'+
                        '</div>'+
                        
                        '<div class=\"col-6\">'+
                            '<div class=\"logo\"></div>'+
                        '</div>'+
                        
                        '<div class=\"col-3 time \">'+
                        '</div>'+
                    '</div>'+

                    '<div class=\"row\">'+
                        '<div class="\col-2\">'+
                        '</div>'+

                        '<div class=\"col-8\">'+
                            '<div class=\"Grille\">'+
                                string+
                                '<div class=\"socle\"></div>'+
                            '</div>'+
                        '</div>'+

                        '<div class="\col-2 menu-menu\">'+
                        '</div>'+
                        
                    '</div>'+

                        
                '</div>');
        }
        StyleGrille()
        {
            $('.puissance4 *').css('padding', '0').css('margin', '0');
            $('.puissance4 .Grille')
                .css({
                display: 'flex',
                'flex-direction': 'column'
                }). 
                css('text-align', 'center');
            $('li').css('list-style', 'none');
            $('.inline').css({
                'margin-top': '-9px',
                'z-index': '1'
            });
            $('.socle').
            css('text-align', 'center').
            css('width', '100%').
            css('height', '25px').
            css('background-color', '#E0FEFE').
            css('margin', '-10px 0px 15px 0').
            css('box-shadow', '0em 25px 2em -2px black');

            $('.canvasGrille').each(function (key, data) {
                let ctx = $('.canvasGrille')[key].getContext('2d');
                ctx.fillStyle = '#E0FEFE';
                ctx.beginPath();
                ctx.fillRect(0, 0, 100, 100);
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(50, 50, 40, 0, Math.PI*2, true);
                ctx.fill();
            });
            $('.PlayJeton').each(function (key, data) {
                let ctx = $('.PlayJeton')[key].getContext('2d');
                ctx.fillStyle = 'white';
                ctx.rect(10, 10, 80, 80);
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'white';
                ctx.stroke();
            });
            $('.PlayJeton').css({
                'cursor': 'pointer'
            });
        }
       
        getCase(myColor, x, y = 0)
        {
            if (y >= this.y)
            {
                return null;
            }
            else if (this.Grille[y][x] !== '0')
            {
                return this.getCase(myColor, x, y + 1);
            }
            else
            {
                return y;
            }
        }
        setCase(myColor, x, y)
        {
            this.Grille[y][x] = myColor;
            if (myColor !== '0')
                this.history.push({y: y, x: x});
        }
        
        colorCase(myColor, x, y)
        {
            let posObj = $('.canvasGrille.x_'+x+'y_'+y).offset();
            posObj.top = posObj.top + 92;
            $('.puissance4').prepend('<canvas class=\"token x_'+ x +'y_'+y+'\" width=\"100px\" height=\"'+posObj.top + 'px\"></canvas>');
            $('.token.x_'+x+'y_'+y).css({
                position: 'absolute',
                left: posObj.left + 'px'
            });
            let canvas = $('.token.x_'+x+'y_'+y)[0];
            let ctx = canvas.getContext('2d');
            ctx.fillStyle = myColor;
            ctx.fill();
            let reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            window.requestAnimationFrame = reqAnimFrame;
            (function bounceAnimate(vy = 2, x = 50, y = 50, radius = 40) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                ctx.fillStyle = myColor;
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
                if (y + vy > canvas.height - 42.5 || y + vy < 0)
                {
                    vy = -vy;
                    vy = vy * 0.20;
                }
                requestAnimationFrame(function () {
                    bounceAnimate(vy * 1.01 + .25, x, y + vy, radius);
                });
            })();
        }
        undo()
        {
            let pos = this.history[this.history.length - 1];
                $('.token.x_'+pos.x+'y_'+pos.y).remove();
            this.history.pop();
        }
    }

    class menu {
        constructor() {
            this.createMenu();
            this.style();
        }
        createMenu()
        {
            $('.puissance4').html(
                "<div class='menu-puissance4'>"+
                "<h4 class='center' style='font-family: 'Sen''>Menu</h4>"+
                "<hr style='size:4; width:100%; color:black'>"+
                "<h5 style='text-align:center; margin-bottom: 5%'>Jetons</h5>"+

                "<div class='choixjetons'><span class='flex'>Joueur n°1:" +
                "<select id='Joueur1Color'>"+
                "<option selected value='#C7CEEA' name='violet'>Violet</option>"+
                "<option value='#FFDAC1' name='orange'>Orange</option>"+
                "<option value='#fddfdf' name='rose'>Rose</option>"+
                "<option value='#FFFFD8' name='jaune'>Jaune</option></div>"+

                "</select></span>"+
                "<div class='choixjetons'><span class='flex'>Joueur n°2:"+
                "<select id='Joueur2Color'>"+
                "<option value='#C7CEEA' name='violet'>Violet</option>"+
                "<option value='#FFDAC1' name='orange'>Orange</option>"+
                "<option selected value='#fddfdf' name='rose'>Rose</option>"+
                "<option value='#FFFFD8' name=''>Jaune</option>"+
                "</select></span></div>" +

                "<h5 style='text-align:center;  margin-bottom: 5%; margin-top: 10%'>Grille</h5>"+
                "<span>Nombre de colonnes:  <select id='x'></select></span><br><br><br>"+
                "<span>Nombre de lignes:  <select id='y'></select></span><br>"+
                "<span class='center'><button id='start_game'>C'est parti !</button></span>"+
                "</div>"
            );
            for (let count = 4; count < 12; count++)
            {
                $('#x').append("<option value'"+count+"'>"+count+"</option>");
                $('#y').append("<option value'"+count+"'>"+count+"</option>");
            }
        }
        style()
        {
            $('.menu-puissance4').
            css('display', 'flex').
            css('border', '1px solid pink').
            css('flex-direction', 'column').
            css('width', '38%').
            css('padding', '5%').
            css('margin', 'auto').
            css('margin-top', '10%').
            css('line-height', '5px');

            $('.menu-puissance4 p').css('font-size', '10px');
            $('.flex').css('display', 'flex').
            css('justify-content', 'space-between').
            css('margin-top', '10px').
            css('align-items', '10px').
            css('align-items','center');
            

            $('.center').css('text-align', 'center'). css('display', 'block');
            $('.menu-puissance4 .flex select').css('width', '50%');
            $('.puissance4').css('font-family', 'Sen').css('font-size','18px');
            $('.center').
            css('font-family', 'Sen').
            css('font-size', '35px');

            $('#start_game').
            css('padding', '5%').
            css('margin-top', '10%').
            css('border-radius', '15px').
            css('font-size', '20px').
            css('text-align', 'center').
            css('background-color', '#C7CEEA').
            css('color', 'white')

            $('select').
            css('border-radius', '10px').
            css('padding', '5px');

            $('.choixjetons').
            css('display','inline').
            css('padding-top','25px')
            ;


        }
    }
    let $selector = $(this);
    this.attr('class', 'puissance4');
    new menu();


    $(document).on('click', '#start_game', function () {
        if ($('#Joueur1Color').val() === $('#Joueur2Color').val())
        {
            alert('Les couleurs choisies pour les joueurs doivent être différentes');
        }
        else
        {
            let Joueur1 = $('#Joueur1Color').val();
            let Joueur2 = $('#Joueur2Color').val();
            let x = $('#x').val();
            let y = $('#y').val();
            if (typeof mypuissance4 === 'undefined')
            {
                mypuissance4 = new p4(x, y, Joueur1, Joueur2);
            }
            else
            {
                mypuissance4.Grille = new gameGrille(x, y);
                mypuissance4.Joueurs = new Joueurs(Joueur1, Joueur2);
                mypuissance4.tour = 0;
                mypuissance4.score();
                mypuissance4.BacktoMenu();
                mypuissance4.Token(mypuissance4.Joueurs.TourJoueur(mypuissance4.tour + 1));
            }
        }
    });
};