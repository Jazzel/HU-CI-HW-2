import random


class Graph:

    def __init__(self) -> None:
        self.G = {}
        self.nodes = 0
        self.edges = 0

    def get_neighbors(self, vertex):
        neighbors = self.G[vertex]
        return [i[0] for i in neighbors]

    # def get_adjacency_matrix(self):
    #     adjacency_matrix = [[0 for i in range(self.nodes)] for j in range(self.nodes)]
    #     for i in range(1, self.nodes + 1):
    #         for j in self.get_neighbors(i):
    #             adjacency_matrix[i - 1][j - 1] = 1
    #     return adjacency_matrix


class Ant:
    def __init__(self, Q, alpha, beta, rho, graph, pheromones_matrix) -> None:
        self.Q = Q
        self.alpha = alpha
        self.beta = beta
        self.rho = rho
        self.visited = []
        self.unvisited = []
        self.colours = []
        self.assigned_colours = {}
        self.graph = graph
        self.pheromones_matrix = pheromones_matrix

    def initial_colouring(self):
        self.colours = [i for i in range(1, self.graph.nodes + 1)]
        for i in range(1, self.graph.nodes + 1):
            self.assigned_colours[i] = random.choice(self.colours)
            self.unvisited.append(i)

    def improve_colouring(self, vertex):
        neighbours = self.graph.get_neighbors(vertex)
        tabu = []
        for neighbour in neighbours:
            tabu.append(self.assigned_colours[neighbour])
        for colour in self.colours:
            if colour not in tabu:
                self.assigned_colours[vertex] = colour
                self.visited.append(vertex)
                self.unvisited.remove(vertex)
                break

    def update_pheromones_matrix(self):
        for i in self.graph.G.keys():
            for j in self.graph.G.keys():
                self.pheromones_matrix[(i, j)] *= 1 - self.rho
                if i != j:
                    self.pheromones_matrix[(i, j)] += self.Q / len(
                        set(self.assigned_colours.values())
                    )

    def heuristic_value(self, vertex) -> int:
        dsat = []
        for i in self.graph.get_neighbors(vertex):
            if self.assigned_colours[i] not in dsat:
                dsat.append(self.assigned_colours[i])
        return len(dsat)

    def candidate_solution(self, current_position) -> int:
        if len(self.unvisited) == 0:
            return None
        if len(self.unvisited) == 1:
            return self.unvisited[0]
        candidates = []
        probability_vector = []
        # print(self.unvisited, len(self.unvisited))
        for vertex in self.unvisited:
            candidates.append(vertex)
            # print(self.pheromones_matrix[(current_position, vertex)], self.alpha
            #     , self.heuristic_value(vertex) ** self.beta)
            probability_vector.append(
                self.pheromones_matrix[(current_position, vertex)] ** self.alpha
                * self.heuristic_value(vertex) ** self.beta
            )
        total = sum(probability_vector)
        if total == 0:
            return random.choice(candidates)
        # print(len(candidates), len(probability_vector))
        # print(probability_vector)
        for index, element in enumerate(probability_vector):
            if total != 0:
                probability_vector[index] = element / total

        return random.choices(candidates, probability_vector)[0]

    def run(self):
        self.initial_colouring()
        current_position = random.choice(self.unvisited)
        while len(self.unvisited) > 0:
            next_position = self.candidate_solution(current_position)
            if next_position is not None:
                self.improve_colouring(next_position)
        self.update_pheromones_matrix()

        return self.assigned_colours


class AntColony(Ant):
    def __init__(self, Q, alpha, beta, rho, no_of_ants, num_iterations) -> None:
        self.Q = Q
        self.alpha = alpha
        self.beta = beta
        self.rho = rho
        self.no_of_ants = no_of_ants
        self.best_solution = {}
        self.pheromones_matrix = {}
        self.best_solution_score = 0
        self.num_iterations = num_iterations

    def initialize_pheromones_matrix(self):
        self.pheromones_matrix = {
            (i, j): 1 for i in self.graph.G.keys() for j in self.graph.G.keys()
        }
        for i in list(self.graph.G.keys()):
            for j in self.graph.get_neighbors(i):
                self.pheromones_matrix[(i, j)] = 0

    def run(self):

        import json

        data = {i: [] for i in range(self.num_iterations)}

        print(data)

        file = open("results.json", "w+")

        self.initialize_pheromones_matrix()
        for i in range(1):
            print(f"Iteration {i}")
            for j in range(2):
                print(f"Ant {j}")
                a = Ant(
                    self.Q,
                    self.alpha,
                    self.beta,
                    self.rho,
                    self.graph,
                    self.pheromones_matrix,
                )
                assigned_colours = a.run()
                if self.best_solution_score < len(set(assigned_colours.values())):
                    self.best_solution = assigned_colours
                    self.best_solution_score = len(set(assigned_colours.values()))

                solution = list(assigned_colours.values())
                solution_score = len(set(solution))
                nodes = list(self.graph.G.keys())

                data[i].append(
                    {
                        "solution": solution,
                        "solution_score": solution_score,
                        "nodes": nodes,
                    }
                )
            print(self.best_solution_score)

        file.write(json.dumps(data))

        return self.best_solution, self.best_solution_score
