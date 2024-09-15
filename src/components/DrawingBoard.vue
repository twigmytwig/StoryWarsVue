<template>
  <div class="relative ">
    <!-- Display invite code at the top -->
    <div v-if="props.sessionId" class="absolute top-2 left-4 bg-gray-700 text-white p-2 rounded">
      Invite Code: {{ props.sessionId }}

    </div>
    <button
      @click="leaveSession"
      class="absolute top-2 right-4 bg-red-500 text-white p-2 rounded"
    >
      Leave Game
    </button>
    <br/>
    <!-- Canvas for drawing -->
     <div class="flex flex-col items-center justify-center">
        <canvas
        ref="canvas"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        class="drawing-canvas "
      ></canvas>
     </div>
    <div>
      <PlayerList :players="players" class="absolute top-12 left-5"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue';
import * as signalR from '@microsoft/signalr';
import PlayerList from './PlayerList.vue';

// Define props
const props = defineProps(['sessionId']);
const emit = defineEmits(['onSessionEnd'])
const players = ref([]); // Players array
// Reactive variables
const canvas = ref(null);
const context = ref(null);
const isDrawing = ref(false);
const lastX = ref(0);
const lastY = ref(0);

// Setup SignalR connection
const connection = ref(null);
const setupSignalR = async () => {
  connection.value = new signalR.HubConnectionBuilder()
    .withUrl('https://storywarsapi-d0cqabd3h0cmfmf6.westus-01.azurewebsites.net/drawingHub')
	//.withUrl('https://localhost:7180/drawingHub')
    .build();

  connection.value.on('ReceiveDrawingData', (drawingData) => {
    updateCanvasWithReceivedData(drawingData);
  });

  // Add player to the list when they join
  connection.value.on('PlayerJoined', (playerName) => {
    players.value.push(playerName);
  });

  // Remove player from the list when they leave
  connection.value.on('PlayerLeft', (playerName) => {
    players.value = players.value.filter(p => p !== playerName);
  });

  connection.value.on('ReceiveAllPlayers', (playerName) => {
	players.value.push(playerName.value);
  });
  try {
    await connection.value.start();
    if (props.sessionId) {
      await connection.value.invoke('JoinSession', props.sessionId, localStorage.getItem('displayName'));
    }
  } catch (error) {
    console.error('Error starting SignalR connection or joining session:', error);
  }
};

const updateCanvasWithReceivedData = (drawingData) => {
  if (context.value) {
    context.value.beginPath();
    context.value.moveTo(drawingData.lastX, drawingData.lastY);
    context.value.lineTo(drawingData.x, drawingData.y);
    context.value.strokeStyle = drawingData.color;
    context.value.lineWidth = drawingData.lineWidth;
    context.value.stroke();
    context.value.closePath();
  }
};

// Drawing functions
const startDrawing = (event) => {
  const rect = canvas.value.getBoundingClientRect();
  isDrawing.value = true;
  lastX.value = event.clientX - rect.left;
  lastY.value = event.clientY - rect.top;
};

const draw = (event) => {
  if (!isDrawing.value || !context.value) return;

  const rect = canvas.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const drawingData = {
    x,
    y,
    lastX: lastX.value,
    lastY: lastY.value,
    color: '#000000',
    lineWidth: 2
  };
  sendDrawingData(drawingData);

  context.value.beginPath();
  context.value.moveTo(lastX.value, lastY.value);
  context.value.lineTo(x, y);
  context.value.strokeStyle = '#000000';
  context.value.lineWidth = 2;
  context.value.stroke();
  context.value.closePath();

  lastX.value = x;
  lastY.value = y;
};

async function leaveSession(){
  try{
    await connection.value.invoke('LeaveSession', props.sessionId);
    connection.value.stop();
    emit('onSessionEnd');
  } catch(error){
    //alert("There was an error when trying to leave the game!");
    console.log(error);
  }
  
}

const stopDrawing = () => {
  isDrawing.value = false;
};

const sendDrawingData = async (drawingData) => {
  try {
    await connection.value.invoke('SendDrawingData', props.sessionId,drawingData);
  } catch (error) {
    console.error('Error sending drawing data:', error);
  }
};

// On component mount
onMounted(() => {
  if (canvas.value) {
    canvas.value.width = 800;
    canvas.value.height = 600;
    context.value = canvas.value.getContext('2d');
  }
  setupSignalR();
});

onBeforeUnmount(() => {
  leaveSession();
});
</script>

<style scoped>
/* Add additional styles if needed */
.drawing-canvas {
  border: 2px solid #ccc;
  display: block;
  background-color: white;
}
</style>
