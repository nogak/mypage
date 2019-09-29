'use strict';
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
// let focus_x = canvas.width/2;
// let focus_y = canvas.height - 30;
// let focus = [0, 0];

let cell_size = Math.floor(canvas.height/15);
const grid_width =  Math.floor(canvas.width/cell_size); //小数点切り捨て
const base_point = [Math.floor(grid_width/2*cell_size), cell_size*6];

let face0 = [[1, 1, 1],[1, 1, 1],[1, 1, 1]];
let face1 = [[2, 2, 2],[2, 2, 2],[2, 2, 2]];
let face2 = [[3, 3, 3],[3, 3, 3],[3, 3, 3]];
let face3 = [[4, 4, 4],[4, 4, 4],[4, 4, 4]];
let face4 = [[5, 5, 5],[5, 5, 5],[5, 5, 5]];
let face5 = [[6, 6, 6],[6, 6, 6],[6, 6, 6]];
let face = [face0, face1, face2, face3, face4, face5];
let focus = [0, 1, 1]; // face_num, x, y
let grid_focus = false;
// console.log(face[0][2])

let frame_counter = 0;
let right_pressed = false;
let left_pressed = false;
let down_pressed = false;
let up_pressed = false;
let space_pressed = false;
// ctx.lineWidth = 1;右

function rotate(){
    // const buf_face = Array.from(face);
    const buf_face = JSON.parse(JSON.stringify(face));
    if(right_pressed && frame_counter > 10 && grid_focus){
        frame_counter = 0;
        // rotate
        if(focus[0] == 0 || focus[0] == 3 || focus[0] == 4 || focus[0] == 5){
            face[0][focus[2]] = buf_face[3][focus[2]];
            face[4][focus[2]] = buf_face[0][focus[2]];
            face[5][focus[2]] = buf_face[4][focus[2]];
            face[3][focus[2]] = buf_face[5][focus[2]];
            // 上面回転（反時計）
            if(focus[2] == 0){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[1][i][j] = buf_face[1][j][2-i];
                    }
                }
            }
            // 底面回転（時計）
            if(focus[2] == 2){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[2][i][j] = buf_face[2][2-j][i];
                    }
                }
            }
        }else if(focus[0] == 1){
            face[1][focus[2]] = [buf_face[3][2][focus[2]], buf_face[3][1][focus[2]], buf_face[3][0][focus[2]]];
            [face[4][0][2-focus[2]], face[4][1][2-focus[2]], face[4][2][2-focus[2]]] = buf_face[1][focus[2]];
            face[2][2-focus[2]] = [buf_face[4][2][2-focus[2]], buf_face[4][1][2-focus[2]], buf_face[4][0][2-focus[2]]];
            [face[3][0][focus[2]], face[3][1][focus[2]], face[3][2][focus[2]]] = buf_face[2][2-focus[2]];
            
            if(focus[2] == 2){
                // 回転（時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[0][i][j] = buf_face[0][2-j][i];
                    }
                }
            }else if(focus[2] == 0){
                // 回転（反時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[5][i][j] = buf_face[5][j][2-i];
                    }
                }
            }
        }else if(focus[0] == 2){
            face[1][2-focus[2]] = [buf_face[4][2][focus[2]], buf_face[4][1][focus[2]], buf_face[4][0][focus[2]]];
            [face[4][0][focus[2]], face[4][1][focus[2]], face[4][2][focus[2]]] = buf_face[2][focus[2]];
            face[2][focus[2]] = [buf_face[3][2][2-focus[2]], buf_face[3][1][2-focus[2]], buf_face[3][0][2-focus[2]]];
            [face[3][0][2-focus[2]], face[3][1][2-focus[2]], face[3][2][2-focus[2]]] = buf_face[1][2-focus[2]];

            if(focus[2] == 0){
                // 回転（反時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[0][i][j] = buf_face[0][j][2-i];
                    }
                }
            }else if(focus[2] == 2){
                // 回転（時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[5][i][j] = buf_face[5][2-j][i];
                    }
                }
            }
        }

    }else if(left_pressed && frame_counter > 10 && grid_focus){
        frame_counter = 0;
        // rotate
        if(focus[0] == 0 || focus[0] == 3 || focus[0] == 4 || focus[0] == 5){
            face[0][focus[2]] = buf_face[4][focus[2]];
            face[4][focus[2]] = buf_face[5][focus[2]];
            face[5][focus[2]] = buf_face[3][focus[2]];
            face[3][focus[2]] = buf_face[0][focus[2]];
            // 底面回転（反時計）
            if(focus[2] == 2){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[2][i][j] = buf_face[2][j][2-i];
                    }
                }
            }
            // 上面回転（時計）
            if(focus[2] == 0){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[1][i][j] = buf_face[1][2-j][i];
                    }
                }
            }
        }else if(focus[0] == 2){
            face[1][2-focus[2]] = [buf_face[3][2][2-focus[2]], buf_face[3][1][2-focus[2]], buf_face[3][0][2-focus[2]]];
            [face[4][0][focus[2]], face[4][1][focus[2]], face[4][2][focus[2]]] = buf_face[1][2-focus[2]];
            face[2][focus[2]] = [buf_face[4][2][focus[2]], buf_face[4][1][focus[2]], buf_face[4][0][focus[2]]];
            [face[3][0][2-focus[2]], face[3][1][2-focus[2]], face[3][2][2-focus[2]]] = buf_face[2][focus[2]];
            
            if(focus[2] == 0){
                // 回転（時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[0][i][j] = buf_face[0][2-j][i];
                    }
                }
            }else if(focus[2] == 2){
                // 回転（反時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[5][i][j] = buf_face[5][j][2-i];
                    }
                }
            }
        }else if(focus[0] == 1){
            face[1][focus[2]] = [buf_face[4][2][2-focus[2]], buf_face[4][1][2-focus[2]], buf_face[4][0][2-focus[2]]];
            [face[4][0][2-focus[2]], face[4][1][2-focus[2]], face[4][2][2-focus[2]]] = buf_face[2][2-focus[2]];
            face[2][2-focus[2]] = [buf_face[3][2][focus[2]], buf_face[3][1][focus[2]], buf_face[3][0][focus[2]]];
            [face[3][0][focus[2]], face[3][1][focus[2]], face[3][2][focus[2]]] = buf_face[1][focus[2]];

            if(focus[2] == 2){
                // 回転（反時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[0][i][j] = buf_face[0][j][2-i];
                    }
                }
            }else if(focus[2] == 0){
                // 回転（時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[5][i][j] = buf_face[5][2-j][i];
                    }
                }
            }
        }
    }else if(up_pressed && frame_counter > 10 && grid_focus){
        frame_counter = 0;
        // rotate
        if(focus[0] == 2 || focus[0] == 0 || focus[0] == 1 || focus[0] == 5){
            [face[2][0][focus[1]], face[2][1][focus[1]], face[2][2][focus[1]]] = [buf_face[5][2][2-focus[1]], buf_face[5][1][2-focus[1]], buf_face[5][0][2-focus[1]]];
            [face[0][0][focus[1]], face[0][1][focus[1]], face[0][2][focus[1]]] = [buf_face[2][0][focus[1]], buf_face[2][1][focus[1]], buf_face[2][2][focus[1]]];
            [face[1][0][focus[1]], face[1][1][focus[1]], face[1][2][focus[1]]] = [buf_face[0][0][focus[1]], buf_face[0][1][focus[1]], buf_face[0][2][focus[1]]];
            [face[1][0][focus[1]], face[1][1][focus[1]], face[1][2][focus[1]]] = [buf_face[0][0][focus[1]], buf_face[0][1][focus[1]], buf_face[0][2][focus[1]]];
            [face[5][2][2-focus[1]], face[5][1][2-focus[1]], face[5][0][2-focus[1]]] = [buf_face[1][0][focus[1]], buf_face[1][1][focus[1]], buf_face[1][2][focus[1]]];

            // 左面回転（反時計）
            if(focus[1] == 0){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[3][i][j] = buf_face[3][j][2-i];
                    }
                }
            }
            // 右面回転（時計）
            if(focus[1] == 2){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[4][i][j] = buf_face[4][2-j][i];
                    }
                }
            }
        }else if(focus[0] == 3){
            [face[3][0][focus[1]], face[3][1][focus[1]], face[3][2][focus[1]]] = buf_face[2][2-focus[1]];
            face[1][focus[1]] = [buf_face[3][2][focus[1]], buf_face[3][1][focus[1]], buf_face[3][0][focus[1]]];
            [face[4][0][2-focus[1]], face[4][1][2-focus[1]], face[4][2][2-focus[1]]] = buf_face[1][focus[1]];
            face[2][2-focus[1]] = [buf_face[4][2][2-focus[1]], buf_face[4][1][2-focus[1]], buf_face[4][0][2-focus[1]]];

            if(focus[1] == 2){
                // 回転（時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[0][i][j] = buf_face[0][2-j][i];
                    }
                }
            }else if(focus[1] == 0){
                // 回転（反時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[5][i][j] = buf_face[5][j][2-i];
                    }
                }
            }
        }else if(focus[0] == 4){
            [face[3][0][2-focus[1]], face[3][1][2-focus[1]], face[3][2][2-focus[1]]] = buf_face[2][focus[1]];
            face[1][2-focus[1]] = [buf_face[3][2][2-focus[1]], buf_face[3][1][2-focus[1]], buf_face[3][0][2-focus[1]]];
            [face[4][0][focus[1]], face[4][1][focus[1]], face[4][2][focus[1]]] = buf_face[1][2-focus[1]];
            face[2][focus[1]] = [buf_face[4][2][focus[1]], buf_face[4][1][focus[1]], buf_face[4][0][focus[1]]];

            if(focus[2] == 2){
                // 回転（反時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[0][i][j] = buf_face[0][j][2-i];
                    }
                }
            }else if(focus[2] == 0){
                // 回転（時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[5][i][j] = buf_face[5][2-j][i];
                    }
                }
            }
        }
    }else if(down_pressed && frame_counter > 10 && grid_focus){
        frame_counter = 0;
        // rotate
        if(focus[0] == 2 || focus[0] == 0 || focus[0] == 1 || focus[0] == 5){
            [face[1][0][focus[1]], face[1][1][focus[1]], face[1][2][focus[1]]] = [buf_face[5][2][2-focus[1]], buf_face[5][1][2-focus[1]], buf_face[5][0][2-focus[1]]];
            [face[0][0][focus[1]], face[0][1][focus[1]], face[0][2][focus[1]]] = [buf_face[1][0][focus[1]], buf_face[1][1][focus[1]], buf_face[1][2][focus[1]]];
            [face[2][0][focus[1]], face[2][1][focus[1]], face[2][2][focus[1]]] = [buf_face[0][0][focus[1]], buf_face[0][1][focus[1]], buf_face[0][2][focus[1]]];
            [face[5][2][2-focus[1]], face[5][1][2-focus[1]], face[5][0][2-focus[1]]] = [buf_face[2][0][focus[1]], buf_face[2][1][focus[1]], buf_face[2][2][focus[1]]];

            // 左面回転（時計）
            if(focus[1] == 0){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[3][i][j] = buf_face[3][2-j][i];
                    }
                }
            }
            // 右面回転（反時計）
            if(focus[1] == 2){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[4][i][j] = buf_face[4][j][2-i];
                    }
                }
            }
        }else if(focus[0] == 3){
            [face[3][0][focus[1]], face[3][1][focus[1]], face[3][2][focus[1]]] = buf_face[2][2-focus[1]];
            face[1][focus[1]] = [buf_face[3][2][focus[1]], buf_face[3][1][focus[1]], buf_face[3][0][focus[1]]];
            [face[4][0][2-focus[1]], face[4][1][2-focus[1]], face[4][2][2-focus[1]]] = buf_face[1][focus[1]];
            face[2][2-focus[1]] = [buf_face[4][2][2-focus[1]], buf_face[4][1][2-focus[1]], buf_face[4][0][2-focus[1]]];

            if(focus[1] == 2){
                // 回転（時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[0][i][j] = buf_face[0][2-j][i];
                    }
                }
            }else if(focus[1] == 0){
                // 回転（反時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[5][i][j] = buf_face[5][j][2-i];
                    }
                }
            }
        }else if(focus[0] == 4){
            [face[3][0][2-focus[1]], face[3][1][2-focus[1]], face[3][2][2-focus[1]]] = buf_face[2][focus[1]];
            face[1][2-focus[1]] = [buf_face[3][2][2-focus[1]], buf_face[3][1][2-focus[1]], buf_face[3][0][2-focus[1]]];
            [face[4][0][focus[1]], face[4][1][focus[1]], face[4][2][focus[1]]] = buf_face[1][2-focus[1]];
            face[2][focus[1]] = [buf_face[4][2][focus[1]], buf_face[4][1][focus[1]], buf_face[4][0][focus[1]]];

            if(focus[2] == 2){
                // 回転（反時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[0][i][j] = buf_face[0][j][2-i];
                    }
                }
            }else if(focus[2] == 0){
                // 回転（時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[5][i][j] = buf_face[5][2-j][i];
                    }
                }
            }
        }
    }
}

function select_target(){
    if(space_pressed){
        space_pressed = false;
        console.log('1')
        if(grid_focus){
            grid_focus = false;
        }else{
            grid_focus = true;
        }
    }

}

//-----------------------------------
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_grid();
    draw_base_point();
    let face_buf = return_face(1);
    // console.log(face_buf);
    for(let i=0; i <= 5; i++){
        draw_cube(i);
    }
    draw_cursor();
    move_cursor();
    select_target();
    rotate();
    frame_counter++;
    requestAnimationFrame(draw);
}
// setInterval(draw, 10);
draw();

function draw_grid(){
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'gray';
    // horizontal line
    for(let i=0.0; i < canvas.height; i+=cell_size){
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
    }
    for(let i=0.0; i < canvas.width; i+=cell_size){
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
    }
    ctx.closePath();
    ctx.stroke();
}

function draw_base_point(){
    ctx.beginPath();
    ctx.fillStyle = 'black'
    ctx.arc(base_point[0], base_point[1], 3, 0, Math.PI*2, false);
    ctx.fill();
    ctx.closePath();
}

function return_face(num){
    return face[num];
}

function draw_cell(base_x, base_y, face_num){
    let count_1 = 0;
    let count_2 = 0;
    // 中身ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0; i<=2; i++){
        for(let j=0; j<=2; j++){
            if(face[face_num][i][j] == 1){
                // ctx.fillStyle = 'green'
                ctx.fillStyle = '#00FF00'
            }else if(face[face_num][i][j] == 2){
                ctx.fillStyle = 'white'
            }else if(face[face_num][i][j] == 3){
                ctx.fillStyle = 'yellow'
            }else if(face[face_num][i][j] == 4){
                ctx.fillStyle = 'orange'
            }else if(face[face_num][i][j] == 5){
                ctx.fillStyle = 'red'
            }else if(face[face_num][i][j] == 6){
                ctx.fillStyle = 'blue'
            }
            ctx.fillRect(base_x+cell_size*j, base_y+cell_size*i, cell_size, cell_size);
            count_1++;
        }
        count_2++;
    }
    // 枠線
    ctx.lineWidth = 1;
    for(let i=base_y; i<=base_y+cell_size*2; i+=cell_size){
        for(let j=base_x; j<=base_x+cell_size*2; j+=cell_size){
            ctx.strokeStyle = 'black'
            ctx.strokeRect(j, i, cell_size, cell_size);
        }
    }
}

function get_base_point(num){
    let base = new Array(2);
    if(num == 0){
        base[0] = base_point[0]-cell_size*3;
        base[1] = base_point[1];
    }else if(num == 1){
        base[0] = base_point[0]-cell_size*3;
        base[1] = base_point[1]-cell_size*3;
    }else if(num == 2){
        base[0] = base_point[0]-cell_size*3;
        base[1] = base_point[1]+cell_size*3;
    }else if(num == 3){
        base[0] = base_point[0]-cell_size*6;
        base[1] = base_point[1]
    }else if(num == 4){
        base[0] = base_point[0]
        base[1] = base_point[1]
    }else if(num == 5){
        base[0] = base_point[0]+cell_size*3
        base[1] = base_point[1]
    }
    return base;
}

function draw_cube(num){
    let base = new Array(2);
    ctx.beginPath();
    base = get_base_point(num);
    // ctx.arc(base[0], base[1], 3, 0, Math.PI*2, false);
    draw_cell(base[0], base[1], num);
    ctx.fill();

    ctx.closePath();
}

function move_cursor(){
    if(right_pressed && frame_counter > 10 && !grid_focus){
        if(focus[1] == 2){
            if(focus[0] == 3){
                focus = [0, 0, focus[2]];
            }else if(focus[0] == 0){
                focus = [4, 0, focus[2]];
            }else if(focus[0] == 4){
                focus = [5, 0, focus[2]];
            }
        }else{
            focus = [focus[0], focus[1]+1, focus[2]]
        }
        frame_counter = 0;
    }
    if(left_pressed && frame_counter > 10 && !grid_focus){
        if(focus[1] == 0){
            if(focus[0] == 5){
                focus = [4, 2, focus[2]];
            }else if(focus[0] == 4){
                focus = [0, 2, focus[2]];
            }else if(focus[0] == 0){
                focus = [3, 2, focus[2]];
            }
        }else{
            focus = [focus[0], focus[1]-1, focus[2]]
        }
        frame_counter = 0;
    }
    if(up_pressed && frame_counter > 10 && !grid_focus){
        if(focus[2] == 0){
            if(focus[0] == 2){
                focus = [0, focus[1], 2];
            }else if(focus[0] == 0){
                focus = [1, focus[1], 2];
            }
        }else{
            focus = [focus[0], focus[1], focus[2]-1]
        }
        frame_counter = 0;
    }
    if(down_pressed && frame_counter > 10 && !grid_focus){
        if(focus[2] == 2){
            if(focus[0] == 1){
                focus = [0, focus[1], 0];
            }else if(focus[0] == 0){
                focus = [2, focus[1], 0];
            }
        }else{
            focus = [focus[0], focus[1], focus[2]+1]
        }
        frame_counter = 0;
    }
}

function draw_cursor(){
    let base = new Array(2);
    base = get_base_point(focus[0]);
    if(grid_focus){
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'black'
    }else{
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FF00FF'
    }
    ctx.strokeRect(base[0]+cell_size*focus[1], base[1]+cell_size*focus[2], cell_size, cell_size);
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        right_pressed = true;
    }else if(e.key == "Left" || e.key == "ArrowLeft") {
        left_pressed = true;
    }else if(e.keyCode == 38){
        up_pressed = true;
    }else if(e.keyCode == 40){
        down_pressed = true;
    }else if(e.keyCode == 32){
        space_pressed = true;
    }
}
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        right_pressed = false;
    }else if(e.key == "Left" || e.key == "ArrowLeft") {
        left_pressed = false;
    }else if(e.keyCode == 38){
        up_pressed = false;
    }else if(e.keyCode == 40){
        down_pressed = false;
    }else if(e.keyCode == 32){
        space_pressed == false;
    }
}