/*** Represents a bunny with genetic traits.
 */
class Bunny {
    constructor(genotype) {
      this.genotype = genotype;
    }
  
    /**
     * Determines if the bunny is homozygous recessive (pp).
     */
    isHomozygousRecessive() {
      return this.genotype === "pp";
    }
  
    /**
     * Determines if the bunny is homozygous dominant (PP).
     */
    isHomozygousDominant() {
      return this.genotype === "PP";
    }
  }
  
  /**
   * Manages a generation of bunnies.
   */
  class Generation {
    constructor(bunnies) {
      this.bunnies = bunnies;
    }
  
    /**
     * Mates the bunnies in the generation and returns the next generation.
     */
    mate(deathRate) {
      let newBunnies = [];
      for (let i = 0; i < this.bunnies.length; i += 2) {
        if (i + 1 < this.bunnies.length) {
          let offspringGenotype = this.generateOffspringGenotype(this.bunnies[i], this.bunnies[i + 1]);
          newBunnies.push(new Bunny(offspringGenotype));
        }
      }
      // Apply death rate to hairless bunnies
      newBunnies = newBunnies.filter(bunny => !bunny.isHomozygousRecessive() || Math.random() > deathRate);
      return new Generation(newBunnies);
    }
  
    generateOffspringGenotype(parent1, parent2) {
      const parent1Gene = parent1.genotype[Math.floor(Math.random() * 2)];
      const parent2Gene = parent2.genotype[Math.floor(Math.random() * 2)];
      return parent1Gene + parent2Gene;
    }
  }
  
  // Function to update bunny counts display
  function updateBunnyCounts() {
    const hairedCount = generations[currentGenerationIndex].bunnies.filter(bunny => bunny.isHomozygousDominant()).length;
    const hairMixedCount = generations[currentGenerationIndex].bunnies.filter(bunny => !bunny.isHomozygousRecessive() && !bunny.isHomozygousDominant()).length;
    const hairlessCount = generations[currentGenerationIndex].bunnies.filter(bunny => bunny.isHomozygousRecessive()).length;
    const bunnyCounts = document.getElementById('bunnyCounts');
    bunnyCounts.innerHTML = `Haired: ${hairedCount}, Hair Mixed: ${hairMixedCount}, Hairless: ${hairlessCount}`;
  }
  
  // Function to update generation graph
  function updateGenerationGraph() {
    const labels = generations.map((_, index) => `Generation ${index + 1}`);
    const datasets = [{
      label: 'Haired',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      data: generations.map(gen => gen.bunnies.filter(bunny => bunny.isHomozygousDominant()).length)
    }, {
      label: 'Hair Mixed',
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1,
      data: generations.map(gen => gen.bunnies.filter(bunny => !bunny.isHomozygousRecessive() && !bunny.isHomozygousDominant()).length)
    }, {
      label: 'Hairless',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      data: generations.map(gen => gen.bunnies.filter(bunny => bunny.isHomozygousRecessive()).length)
    }];
    
    const ctx = document.getElementById('generationGraph').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  // JavaScript code from the previous version remains the same
  
  let currentGenerationIndex = 0;
  let generations = [];
  
  function startSimulation() {
    const initialCount = document.getElementById('initialCount').value;
    const numGenerations = document.getElementById('numGenerations').value;
    const deathRate = document.getElementById('deathRate').value / 100;
    const simulationArea = document.getElementById('simulationArea');
    simulationArea.innerHTML = '';
    generations = [];
    let bunnies = [];
    const thirdInitialCount = Math.floor(initialCount / 3);
    for (let i = 0; i < thirdInitialCount; i++) {
      bunnies.push(new Bunny("PP"));
    }
    for (let i = 0; i < thirdInitialCount; i++) {
      bunnies.push(new Bunny("Pp"));
    }
    for (let i = 0; i < thirdInitialCount; i++) {
      bunnies.push(new Bunny("pp"));
    }
    let currentGeneration = new Generation(bunnies);
    generations.push(currentGeneration);
    displayGeneration(currentGeneration.bunnies, 'Initial generation');
    for (let gen = 1; gen < numGenerations; gen++) {
      currentGeneration = currentGeneration.mate(deathRate);
      generations.push(currentGeneration);
    }
    document.getElementById('nextButton').onclick = () => {
      currentGenerationIndex++;
      if (currentGenerationIndex >= generations.length) {
        currentGenerationIndex = generations.length - 1;
        document.getElementById('nextButton').disabled = true;
      }
      document.getElementById('backButton').disabled = false;
      displayGeneration(generations[currentGenerationIndex].bunnies, `Generation ${currentGenerationIndex + 1}`);
      updateBunnyCounts();
      updateGenerationGraph();
    };
    document.getElementById('backButton').onclick = () => {
      currentGenerationIndex--;
      if (currentGenerationIndex <= 0) {
        currentGenerationIndex = 0;
        document.getElementById('backButton').disabled = true;
      }
      document.getElementById('nextButton').disabled = false;
      displayGeneration(generations[currentGenerationIndex].bunnies, `Generation ${currentGenerationIndex + 1}`);
      updateBunnyCounts();
      updateGenerationGraph();
    };
    document.getElementById('nextButton').disabled = false;
  }
  
  function displayGeneration(bunnies, title) {
    simulationArea.innerHTML = ''; // Clear previous generation
    bunnies.forEach(bunny => {
      const bunnyImg = document.createElement('div');
      bunnyImg.className = 'bunny ' + (bunny.isHomozygousRecessive() ? 'hairless' : (bunny.isHomozygousDominant() ? 'haired' : 'hairmixed'));
      bunnyImg.style.left = `${Math.random() * (simulationArea.clientWidth - 50)}px`;
      bunnyImg.style.top = `${Math.random() * (simulationArea.clientHeight - 50)}px`;
      simulationArea.appendChild(bunnyImg);
    });
  }
  