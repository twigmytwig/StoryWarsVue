<template>
  <div class="relative ">
	<!-- Loading Screen -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div class="text-white text-2xl">{{message}}</div>
    </div>

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
		<canvas v-if="!gameStarted"
		ref="canvas"
		@mousedown="startDrawing"
		@mousemove="draw"
		@mouseup="stopDrawing"
		class="drawing-canvas "
		></canvas>
	</div>
	<!-- Start Game Button (Only visible to host) -->
    <button v-if="isHost && !gameStarted" @click="startGame" class="bg-green-500 text-white px-4 py-2 mt-4">
      Start Game
    </button>

	<!-- Tool menu to toggle between draw and erase -->
	<ToolMenu @toolChange="handleToolChange" class="absolute bottom-4 right-4" />
	<PenWidth @setPenWidthEmit="handlePenWidthChange" class="flex items-center justify-center place-items"/>
	<PlayerList :players="players" class="absolute top-12 left-5"/>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue';
import * as signalR from '@microsoft/signalr';
import PlayerList from './PlayerList.vue';
import ToolMenu from './DrawingModifiers/ToolMenu.vue';
import PenWidth from './DrawingModifiers/PenWidth.vue';

// Define props
const props = defineProps(['sessionId', 'displayName']);
const emit = defineEmits(['onSessionEnd'])
const players = ref([]); // Players array
const currentTool = ref('draw'); // Default tool is 'draw'
const currentPenWidth = ref(2);

// Reactive variables
const canvas = ref(null);
const context = ref(null);
const isDrawing = ref(false);
const lastX = ref(0);
const lastY = ref(0);
const isHost = ref(false); // This will determine if the current user is the host
const gameStarted = ref(false);
const loading = ref(true); // Loading state to show/hide loading screen
const message = ref("Connecting to game server...")

//----------------Setup SignalR connection
const connection = ref(null);
const setupSignalR = async () => {
  connection.value = new signalR.HubConnectionBuilder()
    .withUrl('https://storywarsapi-d0cqabd3h0cmfmf6.westus-01.azurewebsites.net/drawingHub')
	//.withUrl('https://localhost:7180/drawingHub')
    .build();

  connection.value.on('GameStarted', () => {
    gameStarted.value = true;
  });

  connection.value.on('ReceiveDrawingData', (drawingData) => {
    updateCanvasWithReceivedData(drawingData);
  });

  // Add player to the list when they join
  connection.value.on('PlayerJoined', (playerName) => {
    players.value.push(playerName);
  });

  // Remove player from the list when they leave
  connection.value.on('PlayerLeft', (playerName) => {
    alert(playerName + "playerLeft!")
    players.value = players.value.filter(p => p !== playerName);
  });

  connection.value.on('ReceiveAllPlayers', (playerName) => {
    players.value.push(playerName);
  });
  try {
    await connection.value.start();
    if (props.sessionId) {
		await connection.value.invoke('JoinSession', props.sessionId, localStorage.getItem('displayName'));
		const result = await connection.value.invoke('IsHost', props.sessionId);
		isHost.value = result;
		// Connection is successful, hide the loading screen
		loading.value = false;
    }
  } catch (error) {
    console.error('Error starting SignalR connection or joining session:', error);
	message.value = "An error occured when trying to connect. Please refresh the page and try again. If this issue persists then please... idk.. try to tell me if you know how to contact me."
  }
};
//--END SIGNAL R STUFFS


//------------------Drawing functions
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
    color: currentTool.value === 'erase' ? '#ffffff' : '#000000', //TODO: FIND A BETTER SOLUTION LMAO Eraser color is white
    lineWidth: currentTool.value === 'erase' ? 20 : 4
  };
  sendDrawingData(drawingData);

  context.value.beginPath();
  context.value.moveTo(lastX.value, lastY.value);
  context.value.lineTo(x, y);
  context.value.lineJoin = 'round';
  context.value.lineCap = 'round';
  context.value.strokeStyle = currentTool.value === 'erase' ? '#ffffff' : '#000000';
  context.value.lineWidth = currentPenWidth.value;
  context.value.stroke();
  context.value.closePath();

  lastX.value = x;
  lastY.value = y;
};

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

//Drawing updates specifically
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
//--END DRAWING FUNCTIONS



//-----------------tool.vue
const handleToolChange = (tool) => {
  currentTool.value = tool;
};
//--END TOOL.VUE



//----------PenWidth.vue
const handlePenWidthChange = (width) => {
	currentPenWidth.value = width;
}
//end PenWidth.vue


//Host starts the game 
const startGame = async () => {
  if (isHost.value) {
    try {
      await connection.value.invoke('StartGame', props.sessionId);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  }
};

//Handles users leaving game
async function leaveSession(){
  try{
    alert(props.displayName + '-' + props.sessionId)
    await connection.value.invoke('LeaveSession', props.sessionId, props.displayName);
    connection.value.stop();
    emit('onSessionEnd');
  } catch(error){
    //alert("There was an error when trying to leave the game!");
    console.log(error);
  }
  
}




// On component mount
onMounted(() => {
  if (canvas.value) {
    //canvas.value.width = 800;
    //canvas.value.height = 600;
	const canvasWidth = window.innerWidth * 0.8;
    const canvasHeight = window.innerHeight * 0.8;
    canvas.value.width = canvasWidth * 2; // Increase width for higher resolution
    canvas.value.height = canvasHeight * 2; // Increase height for higher resolution
    canvas.value.style.width = `${canvasWidth}px`; // Set display width
    canvas.value.style.height = `${canvasHeight}px`; // Set display height
    context.value = canvas.value.getContext('2d');
    context.value.scale(2, 2); // Scale context to match higher resolution
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
