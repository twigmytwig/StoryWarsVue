<template>
  <div>
    <canvas ref="canvas" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing"></canvas>
  </div>
</template>

<script>
/*import * as signalR from "@microsoft/signalr";

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
      //.withUrl("https://storywarsapi-d0cqabd3h0cmfmf6.westus-01.azurewebsites.net/drawingHub")  // Your .NET API SignalR hub URL
      .withUrl("https://localhost:7180/drawingHub")  // Your .NET API SignalR hub URL
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
      const rect = this.$refs.canvas.getBoundingClientRect();
      this.isDrawing = true;
      this.lastX = event.clientX - rect.left;
      this.lastY = event.clientY - rect.top;
    },
    draw(event) {
      if (!this.isDrawing) return;

      const rect = this.$refs.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.context.beginPath();
      this.context.moveTo(this.lastX, this.lastY);
      this.context.lineTo(x, y);
      this.context.strokeStyle = "#000000";  // Color of the stroke
      this.context.lineWidth = 2;            // Thickness of the stroke
      this.context.stroke();
      this.context.closePath();

      this.lastX = x;
      this.lastY = y;

      const drawingData = {
        x: x,
        y: y,
        lastX: this.lastX,
        lastY: this.lastY,
        color: "#000000",  // Color of the drawing stroke
        lineWidth: 2       // Line width
      };
      this.sendDrawingData(drawingData);
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
};*/

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
      const rect = this.$refs.canvas.getBoundingClientRect();
      this.isDrawing = true;
      this.lastX = event.clientX - rect.left;
      this.lastY = event.clientY - rect.top;
    },
    draw(event) {
      if (!this.isDrawing) return;

      const rect = this.$refs.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Send drawing data to the SignalR hub
      const drawingData = {
        x: x,
        y: y,
        lastX: this.lastX,
        lastY: this.lastY,
        color: "#000000",
        lineWidth: 2
      };
      this.sendDrawingData(drawingData);

      // Draw on canvas
      this.context.beginPath();
      this.context.moveTo(this.lastX, this.lastY);
      this.context.lineTo(x, y);
      this.context.strokeStyle = "#000000";
      this.context.lineWidth = 2;
      this.context.stroke();
      this.context.closePath();

      // Update last positions
      this.lastX = x;
      this.lastY = y;
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

