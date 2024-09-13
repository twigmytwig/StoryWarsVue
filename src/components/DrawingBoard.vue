<template>
  <div class="relative">
    <!-- Display invite code at the top -->
    <div v-if="props.sessionId" class="absolute top-4 left-4 bg-gray-700 text-white p-2 rounded">
      Invite Code: {{ props.sessionId }}
    </div>
    
    <!-- Canvas for drawing -->
    <canvas
      ref="canvas"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      class="w-full h-full"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import * as signalR from '@microsoft/signalr';

// Define props
const props = defineProps(['sessionId']);

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
    .build();

  connection.value.on('ReceiveDrawingData', (drawingData) => {
    updateCanvasWithReceivedData(drawingData);
  });

  try {
    await connection.value.start();
    alert(props.sessionId)
    if (props.sessionId) {
      await connection.value.invoke('JoinSession', props.sessionId);
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
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
    context.value = canvas.value.getContext('2d');
  }
  setupSignalR();
});
</script>

<style scoped>
/* Add additional styles if needed */
canvas {
  border: 1px solid #ccc;
  display: block;
}
</style>
