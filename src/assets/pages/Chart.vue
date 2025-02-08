<template>
  <div class="chart-container">
    <canvas ref="chart"></canvas>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, LineController, Filler } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, LineController, Filler);

  const chart = ref(null);

  const createNeonGradient = (ctx, color1, color2) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  };
  const monthlyActivity = ref({})

  const getGitHubEvents = async () => {
      const username = 'ravry';
      const url = `https://api.github.com/users/${username}/events/public`;

      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const events = await response.json();
          groupEventsByMonth(events)
      } catch (error) {
          console.error('Error fetching repositories:', error);
      }
  };

  const groupEventsByMonth = (events) => {
    const activityCount = {}

    events.forEach((event) => {
      const eventDate = new Date(event.created_at)
      const yearMonth = eventDate.toISOString().slice(0, 7)  // Format: "YYYY-MM"
      
      if (!activityCount[yearMonth]) {
        activityCount[yearMonth] = 0
      }

      activityCount[yearMonth]++
    })

    // Return an array of activity counts, ordered by month (keys)
    monthlyActivity.value = Object.keys(activityCount)
      .sort() // Sort by the month (ascending order)
      .map(month => activityCount[month]) // Return only the counts in an array
  }



  onMounted(async () => {
    await getGitHubEvents();

    if (!chart.value) return;
    const ctx = chart.value.getContext('2d');

    const chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
      {
        label: 'Dataset 1',
        borderColor: 'rgba(217, 177, 255, 1.0)',
        backgroundColor: createNeonGradient(ctx, 'rgba(184, 116, 248, 0.7)', 'rgba(184, 116, 248, 0)'),
        data: monthlyActivity.value,
        fill: true,
        tension: 0.4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,  // Hide the legend to not show the labels
        labels: {
          color: 'rgba(160, 160, 160, 1)',
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(160, 160, 160, 1)',
        },
        border: {
          color: 'rgba(160, 160, 160, 1)', // Set the border color of the x-axis
          width: 1, // You can adjust the border width as needed
        },
      },
      y: {
        grid: {
          color: 'rgba(160, 160, 160, 1)',
        },
        ticks: {
          color: 'rgba(160, 160, 160, 1)',
          stepSize: 10,
        },
        border: {
          color: 'rgba(160, 160, 160, 1)', // Set the border color of the y-axis
          width: 1, // You can adjust the border width as needed
        },
      },
    }
  };

  new ChartJS(ctx, {
    type: 'line',
    data: chartData,
    options: chartOptions,
  });
});
</script>
  
<style scoped>
    .chart-container {
      height: 200px;
      margin: 20px 20px 0px 20px;
      padding: 15px;
      border-radius: 12px;
      box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
    }
</style>