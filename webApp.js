var peer = new Peer();
let joinBtn, aiBtn, createBtn;
var turn = null; // 0 this player, 1 remote
var player_icon = 'o';
var conn;
var board_array = ['-', '-', '-', '-', '-', '-', '-', '-', '-']

window.onload = () => {
    joinBtn = document.getElementById('joinButton')
    aiBtn = document.getElementById('aiButton') 
    createBtn = document.getElementById('createButton') 
}

function emit(type, data){
    if(conn.open){
        conn.send({
            type: type,
            data: data
        })
    }
}

function move(x){
    if(conn != null && turn == 0 && board_array[x] == '-'){
        turn = 1
        setState(x, player_icon)
        emit('board', {
            block : x,
            state : player_icon
        })
    }
        
}

function setState(block, state){
    board_array[block] = state
    let image = document.getElementById(block)
    let imgPath;
    switch(state){
        case '-': imgPath = 'images/empty_block.png'; break;
        case 'x': imgPath = 'images/x_block.png'; break;
        case 'o': imgPath = 'images/o_block.png'; break;
        default:  imgPath = 'images/empty_block.png';
    }
    image.src = imgPath;
}

function aiMatch(){
    conn.send('hello Kenobi')
}

function joinRoom(ip = null){
    if(ip == null)
        ip = prompt('Type in IP and port')
    conn = peer.connect(ip)

    conn.on('open', () => {

        joinBtn.disabled = true
        aiBtn.disabled = true
        createBtn.disabled = true
        player_icon = 'x'
        turn = 0

        conn.on('data', (data) => {
            console.log('Received', data);
            switch(data.type){
                case 'board': {
                    console.log(`Boarding: ${data.data}`)
                    setState(data.data.block, data.data.state)
                    turn = 0
                }
            }
        });
      
        // Send messages
        console.log('conn established')
        conn.send('Hello!');
      });
    conn.on('error', (e) =>{console.log(e)})
    conn.on('disconnected', (e) =>{console.log(e)})
    conn.on('close', (e) => {console.log(`conn closed: ${e}`)})
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
            console.log('Received', data);
            switch(data.type){
                case 'board': {
                    console.log(`Boarding: ${data.data}`)
                    setState(data.data.block, data.data.state)
                    turn = 0
                }
            }
          });
        conn.on('error', (e) =>{console.log(e)})
        conn.on('disconnected', (e) =>{console.log(e)})
        conn.on('close', (e) => {console.log(`conn closed: ${e}`)})

        conn.on('open', () =>{
            conn.send('Connection established')
            createBtn.disabled = true
            turn = 1;
        })
        
     });
}

function makeRandomCode() {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';
    for ( var i = 0; i < 4; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

//Delujoča igra proti računalniku (10 točk)
//Implementirana možnost ustvarjanja nove igre, implementirana možnost pridruževanja k igri in delujoča igra preko omrežja