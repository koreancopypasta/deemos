const getWS = path => (location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + location.hostname + (location.port ? ':'+location.port : '') + path;
const socket = new WebSocket(getWS("/"))
socket.onmessage = function(event){
    let obj = JSON.parse(event.data)
    switch(obj.type){
        case Socket
    }
}