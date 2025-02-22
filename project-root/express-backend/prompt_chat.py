import os
from langchain import HuggingFaceHub, PromptTemplate, LLMChain
import json
from getpass import getpass

def get_response():
    with open("game_data.json", "r") as file:
        game_data = json.load(file)
    game_data_str = json.dumps(game_data, indent=2)


    HUGGINGFACEHUB_API_TOKEN = "API_KEY" # insert api key here
    # use os to get api key from environment variable

    model_id = "gpt2"
    conv_model = HuggingFaceHub(huggingfacehub_api_token=os.environ['HUGGINGFACEHUB_API_TOKEN'], 
                                repo_id=model_id, 
                                model_kwargs={"temperature":0.8, "max_new_tokens":200})

    template = """You are a soccer expert. Your explanation should be:
    - ** do not repeat prompt back as output**
    - **In 2 to 3 sentences**, explain **actions of player closest to the ball** (e.g., running with the ball, positioning for a pass, receiving, or overshooting).
    - Use simple, easy-to-understand language.
    - **Only refer to the data**—avoid mentioning anything not directly related to the player positions, ball movement, or ball speed.

    JSON data:
    {json_data}

    Query: {query}"""


    prompt = PromptTemplate(template=template, input_variables=['json_data', 'query'])

    conv_chain = LLMChain(llm=conv_model,
                        prompt=prompt,
                        verbose=True)
    
    output = conv_chain.run(json_data=game_data_str, query="Analyze current play:")
    return output

