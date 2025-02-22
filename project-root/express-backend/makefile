install:
    pip install -r requirements.txt
    npm install --prefix ../src

run-backend:
    python process_vid.py input.mp4 soccer_analytics.json && \
    python dataclean.py soccer_analytics.json && \
    python chat_prompt.py cleaned_data.json && \
    node server.js

setup-gpu:
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
    pip install inference-gpu onnxruntime-gpu==1.18.0
    pip install "supervision>=0.23.0" sports

.PHONY: install run-backend setup-gpu