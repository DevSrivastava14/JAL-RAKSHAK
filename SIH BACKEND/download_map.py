import osmnx as ox

center_coords = (19.0549990, 72.8692035)
graph = ox.graph_from_point(center_coords, dist=20000, network_type="drive")

graph = ox.routing.add_edge_speeds(graph)
graph = ox.routing.add_edge_travel_times(graph)

filepath = "mumbai_graph.graphml"
ox.save_graphml(graph, filepath)
print(f"Success! Map saved locally as {filepath}.")