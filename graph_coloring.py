from GraphColoringACO import Ant, Graph, AntColony

class GraphColoring(AntColony):

    def __init__(self, file, Q, alpha, beta, rho, no_of_ants, generations) -> None:
        super().__init__(Q, alpha, beta, rho, no_of_ants, generations)
        self.file = file
        self.nodes = 0
        self.edges = 0
        self.Q = Q
        self.alpha = alpha
        self.beta = beta
        self.rho = rho
        self.no_of_ants = no_of_ants
        self.generations = generations
        self.read_data()

    def read_data(self):
        opened_file = open(self.file, "r")
        lines = opened_file.read().split("\n")
        for line in lines:
            if line and line[0] == "p":
                self.graph.nodes, self.graph.edges = [
                    int(num) for num in line.split(" ")[2:]
                ]
                self.graph.G = {i: [] for i in range(1, self.graph.nodes + 1)}
            if line and line[0] == "e":
                node, edge = [int(num) for num in line.split(" ")[1:]]
                self.graph.G[node].append((edge, 1))
                self.graph.G[edge].append((node, 1))
        # print(self.graph.G)


file = "le450_15b.col.txt"

graphColoring = GraphColoring(
    file=file, Q=1, alpha=1, beta=1, rho=0.5, no_of_ants=10, generations=100
)
print(graphColoring.run())



# print(data)
