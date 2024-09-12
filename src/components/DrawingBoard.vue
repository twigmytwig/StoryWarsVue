<template>
  <div>
    <canvas ref="canvas" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing"></canvas>
  </div>
</template>

<script>
import * as signalR from "@microsoft/signalr";

export default {
  data() {
    return {
      connection: null,  // SignalR connection object
      isDrawing: false,  // Flag for drawing state
      context: null,     // Canvas context object
      lastX: 0,          // Last X position for drawing
      lastY: 0,          // Last Y position for drawing
    };
  },
  async mounted() {
    const canvas = this.$refs.canvas;
    canvas.width = window.innerWidth;    // Set canvas width
    canvas.height = window.innerHeight;  // Set canvas height
    this.context = canvas.getContext('2d');
    
    // Step 1: Set up SignalR connection with your .NET Web API
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://storywarsapi-d0cqabd3h0cmfmf6.westus-01.azurewebsites.net/drawingHub")  // Your .NET API SignalR hub URL
      .build();

    // Listen for drawing data from the server
    this.connection.on("ReceiveDrawingData", (drawingData) => {
      this.updateCanvasWithReceivedData(drawingData);
    });

    // Start the SignalR connection
    await this.connection.start();
  },
  methods: {
    startDrawing(event) {
      this.isDrawing = true;
      // Set the starting point for the drawing
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    },
    draw(event) {
      if (!this.isDrawing) return;  // If not drawing, do nothing

      // Send drawing data to the SignalR hub first
      const drawingData = {
        x: event.clientX,
        y: event.clientY,
        lastX: this.lastX,  // Send previous position, before updating
        lastY: this.lastY,
        color: "#000000",  // Color of the drawing stroke
        lineWidth: 2       // Line width
      };
      this.sendDrawingData(drawingData);

      // Draw on canvas
      this.context.beginPath();
      this.context.moveTo(this.lastX, this.lastY);
      this.context.lineTo(event.clientX, event.clientY);
      this.context.strokeStyle = "#000000";  // Color of the stroke
      this.context.lineWidth = 2;            // Thickness of the stroke
      this.context.stroke();
      this.context.closePath();

      // Update last positions
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    },
    stopDrawing() {
      this.isDrawing = false;
    },
    async sendDrawingData(drawingData) {
      // Use SignalR to send the drawing data directly to the hub
      try {
        await this.connection.invoke("SendDrawingData", drawingData);
      } catch (error) {
        console.error("Error sending drawing data:", error);
      }
    },
    updateCanvasWithReceivedData(drawingData) {
      // Draw on canvas based on received data from other users
      this.context.beginPath();
      this.context.moveTo(drawingData.lastX, drawingData.lastY);
      this.context.lineTo(drawingData.x, drawingData.y);
      this.context.strokeStyle = drawingData.color;   // Use received color
      this.context.lineWidth = drawingData.lineWidth; // Use received line width
      this.context.stroke();
      this.context.closePath();
    },
  },
};
</script>

<style scoped>
canvas {
  border: 1px solid black;
  width: 100vw;
  height: 100vh;
}
</style>
