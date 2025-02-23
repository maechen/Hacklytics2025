# Hacklytics2025

## Inspiration
Sports unite cultures, but complex and unfamiliar rules can intimidate newcomers. Events like the Super Bowl or Olympics mark a significant cultural moment for bonding and entertainment, especially in the United States. However, many individuals feel left out and burdensome to friends for constantly asking what’s going on in the game. To tackle this issue, Sportif-AI was created to provide Computer Vision and Generative AI-powered sports analysis to educate anyone about the rules of the game. 

## What it does
By training object detection models and using feature engineering, Sportif-AI detects gameplay events such as when ball possession shifts (ball passes and steals). This data is then fed into a fine-tuned GPT-2 model from Hugging Face to generate concise sports explanations that anybody can easily understand. Thus, Sportif-AI can also provide contextualized insights into niche sports such as cricket or curling to help further our goal of transforming passive watching into active learning. 
> #### Key features:
> * Multi-Object Tracking: Identifies players, referees, and balls using bounding boxes and trajectories.
> * Spatiotemporal Analysis: Normalizes player/ball coordinates relative to field key points (penalty areas, corners).
> * Contextualized LLM Commentary: Uses a fine-tuned GPT-2 model to explain events (“Player 10 passed backward to evade defenders – a common strategy to reset attacking momentum”).
> #### Tech Stack
> * Dataset Curation: Kaggle, DFL Bundesliga clips (460 videos of 30 seconds).
> * Computer Vision: YOLOv8x (player/ball detection), Homography (field key points detection), ByteTrack (multi-object tracking), Roboflow (dataset preprocessing).
> * NLP Pipeline: Hugging Face Transformers (GPT-2-124M), PyTorch, ONNX Runtime.
> * Backend: Express.js (REST API), Jupyter/Colab (model training).
> * Frontend: Next.js (dynamic UI)

## How we built it
> ### Sports Analysis
>> To tackle the dynamic nature of live sports, our goal was to prioritize context without compromising speed.
>> #### Training
>>> For training, we curated a diverse dataset from Roboflow Universe and Kaggle with edge cases such as high-speed ball movements under varying lighting and limited framing to ensure robustness. Using YOLOv8x, we trained a custom object detection model with 50 epochs to identify players, goalkeepers, and the ball, while our field detector mapped boundaries using homography normalization. This dual-model approach allowed us to contextualize player positions relative to field zones.

>> #### Data Cleaning
>>> We feature-engineered a minimalistic schema tracking ball coordinates, possession states (via Euclidean distance to nearest player), and player's team affiliations. By collapsing frame-by-frame data into sequential "possession events," we reduced JSON payloads by 70%, manipulating gameplay into a timeline of critical moments into an array of json objects, a compact representation that retained complex context.

> #### Gen AI
>> Generative AI’s power lies in its ability to humanize structured data. We designed a schema-to-story pipeline where possession events are fed into a fine-tuned GPT-2 model (Hugging Face Transformers) via dynamic prompts. Unlike traditional LLM inputs (unstructured text), our JSON schema provided explicit spatial and tactical context, enabling the model to generate rule-aware explanations of the game like: “Player 10 executed a quick pass to Player 7 to avoid a tackle—a ‘give-and-go’ tactic often used to break defensive lines.”

> #### UI/UX
>> To mirror the familiarity of platforms like ESPN, we built a Next.js interface with a split-screen layout: live video stream on the left, AI commentary on the right. 
>>Critical UX decisions:
>>> * On-Demand Learning: An “Explain This Play” button lets users choose when to engage without disrupting viewing immersion.
>>> * Sport Exploration Hub: A recommendation section suggests niche sports like american football or cricket based on user interactions, fostering discovery.

## Challenges we ran into
Developing Sportif-AI tested our team’s adaptability across the entire machine learning pipeline. Finding high-quality, annotated datasets was very limited because we needed footage that did not have a lot of noise. 

Then we experienced many computational bottlenecks. Our laptops could not run YOLOv8x inference, and training Roboflow models with CPU-only inference took many hours. To fix this, we migrated to Google Colab and our team's Jupyter Hub server. However, we still experienced many kernel crashes and Jupyter Hub outages that would stop and reset training. 

Also when we began the NLP pipeline, we couldn't get GPT-2 to generate concise and rule-aware commentary. Initial outputs were nonsense until we implemented advanced prompt engineering methods like instruction priming, output formatting constraints, and data anchoring. 

## Accomplishments that we're proud of
Considering we trained 2 object detection models, and used spatial analytics and NLP, we are so proud that we built a functional MVP in 36 hours. Our YOLOv8x model achieved 89% mean average precision on player/ball detection. Beyond metrics, we believe we've pioneered an educational framework: translating raw object trajectories into digestible insights. 

We are also proud of the user-friendly interface because although this is a datathon, we wanted to highlight the true potential of this AI product in the sports and entertainment industry. Our application does not take away from the joy of watching live sports. Instead, it enhances it with both its sports-friendly design layout and user-initiated AI play explanations.

Finally, the most rewarding outcome was our team’s growth. None of us had ever trained our own model before, let alone even taken a data science or AI class, so we are proud that we continued to grow our data science skills and not give up on our idea despite the difficulty for beginners.

## What we learned
Through this project, we gained hands-on experience with object detection models. Specifically, we learned how anchor boxes impact detection precision. We also learned how to train these models using NVIDIA GPU and discovered the amazing computing power of GPUs VS CPUs. Data wrangling also taught us to handle class imbalances like goalie and referee labels and clean misannotated bounding boxes. On the NLP side, we explored GPT-2’s limitations and how to improve its outputs using the advanced prompting techniques mentioned earlier.

## What's next for SportifAI
* **Enhanced Detector Model:** Further train the detector model with a larger dataset, using a powerful GPU to handle high-speed ball tracking and improve overall accuracy.
* **Improve UI:** Replace the “What’s Happening?” button with a chat input from the user to answer specific sports education questions and make the web app more engaging.
* **Live Stream Integration:** Integrate live streams and potentially sell the solution to large-scale sports organizations for real-time AI-powered insights.
* **Text-to-Speech & Speech-to-Text:** Provide options for audio commentary and voice input to increase accessibility for individuals with disabilities.
* **Expand Game Event & Rule Explanations:** Track complex plays such as penalties and red cards and offer in-depth rule explanations to help viewers better understand the sport's rules. 

# Contributers
Mae Chen, @maechen

Kate Jeong, @katejeongg

Abhushan Pradhan, @apradhan7678

Stuthi Bhat, @stuthibhat