# iterate all frames
# locate ball by looking at class field
# find player possession by finding lowest distance between player and ball with every player
# store tracker and starting position and frame number (time)
# check possession switch with closestPlayer != player with ball
# append event info to return array (tracker, deltax, deltay, deltat)
# update possession info

import math
import json

def clean_data():
    with open('soccer_analysis.json', 'r', encoding='utf-8') as file:
        data = json.load(file)

    print(data)
    POSSESSION_THRESHOLD = 1.5  # minimum distance between player and ball to be considered possession
    MIN_MOVEMENT = 0.1 # help ignore small movements

    events = []
    current_possession = None
    prev_positions = {}  # {player_id: (x, y, time)}
    
    for frame in data.items():
        ball = frame['ball']
        players = frame['players']
        
        # find closest player
        closest_player = None
        min_distance = float('inf') # infinity
        
        for player in players:
            dist = math.hypot(player['x']-ball['x'], player['y']-ball['y'])
            if dist < min_distance and dist < POSSESSION_THRESHOLD:
                min_distance = dist
                closest_player = player

        if not closest_player:  # no one in possession
            current_possession = None
            continue

        # possession change
        if closest_player['id'] != current_possession:
            prev_data = prev_positions.get(closest_player['id'], (0, 0, 0))
            delta_x = abs(closest_player['x'] - prev_data[0])
            delta_y = abs(closest_player['y'] - prev_data[1])
            delta_t = frame['time'] - prev_data[2] if prev_data[2] != 0 else 0

            events.append({
                'player': closest_player['id'],
                'x': closest_player['x'],
                'y': closest_player['y'],
                'dx': delta_x,
                'dy': delta_y,
                'dt': delta_t,
                't': frame['time']
            })
            
            current_possession = closest_player['id']

        prev_positions[closest_player['id']] = (
            closest_player['x'],
            closest_player['y'],
            frame['time']
        )

        print(events)
    
    return events

clean_data()