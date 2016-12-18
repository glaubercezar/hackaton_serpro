angular.module("cognitiveChatBox").directive('ngDraggable', function($document, $rootScope, $cookies) {

    return {
        restrict: 'A',
        scope: {
            dragOptions: '=ngDraggable'
        },
        link: function(scope, elem) {

            var startX, startY, x = 0, y = 0,
                start, stop, drag, container, toMove, mv;

            // Obtain drag options
            if (scope.dragOptions) {
                start  = scope.dragOptions.start;
                drag   = scope.dragOptions.drag;
                stop   = scope.dragOptions.stop;
                var el = scope.dragOptions.container;

                if (el) {
                    if(el.charAt(0) == '#'){
                        container = document.getElementById(el.slice(1)).getBoundingClientRect();
                    }else{

                        if(el.charAt(0) == '.'){
                            container = document.getElementsByClassName(el.slice(1))[0].getBoundingClientRect();
                        }else{
                            container = document.getElementsByTagName(el)[0];
                        }
                    }
                }

                mv = scope.dragOptions.elemToMove;

                if (mv) {
                    if(mv.charAt(0) == '#'){
                        toMove = document.getElementById(mv.slice(1));
                    }else{

                        if(mv.charAt(0) == '.'){
                            toMove = document.getElementsByClassName(mv.slice(1))[0];
                        }else{
                            toMove = document.getElementsByTagName(mv)[0];
                        }
                    }

                    if(toMove){
                        toMove = angular.element(toMove);
                    }
                }
            }


            var width  = toMove.offsetWidth,
                height = toMove.offsetHeight;

            // Bind mousedown event
            elem.on('mousedown', function(e) {
                e.preventDefault();
                startX = e.clientX - toMove[0].offsetLeft;
                startY = e.clientY - toMove[0].offsetTop;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
                if (start) start(e);
            });

            // Handle drag event
            function mousemove(e) {
                y = e.clientY - startY;
                x = e.clientX - startX;
                setPosition();
                if (drag) drag(e);
            }

            // Unbind drag events
            function mouseup(e) {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
                if (stop) stop(e);
            }

            // Move element, within container if provided
            function setPosition() {
                if (container) {
                    if (x < container.left) {
                        x = container.left;
                    } else if (x > container.right - width) {
                        x = container.right - width;
                    }
                    if (y < container.top) {
                        y = container.top;
                    } else if (y > container.bottom - height) {
                        y = container.bottom - height;
                    }
                }

                $cookies.put('chatPosition', JSON.stringify({top: y+'px', left: x+'px'}), $rootScope.putOpts);

                toMove.css({
                    top: y + 'px',
                    left:  x + 'px'
                });
            }
        }
    }

});
