import random
import matplotlib.pyplot as plt

class Graph:
    def __init__(self) -> None:
        self.G = {}
        self.nodes = 0
        self.edges = 0

    def get_neighbors(self, vertex):
        neighbors = self.G[vertex]
        return [i[0] for i in neighbors]
    
    def get_edges(self):
        edges = []
        for i in self.G.keys():
            for j in self.G[i]:
                edges.append((i, j[0]))
        return edges
    
    def max_degree(self,graph) -> int:
        max_degree = 0
        max_degree_node = None
        for i in graph.keys():
            if len(graph[i]) > max_degree:
                max_degree = len(graph[i])
                max_degree_node = i
        return max_degree_node


class Ant:
    def __init__(self, Q, alpha, beta, rho, graph, pheromones_matrix) -> None:
        self.Q = Q
        self.alpha = alpha
        self.beta = beta
        self.rho = rho
        self.unvisited = [] #refer as A
        self.partial_solutions = {}
        self.graph = graph
        self.pheromones_matrix = pheromones_matrix
        self.cmin = []
        self.dsat = []

    def update_cmin(self, vertex):
        for i in self.graph.get_neighbors(vertex):
            colours = []
            for j in self.graph.get_neighbors(i):
                if self.cmin[j-1] not in colours:
                    colours.append(self.cmin[j-1])
            colours = sorted(colours)
            for k in range(1,len(colours)+1):
                if k not in colours:
                    self.cmin[i-1] = k
                    break
                elif k == len(colours) and k in colours:
                    self.cmin[i-1] = len(colours)+1
                    break

    def update_dsat(self, vertex):
        for i in self.graph.get_neighbors(vertex):
            colours = []
            for j in self.graph.get_neighbors(i):
                if self.cmin[j-1] not in colours:
                    colours.append(self.cmin[j-1])
            self.dsat[i-1] = len(colours)

    def pick_pheromones(self, vertex):
        if len(self.partial_solutions[self.cmin[vertex-1]-1]) == 0:
            return 1
        arr = [self.pheromones_matrix[(i,vertex,)] for i in self.partial_solutions[self.cmin[vertex-1]-1]]
        return sum(arr)/len(arr)
    
    def next_vertex(self):
        probabilities = []
        for v in self.unvisited:
            probabilities.append(
                self.pick_pheromones(v) ** self.alpha * self.dsat[v-1] ** self.beta
            )
        total = sum(probabilities)
        if total == 0:
            return random.choice(self.unvisited)
        probabilities = [i / total for i in probabilities]
        return random.choices(self.unvisited, probabilities)[0]

    def construct_potential_solution(self):
        self.cmin = [1 for _ in range(self.graph.nodes)]
        self.dsat = [0 for _ in range(self.graph.nodes)]
        self.unvisited = list(self.graph.G.keys())
        self.partial_solutions = [set() for _ in range(self.graph.nodes)]
        current_vertex = self.graph.max_degree(self.graph.G)
        q = 1 #number of colours used
        self.partial_solutions[q-1].add(current_vertex)
        for i in range(2,self.graph.nodes+1):
            self.update_cmin(current_vertex)
            self.update_dsat(current_vertex)
            self.unvisited.remove(current_vertex)            
            current_vertex = self.next_vertex()
            color = self.cmin[current_vertex-1]
            self.partial_solutions[color-1].add(current_vertex)
            if color == q+1:
                q += 1
        return self.partial_solutions, max(self.cmin)
    
    def run(self):
        return self.construct_potential_solution()

class AntColony(Ant):
    def __init__(self, Q, alpha, beta, rho, no_of_ants, num_iterations) -> None:
        self.Q = Q
        self.alpha = alpha
        self.beta = beta
        self.rho = rho
        self.no_of_ants = no_of_ants
        self.best_solution = {}
        self.best_solution_score = float("inf")
        self.pheromones_matrix = {}
        self.num_iterations = num_iterations

    def initialize_pheromones_matrix(self):
        self.pheromones_matrix = {
            (i, j): 1 for i in self.graph.G.keys() for j in self.graph.G.keys()
        }
        for i in self.graph.G.keys():
            for j in self.graph.get_neighbors(i):
                self.pheromones_matrix[(i, j)] = 0

    def update_pheromones_matrix(self, deltaTau):
        for i in self.graph.G.keys():
            for j in self.graph.G.keys():
                if i not in self.graph.get_neighbors(j):
                    self.pheromones_matrix[(i, j)] = ((1-self.rho) * self.pheromones_matrix[(i, j)]) + deltaTau[(i, j)]

    def run(self):
        avg_fitness = []    
        best_fitness = []

        self.initialize_pheromones_matrix()
        for i in range(self.num_iterations):
            print(f"Iteration {i}")
            sum = 0
            deltaTau = {
            (i, j): 0 for i in self.graph.G.keys() for j in self.graph.G.keys()
            }
            for j in range(self.no_of_ants):
                print(f"Ant {j}")
                a = Ant(
                    self.Q,
                    self.alpha,
                    self.beta,
                    self.rho,
                    self.graph,
                    self.pheromones_matrix,
                )
                current_solution, current_solution_score = a.run()

                if current_solution_score < self.best_solution_score:
                    self.best_solution = current_solution
                    self.best_solution_score = current_solution_score

                for i in self.graph.G.keys():
                    for j in self.graph.G.keys():
                        if i not in self.graph.get_neighbors(j):
                            if a.cmin[i-1] != a.cmin[j-1]:
                                deltaTau[(i, j)] += self.Q / current_solution_score
                
                sum += current_solution_score
            self.update_pheromones_matrix(deltaTau)
            best_fitness.append(self.best_solution_score)
            avg_fitness.append(round((sum / self.no_of_ants),2))
            print(avg_fitness, best_fitness)
        print(f"Pheromones matrix: {self.pheromones_matrix}")
        x_axis = [i for i in range(self.num_iterations)]
        plt.figure()
        plt.plot(x_axis, avg_fitness, label="Average fitness so far")
        plt.plot(x_axis, best_fitness, label="Best fitness so far")
        plt.xlabel('Number of iterations')
        plt.ylabel('Fitness')
        plt.title("Fitness over time")
        plt.legend()
        plt.show()
        return self.final_solution, self.final_solution_score