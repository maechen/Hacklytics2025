import torch
import numpy as np
import supervision as sv
import json
from inference import get_model
from sports.common.view import ViewTransformer
from sports.configs.soccer import SoccerPitchConfiguration
from collections import deque
from datetime import datetime
from tqdm import tqdm
import os
import argparse

def main():
    parser = argparse.ArgumentParser(description='Process soccer video')
    parser.add_argument('input_video', help='Input video file path')
    parser.add_argument('output_json', help='Output JSON file path')
    args = parser.parse_args()

    os.environ["ONNXRUNTIME_EXECUTION_PROVIDERS"] = "[AzureExecutionProvider]"
    os.environ["CUDA_VISIBLE_DEVICES"] = "0"
    
    if not torch.cuda.is_available():
        raise RuntimeError("CUDA is not available. Check GPU configuration.")

    # Initialize models
    PLAYER_DETECTION_MODEL = get_model(model_id="football-players-detection-3zvbc-d9sl2/2", api_key='mkzn8v26l5SKFv5y0cA2')
    FIELD_DETECTION_MODEL = get_model(model_id="football-field-detection-f07vi/14", api_key='mkzn8v26l5SKFv5y0cA2')

    # Initialize trackers and classifiers
    tracker = sv.ByteTrack()
    CONFIG = SoccerPitchConfiguration()
    M = deque(maxlen=5)  # For view transformation smoothing

    def has_ball(player_pos, ball_pos, threshold=100.0):
        # Handle empty positions
        if player_pos is None or ball_pos is None:
            return False
        if player_pos.size == 0 or ball_pos.size == 0:
            return False
        
        # Ensure positions are 2D points
        if player_pos.shape != (2,) or ball_pos.shape != (2,):
            return False
        
        return np.linalg.norm(player_pos - ball_pos) < threshold

    def process_video(video_path):
        print(f"Starting video processing: {video_path}")
        start_time = datetime.now()
        
        video_info = sv.VideoInfo.from_video_path(video_path)
        frame_generator = sv.get_video_frames_generator(video_path)
        features = {}
        
        # Initialize progress bar
        progress_bar = tqdm(
            total=video_info.total_frames,
            desc="Processing frames",
            unit="frames",
            bar_format="{l_bar}{bar}| {n_fmt}/{total_fmt} [{elapsed}<{remaining}, {rate_fmt}]"
        )

        for frame_idx, frame in enumerate(frame_generator):
            frame_data = {"players": {}, "ball": None}
            
            # Update progress bar
            progress_bar.set_postfix({
                "current_frame": frame_idx,
                "players_tracked": 0,
                "ball_detected": False
            })
            
            # Player/ball detection
            player_result = PLAYER_DETECTION_MODEL.infer(frame, confidence=0.3)[0]
            detections = sv.Detections.from_inference(player_result)
            
            # Ball processing
            ball_detections = detections[detections.class_id == 0]
            ball_detections.xyxy = sv.pad_boxes(ball_detections.xyxy, px=10)
            
            # Player tracking
            people_detections = detections[detections.class_id != 0]
            people_detections = people_detections.with_nms(0.5, True)
            people_detections = tracker.update_with_detections(people_detections)
            
            # Field transformation
            field_result = FIELD_DETECTION_MODEL.infer(frame, confidence=0.3)[0]
            key_points = sv.KeyPoints.from_inference(field_result)
            valid_points = key_points.confidence[0] > 0.5
            
            if np.sum(valid_points) >= 4:
                frame_ref = key_points.xy[0][valid_points]
                pitch_ref = np.array(CONFIG.vertices)[valid_points]
                transformer = ViewTransformer(frame_ref, pitch_ref)
                M.append(transformer.m)
                transformer.m = np.mean(M, axis=0) if M else transformer.m
                
                # Ball coordinates
                ball_xy = ball_detections.get_anchors_coordinates(sv.Position.BOTTOM_CENTER)
                ball_pos = transformer.transform_points(ball_xy)[0] if ball_xy.size > 0 else None
                frame_data["ball"] = ball_pos.tolist() if ball_pos is not None else None
                
                # Player processing
                player_count = 0
                for idx, (xyxy, tracker_id, class_id) in enumerate(zip(
                    people_detections.xyxy,
                    people_detections.tracker_id,
                    people_detections.class_id
                )):
                    player_xy = people_detections.get_anchors_coordinates(sv.Position.BOTTOM_CENTER)[idx]
                    pitch_pos = transformer.transform_points(np.array([player_xy]))[0] if player_xy.size > 0 else None
                    
                    frame_data["players"][int(tracker_id)] = {
                        "coordinates": pitch_pos.tolist() if pitch_pos is not None else [],
                        "team": int(class_id - 1),
                        "has_ball": has_ball(
                            pitch_pos if pitch_pos is not None else np.array([]),
                            ball_pos if ball_pos is not None else np.array([])
                        )
                    }
                    player_count += 1

                # Update progress bar with current stats
                progress_bar.set_postfix({
                    "current_frame": frame_idx,
                    "players_tracked": player_count,
                    "ball_detected": ball_pos is not None
                })

            features[frame_idx] = frame_data
            progress_bar.update(1)

        progress_bar.close()
        duration = datetime.now() - start_time
        print(f"Processing completed in {duration}")
        print(f"Total frames processed: {video_info.total_frames}")
        print(f"Features collected: {len(features)} frames")
        
        return features

    def save_features_to_json(features_dict, filename=None):
        # Create default filename with timestamp
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"soccer_analysis_{timestamp}.json"
        
        # Convert numpy arrays and special types to native Python types
        def convert(value):
            if isinstance(value, np.ndarray):
                return value.tolist()
            if isinstance(value, np.generic):
                return value.item()
            return value
        
        # Recursive conversion
        def recursive_convert(obj):
            if isinstance(obj, dict):
                return {k: recursive_convert(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [recursive_convert(v) for v in obj]
            else:
                return convert(obj)
        
        # Serialize and save
        with open(filename, 'w') as f:
            json.dump(recursive_convert(features_dict), f, indent=2)
            
        print(f"Saved analysis to {filename}")
    
    features_dict = process_video(args.input_video)
    save_features_to_json(features_dict, args.output_json)

if __name__ == "__main__":
    main()