# Computational Intelligence - Homework 2

## Ant Colony Optimization - Graph Coloring
The following paper, "Ants can colour graphs" by authors D Costa and A Hertz was used as reference. The below pseudocode was used to make the ant colony. Initially the pheromones matrix was created which had value 0 if there was a edge between two nodes otherwise 0. Then for each iteration, each ant will construct or colourize the graph using strategy discussed later. The best solution found so far is updated here. Now the Delta M is calculated such that if two nodes which are not adjacent and have same colour then they will have 1/q score. Q here represents the number of colours used to colour the whole graph. After each iteration, evaporation is applied on pheromone matrix and the cumulative Delta M is added to it.
This strategy is known as DSATUR and is applied to colour each graph. Cmin is the minimum colour which can be used to colour the vertex while dsat represents the number of unique colours used to colour neighbours of the vertex. A here is the set containing all nodes which have not been colourized yet. We start with the node which has the highest degree. The partial solutions represents set which have been assigned the same colour. When the starting index have been assigned a colour then a for loop is run to find the next vertex and colour it. In each iteration based on vertex selected dsat and cmin array are updated. The probabilities are assigned to all potential candidates which can be selected as next vertex to be coloured. Here pheromones are extracted if the current vertex and the next vertex are assigned same colour. Following method is used to extract pheromone value.

## Particle Systems

Different sorts of modes/animations have been created in this project using particle systems, random logic and real life examples like party poppers, emitters, circular and random movements

### Paramters:

- Particle Count: 100 to 10000
- Particle Size: 2 to 15
- Particle Speed: 0.1 to 1
- Particle Lifespan: 10 to 100

### Tech Stack:

- Frontend: HTML (structuring)
- Rendering: ThreeJS (WebGL framework)
- Algorithm & Logic: JavaScript & DOM

Note:

- Particle lifespan, speed & size parameters are still random => Math.random() \* user_selected_value
  ​

## Description

- Question 1:
  - GraphColoringACO.py
  - graph_coloring.py
- Question 2:
  - index.html (contains structure of render)
  - particles.js (contains particles systems, rendering and logic(DOM) schemes)

## Authors

- Ali Asghar Kerai
- Muhammad Jazzel Mehmood
