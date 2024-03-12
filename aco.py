import random


class Graph:

    def __init__(self) -> None:
        self.G = {}
        self.nodes = 0
        self.edges = 0

    def get_neighbors(self, vertex):
        neighbors = self.G[vertex]
        return [i[0] for i in neighbors]


class ACO:
    def __init__(self, Q, alpha, beta, rho, no_of_ants, num_iterations) -> None:
        self.Q = Q
        self.alpha = alpha
        self.beta = beta
        self.rho = rho
        self.no_of_ants = no_of_ants
        self.best_solution = []
        self.best_solution_score = 0
        self.pheromones_matrix = {}
        self.distance_matrix = {}
        self.num_iterations = num_iterations
        self.graph = Graph()

    def generate_distance_matrix(self):
        for i in range(1, self.graph.nodes + 1):
            for j in range(1, self.graph.nodes + 1):
                if i == j:
                    self.distance_matrix[(i, j)] = 0
                elif j in self.graph.get_neighbors(i):
                        self.distance_matrix[(i, j)] = (
                            1 / self.graph.G[i][self.graph.get_neighbors(i).index(j)][1]
                        )
                else:
                    self.distance_matrix[(i, j)] = 0

    def generate_pheromones_matrix(self):
        for i in range(1, self.graph.nodes + 1):
            for j in range(1, self.graph.nodes + 1):
                self.pheromones_matrix[(i, j)] = 0.5

    def get_probabilty_vector(self, vertex, visited):
        neighbors = self.graph.get_neighbors(vertex)
        probability_vector = []
        for neighbor in neighbors:
            if neighbor not in visited:
                probability_vector.append(
                    (
                        self.pheromones_matrix[(vertex, neighbor)] ** self.alpha
                        * self.distance_matrix[(vertex, neighbor)] ** self.beta
                    )
                )
            else:
                probability_vector.append(0)

        return [
            vec / sum(probability_vector)
            for vec in probability_vector
            if sum(probability_vector) != 0
        ]

    def move_ant(self, start_vertex):
        visited = [start_vertex]

        #  !TODO: WTFF IS THIS ??
        while len(visited) < self.graph.nodes:
            neighbors = self.graph.get_neighbors(visited[-1])
            probability_vector = self.get_probabilty_vector(visited[-1], visited)
            if sum(probability_vector) == 0:
                break
            next_vertex = random.choices(neighbors, probability_vector)[0]
            visited.append(next_vertex)
        return visited

    def evaluate_solution(self, solution):
        distance = 0
        for i in range(len(solution) - 1):
            distance += self.distance_matrix[(solution[i], solution[i + 1])]
        return distance

    def update_pheromone_matrix(self, solution, distance):
        for i in range(len(solution) - 1):
            self.pheromones_matrix[(solution[i], solution[i + 1])] = (
                self.pheromones_matrix[(solution[i], solution[i + 1])] * 1
                - self.rho
                + self.Q / distance
            )
        if distance > self.best_solution_score:
            self.best_solution = solution
            self.best_solution_score = distance

    def run(self):
        self.read_data()
        self.generate_pheromones_matrix()
        self.generate_distance_matrix()
        for _ in range(self.num_iterations):
            print(f"Running iteration {_}")
            for ant in range(self.no_of_ants):
                start_vertex = random.choice(list(range(1, self.graph.nodes + 1)))
                ant_solution = self.move_ant(start_vertex)
                distance = self.evaluate_solution(ant_solution)
                self.update_pheromone_matrix(ant_solution, distance)
                print(distance)
        return self.best_solution, self.best_solution_score
