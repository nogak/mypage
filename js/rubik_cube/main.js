'use strict';
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
// let focus_x = canvas.width/2;
// let focus_y = canvas.height - 30;
// let focus = [0, 0];
ctx.lineWidth = 1;
let cell_size = Math.floor(canvas.height/15);
const grid_width =  Math.floor(canvas.width/cell_size); // round down to the nearest decimal
const base_point = [Math.floor(grid_width/2*cell_size), cell_size*6];

let face0 = [[1, 1, 1],[1, 1, 1],[1, 1, 1]];
let face1 = [[2, 2, 2],[2, 2, 2],[2, 2, 2]];
let face2 = [[3, 3, 3],[3, 3, 3],[3, 3, 3]];
let face3 = [[4, 4, 4],[4, 4, 4],[4, 4, 4]];
let face4 = [[5, 5, 5],[5, 5, 5],[5, 5, 5]];
let face5 = [[6, 6, 6],[6, 6, 6],[6, 6, 6]];
let face = [face0, face1, face2, face3, face4, face5];
// cursor positions data
let focus = [0, 1, 1]; // face_num, x, y
let grid_focus = false;
// console.log(face[0][2])

let frame_counter = 0;
let right_pressed = false;
let left_pressed = false;
let down_pressed = false;
let up_pressed = false;
let space_pressed = false;

// play parameter
let flag_shuffle = true;
let shuffle_count = 0;
let shuffle_num = 2;

//menu_param
let flag_start_menu = true;
let color_buf = [];
let select_mode = 0;
let menu_counter = 0;

// debug_mode
let debug_mode = false;
let char_place_x = 450

function start_select(){
    //print title
    ctx.fillStyle = 'white'
    ctx.fillRect(canvas.width/6, canvas.height/6, canvas.width*4/6, canvas.height*2/6);
    ctx.lineWidth = 3;
    ctx.strokeRect(canvas.width/6, canvas.height/6, canvas.width*4/6, canvas.height*2/6);
    ctx.font = "50px arial black";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Rubik Cube", canvas.width/2, canvas.height/3+20);
    
    //print mode select
    ctx.fillStyle = 'white'
    ctx.fillRect(canvas.width/8, canvas.height*4/6, canvas.width*6/8, canvas.height*1/6+20);
    ctx.font = "20px arial";
    ctx.strokeStyle = "#FF00FF";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Easy", canvas.width/4, canvas.height*3/4+10);
    ctx.fillText("Normal", canvas.width/2, canvas.height*3/4+10);
    ctx.fillText("Hard", canvas.width*3/4, canvas.height*3/4+10);
    ctx.font = "15px arial";
    ctx.fillText("Please select mode and press Enter or Space", canvas.width/2, canvas.height*3/4+40);

    //print select bar
    ctx.fillStyle = '#FF00FF'
    ctx.lineWidth = 3;
    if(select_mode == 0){
        ctx.strokeRect(canvas.width/2-155, canvas.height*3/4 - 13, 70, 30);
        shuffle_num = 2;
    }else if(select_mode == 1){
        ctx.strokeRect(canvas.width/2-38, canvas.height*3/4 - 13, 75, 30);
        shuffle_num = 5;
    }else if(select_mode == 2){
        ctx.strokeRect(canvas.width/2+85, canvas.height*3/4 - 13, 70, 30);
        shuffle_num = 10;
    }
}

function grid_color_random(mode){
    let color_rand;
    let color_counter = 0;
    if(mode == 1){
        color_buf = [];
        for(let i=0.0; i < canvas.width; i+=cell_size){
            for(let j=0.0; j < canvas.height; j+=cell_size){
                color_rand = Math.floor(Math.random()*7);
                color_buf.push(color_rand);
                if(color_rand == 1){
                    ctx.fillStyle = '#00FF00'
                }else if(color_rand == 2){
                    ctx.fillStyle = 'white'
                }else if(color_rand == 3){
                    ctx.fillStyle = 'yellow'
                }else if(color_rand == 4){
                    ctx.fillStyle = 'orange'
                }else if(color_rand == 5){
                    ctx.fillStyle = 'red'
                }else if(color_rand == 6){
                    ctx.fillStyle = 'blue'
                }
                ctx.fillRect(i, j, cell_size, cell_size);
            }
        }
    }else{
        for(let i=0.0; i < canvas.width; i+=cell_size){
            for(let j=0.0; j < canvas.height; j+=cell_size){
                color_rand = color_buf[color_counter];
                color_counter++;
                if(color_rand == 1){
                    ctx.fillStyle = '#00FF00'
                }else if(color_rand == 2){
                    ctx.fillStyle = 'white'
                }else if(color_rand == 3){
                    ctx.fillStyle = 'yellow'
                }else if(color_rand == 4){
                    ctx.fillStyle = 'orange'
                }else if(color_rand == 5){
                    ctx.fillStyle = 'red'
                }else if(color_rand == 6){
                    ctx.fillStyle = 'blue'
                }
                ctx.fillRect(i, j, cell_size, cell_size);
            }
        }
    }

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
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

function start_shuffle(){
    if(flag_shuffle){
        frame_counter = 100;
        let rotate_vector = Math.floor(Math.random()*4);
        focus[0] = Math.floor(Math.random()*6);
        focus[1] = Math.floor(Math.random()*3);
        focus[2] = Math.floor(Math.random()*3);
        shuffle_count++;
    }
    if(shuffle_count > shuffle_num){
        flag_shuffle = false;
    }
}

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
    // plot grid-line
    ctx.lineWidth = 1;
    for(let i=base_y; i<=base_y+cell_size*2; i+=cell_size){
        for(let j=base_x; j<=base_x+cell_size*2; j+=cell_size){
            ctx.strokeStyle = 'black'
            ctx.strokeRect(j, i, cell_size, cell_size);
        }
    }
    // plot bold line
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    ctx.strokeRect(base_x, base_y, cell_size*3, cell_size*3);

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

function rotate(){
    // const buf_face = Array.from(face);
    const buf_face = JSON.parse(JSON.stringify(face));
    let rotate_vector = Math.floor(Math.random()*4); // shuffle rotate vector before start

    if((right_pressed && frame_counter > 10 && grid_focus) || (flag_shuffle && rotate_vector == 0)){
        frame_counter = 0;
        // rotate
        if(focus[0] == 0 || focus[0] == 3 || focus[0] == 4 || focus[0] == 5){
            face[0][focus[2]] = buf_face[3][focus[2]];
            face[4][focus[2]] = buf_face[0][focus[2]];
            face[5][focus[2]] = buf_face[4][focus[2]];
            face[3][focus[2]] = buf_face[5][focus[2]];
            // top surface rotate（反時計）
            if(focus[2] == 0){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[1][i][j] = buf_face[1][j][2-i];
                    }
                }
            }
            // bottom surface rotate（時計）
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
                // rotate（時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[0][i][j] = buf_face[0][2-j][i];
                    }
                }
            }else if(focus[2] == 0){
                // rotate（反時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[5][i][j] = buf_face[5][j][2-i];
                    }
                }
            }
        }else if(focus[0] == 2){
            face[1][2-focus[2]] = [buf_face[4][0][focus[2]], buf_face[4][1][focus[2]], buf_face[4][2][focus[2]]];
            [face[4][2][focus[2]], face[4][1][focus[2]], face[4][0][focus[2]]] = buf_face[2][focus[2]];
            face[2][focus[2]] = [buf_face[3][0][2-focus[2]], buf_face[3][1][2-focus[2]], buf_face[3][2][2-focus[2]]];
            [face[3][2][2-focus[2]], face[3][1][2-focus[2]], face[3][0][2-focus[2]]] = buf_face[1][2-focus[2]];

            if(focus[2] == 0){
                // rotate（反時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[0][i][j] = buf_face[0][j][2-i];
                    }
                }
            }else if(focus[2] == 2){
                // totate（時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[5][i][j] = buf_face[5][2-j][i];
                    }
                }
            }
        }

    }else if((left_pressed && frame_counter > 10 && grid_focus) || (flag_shuffle && rotate_vector == 1)){
        frame_counter = 0;
        // rotate
        if(focus[0] == 0 || focus[0] == 3 || focus[0] == 4 || focus[0] == 5){
            face[0][focus[2]] = buf_face[4][focus[2]];
            face[4][focus[2]] = buf_face[5][focus[2]];
            face[5][focus[2]] = buf_face[3][focus[2]];
            face[3][focus[2]] = buf_face[0][focus[2]];
            // bottom surface rotate（反時計）
            if(focus[2] == 2){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[2][i][j] = buf_face[2][j][2-i];
                    }
                }
            }
            // top surface rotate（時計）
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
                // rotate（時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[0][i][j] = buf_face[0][2-j][i];
                    }
                }
            }else if(focus[2] == 2){
                // rotate（反時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[5][i][j] = buf_face[5][j][2-i];
                    }
                }
            }
        }else if(focus[0] == 1){
            face[1][focus[2]] = [buf_face[4][0][2-focus[2]], buf_face[4][1][2-focus[2]], buf_face[4][2][2-focus[2]]];
            [face[4][2][2-focus[2]], face[4][1][2-focus[2]], face[4][0][2-focus[2]]] = buf_face[2][2-focus[2]];
            face[2][2-focus[2]] = [buf_face[3][0][focus[2]], buf_face[3][1][focus[2]], buf_face[3][2][focus[2]]];
            [face[3][2][focus[2]], face[3][1][focus[2]], face[3][0][focus[2]]] = buf_face[1][focus[2]];

            if(focus[2] == 2){
                // rotate（反時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[0][i][j] = buf_face[0][j][2-i];
                    }
                }
            }else if(focus[2] == 0){
                // rotate（時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[5][i][j] = buf_face[5][2-j][i];
                    }
                }
            }
        }
    }else if((up_pressed && frame_counter > 10 && grid_focus) || (flag_shuffle && rotate_vector == 2)){
        frame_counter = 0;
        // rotate
        if(focus[0] == 2 || focus[0] == 0 || focus[0] == 1){
            [face[2][0][focus[1]], face[2][1][focus[1]], face[2][2][focus[1]]] = [buf_face[5][2][2-focus[1]], buf_face[5][1][2-focus[1]], buf_face[5][0][2-focus[1]]];
            [face[0][0][focus[1]], face[0][1][focus[1]], face[0][2][focus[1]]] = [buf_face[2][0][focus[1]], buf_face[2][1][focus[1]], buf_face[2][2][focus[1]]];
            [face[1][0][focus[1]], face[1][1][focus[1]], face[1][2][focus[1]]] = [buf_face[0][0][focus[1]], buf_face[0][1][focus[1]], buf_face[0][2][focus[1]]];
            [face[5][2][2-focus[1]], face[5][1][2-focus[1]], face[5][0][2-focus[1]]] = [buf_face[1][0][focus[1]], buf_face[1][1][focus[1]], buf_face[1][2][focus[1]]];

            // left surface rotate（反時計）
            if(focus[1] == 0){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[3][i][j] = buf_face[3][j][2-i];
                    }
                }
            }
            // right surface rotate（時計）
            if(focus[1] == 2){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[4][i][j] = buf_face[4][2-j][i];
                    }
                }
            }
        }else if(focus[0] == 5){
            [face[1][0][2-focus[1]], face[1][1][2-focus[1]], face[1][2][2-focus[1]]] = [buf_face[5][2][focus[1]], buf_face[5][1][focus[1]], buf_face[5][0][focus[1]]];
            [face[0][0][2-focus[1]], face[0][1][2-focus[1]], face[0][2][2-focus[1]]] = [buf_face[1][0][2-focus[1]], buf_face[1][1][2-focus[1]], buf_face[1][2][2-focus[1]]];
            [face[2][0][2-focus[1]], face[2][1][2-focus[1]], face[2][2][2-focus[1]]] = [buf_face[0][0][2-focus[1]], buf_face[0][1][2-focus[1]], buf_face[0][2][2-focus[1]]];
            [face[5][2][focus[1]], face[5][1][focus[1]], face[5][0][focus[1]]] = [buf_face[2][0][2-focus[1]], buf_face[2][1][2-focus[1]], buf_face[2][2][2-focus[1]]];

            if(focus[1] == 0){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[4][i][j] = buf_face[4][j][2-i];
                    }
                }
            }
            if(focus[1] == 2){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[3][i][j] = buf_face[3][2-j][i];
                    }
                }
            }
        }else if(focus[0] == 3){
            [face[3][0][focus[1]], face[3][1][focus[1]], face[3][2][focus[1]]] = buf_face[2][2-focus[1]];
            face[1][focus[1]] = [buf_face[3][2][focus[1]], buf_face[3][1][focus[1]], buf_face[3][0][focus[1]]];
            [face[4][0][2-focus[1]], face[4][1][2-focus[1]], face[4][2][2-focus[1]]] = buf_face[1][focus[1]];
            face[2][2-focus[1]] = [buf_face[4][2][2-focus[1]], buf_face[4][1][2-focus[1]], buf_face[4][0][2-focus[1]]];

            if(focus[1] == 2){
                // rotate（時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[0][i][j] = buf_face[0][2-j][i];
                    }
                }
            }else if(focus[1] == 0){
                // rotate（反時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[5][i][j] = buf_face[5][j][2-i];
                    }
                }
            }
        }else if(focus[0] == 4){
            [face[3][2][2-focus[1]], face[3][1][2-focus[1]], face[3][0][2-focus[1]]] = buf_face[1][2- focus[1]];
            face[1][2-focus[1]] = [buf_face[4][0][focus[1]], buf_face[4][1][focus[1]], buf_face[4][2][focus[1]]];
            [face[4][2][focus[1]], face[4][1][focus[1]], face[4][0][focus[1]]] = buf_face[2][focus[1]];
            face[2][focus[1]] = [buf_face[3][0][2-focus[1]], buf_face[3][1][2-focus[1]], buf_face[3][2][2-focus[1]]];

            if(focus[1] == 0){
                // rotate（反時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[0][i][j] = buf_face[0][j][2-i];
                    }
                }
            }else if(focus[1] == 2){
                // rotate（時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[5][i][j] = buf_face[5][2-j][i];
                    }
                }
            }
        }
    }else if((down_pressed && frame_counter > 10 && grid_focus) || (flag_shuffle && rotate_vector == 3)){
        frame_counter = 0;
        // rotate
        if(focus[0] == 2 || focus[0] == 0 || focus[0] == 1){
            [face[1][0][focus[1]], face[1][1][focus[1]], face[1][2][focus[1]]] = [buf_face[5][2][2-focus[1]], buf_face[5][1][2-focus[1]], buf_face[5][0][2-focus[1]]];
            [face[0][0][focus[1]], face[0][1][focus[1]], face[0][2][focus[1]]] = [buf_face[1][0][focus[1]], buf_face[1][1][focus[1]], buf_face[1][2][focus[1]]];
            [face[2][0][focus[1]], face[2][1][focus[1]], face[2][2][focus[1]]] = [buf_face[0][0][focus[1]], buf_face[0][1][focus[1]], buf_face[0][2][focus[1]]];
            [face[5][2][2-focus[1]], face[5][1][2-focus[1]], face[5][0][2-focus[1]]] = [buf_face[2][0][focus[1]], buf_face[2][1][focus[1]], buf_face[2][2][focus[1]]];

            // left surface rotate（時計）
            if(focus[1] == 0){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[3][i][j] = buf_face[3][2-j][i];
                    }
                }
            }
            // right surface rotate（反時計）
            if(focus[1] == 2){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[4][i][j] = buf_face[4][j][2-i];
                    }
                }
            }
        }else if(focus[0] == 5){
            [face[2][0][2-focus[1]], face[2][1][2-focus[1]], face[2][2][2-focus[1]]] = [buf_face[5][2][focus[1]], buf_face[5][1][focus[1]], buf_face[5][0][focus[1]]];
            [face[0][0][2-focus[1]], face[0][1][2-focus[1]], face[0][2][2-focus[1]]] = [buf_face[2][0][2-focus[1]], buf_face[2][1][2-focus[1]], buf_face[2][2][2-focus[1]]];
            [face[1][0][2-focus[1]], face[1][1][2-focus[1]], face[1][2][2-focus[1]]] = [buf_face[0][0][2-focus[1]], buf_face[0][1][2-focus[1]], buf_face[0][2][2-focus[1]]];
            [face[5][2][focus[1]], face[5][1][focus[1]], face[5][0][focus[1]]] = [buf_face[1][0][2-focus[1]], buf_face[1][1][2-focus[1]], buf_face[1][2][2-focus[1]]];

            if(focus[1] == 2){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[3][i][j] = buf_face[3][j][2-i];
                    }
                }
            }
            if(focus[1] == 0){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[4][i][j] = buf_face[4][2-j][i];
                    }
                }
            }
        }else if(focus[0] == 3){
            [face[3][2][focus[1]], face[3][1][focus[1]], face[3][0][focus[1]]] = buf_face[1][focus[1]];
            face[1][focus[1]] = [buf_face[4][0][2-focus[1]], buf_face[4][1][2-focus[1]], buf_face[4][2][2-focus[1]]];
            [face[4][2][2-focus[1]], face[4][1][2-focus[1]], face[4][0][2-focus[1]]] = buf_face[2][2-focus[1]];
            face[2][2-focus[1]] = [buf_face[3][0][focus[1]], buf_face[3][1][focus[1]], buf_face[3][2][focus[1]]];

            if(focus[1] == 0){
                // rotate（時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[5][i][j] = buf_face[5][2-j][i];
                    }
                }
            }else if(focus[1] == 2){
                // rotate（反時計）
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[0][i][j] = buf_face[0][j][2-i];
                    }
                }
            }
        }else if(focus[0] == 4){
            [face[3][0][2-focus[1]], face[3][1][2-focus[1]], face[3][2][2-focus[1]]] = buf_face[2][focus[1]];
            face[1][2-focus[1]] = [buf_face[3][2][2-focus[1]], buf_face[3][1][2-focus[1]], buf_face[3][0][2-focus[1]]];
            [face[4][0][focus[1]], face[4][1][focus[1]], face[4][2][focus[1]]] = buf_face[1][2-focus[1]];
            face[2][focus[1]] = [buf_face[4][2][focus[1]], buf_face[4][1][focus[1]], buf_face[4][0][focus[1]]];

            if(focus[1] == 2){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[5][i][j] = buf_face[5][j][2-i];
                    }
                }
            }else if(focus[1] == 0){
                for(let i=0; i<=2; i++){
                    for(let j=0; j<=2; j++){
                        face[0][i][j] = buf_face[0][2-j][i];
                    }
                }
            }
        }
    }
}

function detect_fin(){
    let clear_num = 0;
    for(let i=0; i<=5; i++){
        if(face[i][0][0] == face[i][0][1] && face[i][0][0] == face[i][0][2] && face[i][0][0] == face[i][1][0] && face[i][0][0] == face[i][1][1] && face[i][0][0] == face[i][1][2] && face[i][0][0] == face[i][2][0] && face[i][0][0] == face[i][2][1] && face[i][0][0] == face[i][2][2]){
            clear_num++;
        }
    }
    // console.log(clear_num);
    if(clear_num == 6){
        ctx.fillStyle = 'white'
        ctx.fillRect(canvas.width/4, canvas.height*8/10+5, canvas.width/2, 50);
        ctx.strokeStyle = '#FF0000'
        ctx.lineWidth = 3;
        ctx.strokeRect(canvas.width/4, canvas.height*8/10+5, canvas.width/2, 50);

        ctx.font = "25px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("congratulations", canvas.width/2, canvas.height*9/10+5);
    }
}

function print_debug(){
    // count number of color attribute
    let grid_color_num = [0, 0, 0, 0, 0, 0];
    for(let i=0; i<=5; i++){
        for(let j=0; j<=2; j++){
            for(let k=0; k<=2; k++){
                if(face[i][j][k] == 1){
                    grid_color_num[0]++;
                }else if(face[i][j][k] == 2){
                    grid_color_num[1]++;
                }else if(face[i][j][k] == 3){
                    grid_color_num[2]++;
                }else if(face[i][j][k] == 4){
                    grid_color_num[3]++;
                }else if(face[i][j][k] == 5){
                    grid_color_num[4]++;
                }else if(face[i][j][k] == 6){
                    grid_color_num[5]++;
                }
            }
        }
    }
    // plot infomation
    ctx.fillStyle = 'white'
    ctx.fillRect(char_place_x-80, 2, 90, 125);
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.textAlign = "right";
    ctx.fillText("green : " + grid_color_num[0], char_place_x, 20);
    ctx.fillText("yellow : " + grid_color_num[1], char_place_x, 40);
    ctx.fillText("white : " + grid_color_num[2], char_place_x, 60);
    ctx.fillText("orange : " + grid_color_num[3], char_place_x, 80);
    ctx.fillText("red : " + grid_color_num[4], char_place_x, 100);
    ctx.fillText("blue : " + grid_color_num[5], char_place_x, 120);
}

//-----------------------------------
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_grid();
    if(flag_start_menu){
        if(frame_counter > 100 || frame_counter == 0){
            grid_color_random(1);
            frame_counter = 1;
        }else{
            grid_color_random(2);
        }
        start_select();
        frame_counter++;
        menu_counter++;
        requestAnimationFrame(draw);
        return;
    }
    draw_base_point();
    let face_buf = return_face(1);
    // console.log(face_buf);
    for(let i=0; i <= 5; i++){
        draw_cube(i);
    }
    draw_cursor();
    move_cursor();
    // select_target();
    start_shuffle();
    rotate();
    frame_counter++;

    detect_fin();
    if(debug_mode) print_debug();
    requestAnimationFrame(draw);
}
// setInterval(draw, 10);
draw();

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        right_pressed = true;
        if(flag_start_menu && menu_counter > 5){
            select_mode++;
            if(select_mode > 2) select_mode = 2;
            menu_counter = 0;
        }
    }else if(e.key == "Left" || e.key == "ArrowLeft") {
        left_pressed = true;
        if(flag_start_menu && menu_counter > 5){
            select_mode--;
            if(select_mode < 0) select_mode = 0;
            menu_counter = 0;
        }
    }else if(e.keyCode == 38){
        up_pressed = true;
    }else if(e.keyCode == 40){
        down_pressed = true;
    }else if(e.keyCode == 32){
        space_pressed = true;
        grid_focus = true;
        if(flag_start_menu) flag_start_menu = false;
    }else if(e.keyCode == 68){ //key : d
        if(debug_mode){
            debug_mode = false;
        }else{
            debug_mode = true;
        }
    }else if(e.keyCode == 13){ // key : enter
        if(flag_start_menu) flag_start_menu = false;
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
        grid_focus = false;
    }
}