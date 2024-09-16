<template>
    <div class="flex space-x-4">
      <button
        :class="{'bg-gray-300': currentWidth === 2, '': currentWidth !== 2}"
        @click="setPenWidth(2)"
        class="p-2 rounded"
      >
        Littlest Pen
      </button>
      <button
        :class="{'bg-gray-300': currentWidth === 8, '': currentWidth !== 8}"
        @click="setPenWidth(8)"
        class="p-2 rounded bg-black-600"
      >
        Littler Pen
      </button>
      <button
        :class="{'bg-gray-300': currentWidth === 16, '': currentWidth !== 16}"
        @click="setPenWidth(16)"
        class="p-2 rounded bg-black-600"
      >
        Little Pen
      </button>
      <button
        :class="{'bg-gray-300': currentWidth === 32, '': currentWidth !== 32}"
        @click="setPenWidth(32)"
        class="p-2 rounded bg-black-600"
      >
        Big Pen
      </button>
      <button
        :class="{'bg-gray-300': currentWidth === 64, '': currentWidth !== 64}"
        @click="setPenWidth(64)"
        class="p-2 rounded bg-black-600"
      >
        Biggest Pen
      </button>
    </div>
</template>
<script setup>
 import { ref, defineEmits } from 'vue';
  
  const emit = defineEmits(['setPenWidthEmit']);
  
  const currentWidth = ref(2); // Default tool is 'draw'
  const setPenWidth = (width) => {
    currentWidth.value = width;
    emit('setPenWidthEmit', width); // Emit the selected tool to parent
  };
</script>