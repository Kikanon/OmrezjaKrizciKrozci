var peer = new Peer();
let joinBtn, aiBtn, createBtn, alertText;
var turn = null; // 0 this player, 1 remote
var player_icon = 'o';
var conn;
var board_array = ['-', '-', '-', '-', '-', '-', '-', '-', '-']
 let aiMode = false; 

window.onload = () => {
    joinBtn = document.getElementById('joinButton')
    aiBtn = document.getElementById('aiButton') 
    createBtn = document.getElementById('createButton') 
    alertText = document.getElementById('alert')
}

function emit(type, data){
    if(conn.open){
        conn.send({
            type: type,
            data: data
        })
    }
}

function checkBoard(){
    let win = 0
    if(board_array[0] == board_array[3] && board_array[3] == board_array[6] && board_array[6] != '-')win = 1
    else if(board_array[1] == board_array[4] && board_array[4] == board_array[7] && board_array[7] != '-')win = 2
    else if(board_array[2] == board_array[5] && board_array[5] == board_array[8] && board_array[8] != '-')win = 3

    else if(board_array[0] == board_array[1] && board_array[1] == board_array[2] && board_array[2] != '-')win = 4
    else if(board_array[3] == board_array[4] && board_array[4] == board_array[5] && board_array[5] != '-')win = 5
    else if(board_array[6] == board_array[7] && board_array[7] == board_array[8] && board_array[8] != '-')win = 6

    else if(board_array[0] == board_array[4] && board_array[4] == board_array[8] && board_array[8] != '-')win = 7
    else if(board_array[2] == board_array[4] && board_array[4] == board_array[6] && board_array[6] != '-')win = 8

    if(win != 0){
        let winner = '-'
        console.log(`Win case ${win}`)
        switch(win){
            case 1: winner = board_array[0]; break;
            case 2: winner = board_array[1]; break;
            case 3: winner = board_array[2]; break;

            case 4: winner = board_array[0]; break;
            case 5: winner = board_array[3]; break;
            case 6: winner = board_array[6]; break;

            case 7: winner = board_array[0]; break;
            case 8: winner = board_array[2]; break;
            default: return;
        }
        turn = 1
        if(winner == player_icon){
            alertText.hidden = false
            alertText.innerHTML = "Bravo Bobi"
        }
        else{
            alertText.hidden = false
            alertText.innerHTML = "Se vidimo v Mekicu"
        }
        return;
    }

    for(x of board_array){
        if(x=='-')return;
    }

    alertText.hidden = false
    alertText.innerHTML = "Ocitno noben ne zna zmagat"
}

function move(x){
    if( (conn != null || aiMode) && turn == 0 && board_array[x] == '-'){
        setState(x, player_icon)

        if(aiMode){
            if(alertText.hidden){ // ce se ni konec
               while(!setState(Math.floor(Math.random() * 9), player_icon=='x'?'o':'x')){}
            }
        }else{
            turn = 1
            emit('board', {
                block : x,
                state : player_icon
            })
        }
        
        return true;
    }
    else return false;
}

function setState(block, state){
    if(board_array[block]!='-')return false;
    board_array[block] = state
    checkBoard()
    let image = document.getElementById(block)
    let imgPath;
    switch(state){
        case '-': imgPath = 'images/empty_block.png'; break;
        case 'x': imgPath = 'images/x_block.png'; break;
        case 'o': imgPath = 'images/o_block.png'; break;
        default:  imgPath = 'images/empty_block.png';
    }
    image.src = imgPath;
    return true;
}

function aiMatch(){
    joinBtn.disabled = true
    aiBtn.disabled = true
    createBtn.disabled = true

    aiMode = true;

    let x = Math.floor(Math.random() * 9)
    setState(x, player_icon=='x'?'o':'x')
    turn = 0
}

function joinRoom(ip = null){
    if(ip == null)
        ip = prompt('Type in ID of room')
    conn = peer.connect(ip)

    conn.on('open', () => {

        joinBtn.disabled = true
        aiBtn.disabled = true
        createBtn.disabled = true
        player_icon = 'x'
        turn = 0

        conn.on('data', (data) => {
            try{
            console.log('Received', data);
            switch(data.type){
                case 'board': {
                    console.log(`Boarding: ${data.data}`)
                    setState(data.data.block, data.data.state)
                    turn = 0
                }
            }
        }catch(e){
            console.log(e)
        }
        });
      
        // Send messages
        console.log('conn established')
        conn.send('Hello!');
      });
    conn.on('error', (e) =>{console.log(e)})
    conn.on('close', (e) => {
        console.log(`conn closed: ${e}`)
        onDC()
    })
}

function createRoom(){
    joinBtn.disabled = true
    aiBtn.disabled = true
    peer = new Peer(makeRandomCode())
    peerID = peer.id
    alert(`Your room id is : ${peerID}`)

    peer.on('connection', (c) => {
        conn = c
        console.log('Player connecting...')
        
        conn.on('data', (data) => {
            try{
            console.log('Received', data);
            switch(data.type){
                case 'board': {
                    console.log(`Boarding: ${data.data}`)
                    setState(data.data.block, data.data.state)
                    turn = 0
                }
            }
        }catch(e){
            console.log(e)
        }
          });
        conn.on('error', (e) =>{console.log(e)})
        conn.on('close', (e) => {
            console.log(`conn closed: ${e}`)
            onDC()
        })

        conn.on('open', () =>{
            conn.send('Connection established')
            createBtn.disabled = true
            turn = 1;
        })
        
     });
}

function onDC(){
    alertText.hidden = false
    alertText.innerHTML = "Povezava z drugim igralcem je bila prekinjena..."
}

function makeRandomCode() {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';
    for ( var i = 0; i < 4; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}